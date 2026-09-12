/**
 * Godzilla Banger — ESP32 Firmware
 *
 * BLE GATT peripheral with one WRITE characteristic (commands from the app)
 * and one NOTIFY characteristic (status frames back to the app).
 * Wire protocol: see docs/DATA_PROTOCOL.md — UUIDs MUST match
 * src/services/BLEManager.ts.
 *
 * Libraries (Arduino IDE Library Manager):
 *   - ESP32 BLE Arduino (bundled with the ESP32 board package)
 *   - ArduinoJson (v6.x) — for SYNC payload parsing + status frame encoding
 *
 * Board: any ESP32 dev board. Relay module on RELAY_PIN, active-HIGH by default.
 */

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ArduinoJson.h>

// ---------- Config for ESP32 Super Mini ----------

// Relay Signal (IN) Pin
// For ESP32-C3 Super Mini: Use GPIO 7 or GPIO 6 or GPIO 2
// For Classic ESP32 (WROOM 30-pin): Use GPIO 26 or GPIO 4
#ifndef RELAY_PIN
#define RELAY_PIN 7
#endif

// On-board LED Pin for visual beat pulse feedback
// ESP32-C3 Super Mini: GPIO 8 (blue/orange LED)
// Classic ESP32: GPIO 2
#ifndef LED_PIN
#define LED_PIN 8
#endif

// Relay module logic level:
// Most 5V / 3.3V optical relay modules are Active-LOW (relay triggers when signal is LOW).
// If your relay module triggers on 3.3V/HIGH, set this to true.
#define RELAY_ACTIVE_HIGH false

#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define COMMAND_CHAR_UUID   "6e400002-b5a3-f393-e0a9-e50e24dcca9e" // WRITE
#define STATUS_CHAR_UUID    "6e400003-b5a3-f393-e0a9-e50e24dcca9e" // NOTIFY

#define DEVICE_NAME_PREFIX "GODZILLA-SUPERMINI-"
#define MAX_TRIGGERS 256
#define STATUS_NOTIFY_INTERVAL_MS 200
#define SYNC_BUFFER_SIZE 8192

// ---------- State ----------

struct Trigger {
  uint32_t t;      // offset ms from pattern start
  uint8_t state;   // 0 or 1
};

Trigger g_triggers[MAX_TRIGGERS];
uint16_t g_triggerCount = 0;
uint32_t g_durationMs = 0;

bool g_playing = false;
uint32_t g_playStartMillis = 0;
uint32_t g_pausedElapsedMs = 0;
uint16_t g_nextIndex = 0;

uint8_t g_relayState = 0; // last applied relay state (manual override or scheduled)

BLECharacteristic *g_statusChar = nullptr;
bool g_deviceConnected = false;
uint32_t g_lastStatusNotify = 0;

// SYNC chunk reassembly
String g_syncBuffer;
int g_syncExpectedChunks = -1;
int g_syncReceivedChunks = 0;

// ---------- Relay helpers ----------

void applyRelay(uint8_t state) {
  g_relayState = state ? 1 : 0;
  // Apply logic level to relay pin
  bool relayPinState = (g_relayState == 1) ? (RELAY_ACTIVE_HIGH ? HIGH : LOW) : (RELAY_ACTIVE_HIGH ? LOW : HIGH);
  digitalWrite(RELAY_PIN, relayPinState);

  // Sync on-board LED (ESP32-C3 Super Mini LED is active LOW)
  digitalWrite(LED_PIN, (g_relayState == 1) ? LOW : HIGH);
}

// ---------- Command handling ----------

void resetSyncBuffer() {
  g_syncBuffer = "";
  g_syncExpectedChunks = -1;
  g_syncReceivedChunks = 0;
}

void handleSyncEnd() {
  StaticJsonDocument<SYNC_BUFFER_SIZE> doc;
  DeserializationError err = deserializeJson(doc, g_syncBuffer);
  resetSyncBuffer();

  if (err) {
    Serial.print("SYNC parse error: ");
    Serial.println(err.c_str());
    return;
  }

  g_durationMs = doc["durationMs"] | 0;
  JsonArray triggers = doc["triggers"].as<JsonArray>();

  g_triggerCount = 0;
  for (JsonArray pair : triggers) {
    if (g_triggerCount >= MAX_TRIGGERS) break;
    g_triggers[g_triggerCount].t = pair[0].as<uint32_t>();
    g_triggers[g_triggerCount].state = pair[1].as<uint8_t>();
    g_triggerCount++;
  }

  g_playing = false;
  g_pausedElapsedMs = 0;
  g_nextIndex = 0;

  Serial.printf("Synced %u triggers, duration %u ms\n", g_triggerCount, g_durationMs);
}

void handleCommandLine(const String &line) {
  if (line.startsWith("RELAY:")) {
    applyRelay(line.charAt(6) == '1' ? 1 : 0);
    return;
  }

  if (line.startsWith("CTRL:PLAY")) {
    g_playStartMillis = millis() - g_pausedElapsedMs;
    g_playing = true;
    return;
  }

  if (line.startsWith("CTRL:PAUSE")) {
    if (g_playing) g_pausedElapsedMs = millis() - g_playStartMillis;
    g_playing = false;
    return;
  }

  if (line.startsWith("CTRL:STOP")) {
    g_playing = false;
    g_pausedElapsedMs = 0;
    g_nextIndex = 0;
    return;
  }

  if (line.startsWith("SYNC:BEGIN:")) {
    resetSyncBuffer();
    g_syncExpectedChunks = line.substring(strlen("SYNC:BEGIN:")).toInt();
    return;
  }

  if (line.startsWith("SYNC:CHUNK:")) {
    // Format: SYNC:CHUNK:<index>:<data>
    int firstColon = line.indexOf(':', strlen("SYNC:CHUNK:"));
    String data = line.substring(firstColon + 1);
    g_syncBuffer += data;
    g_syncReceivedChunks++;
    return;
  }

  if (line.startsWith("SYNC:END")) {
    handleSyncEnd();
    return;
  }
}

class CommandCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *characteristic) override {
    std::string value = characteristic->getValue();
    if (value.empty()) return;
    String line = String(value.c_str());
    line.trim();
    if (line.length() > 0) handleCommandLine(line);
  }
};

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *server) override {
    g_deviceConnected = true;
  }
  void onDisconnect(BLEServer *server) override {
    g_deviceConnected = false;
    // Safety: drop the relay when the app disconnects mid-pattern.
    applyRelay(0);
    g_playing = false;
    BLEDevice::startAdvertising();
  }
};

// ---------- Playback scheduler (runs on the ESP32's own millis() clock) ----------

void updatePlayback() {
  if (!g_playing || g_triggerCount == 0 || g_durationMs == 0) return;

  uint32_t elapsed = millis() - g_playStartMillis;

  if (elapsed >= g_durationMs) {
    // Loop back to the start of the pattern.
    g_playStartMillis = millis();
    elapsed = 0;
    g_nextIndex = 0;
  }

  while (g_nextIndex < g_triggerCount && g_triggers[g_nextIndex].t <= elapsed) {
    applyRelay(g_triggers[g_nextIndex].state);
    g_nextIndex++;
  }
}

void notifyStatus() {
  if (!g_deviceConnected || g_statusChar == nullptr) return;
  if (millis() - g_lastStatusNotify < STATUS_NOTIFY_INTERVAL_MS) return;
  g_lastStatusNotify = millis();

  StaticJsonDocument<128> doc;
  doc["relay"] = g_relayState;
  doc["playing"] = g_playing;
  doc["nextIndex"] = g_playing ? g_nextIndex : -1;
  doc["deviceMillis"] = millis();

  char buf[128];
  size_t len = serializeJson(doc, buf, sizeof(buf));
  g_statusChar->setValue((uint8_t *)buf, len);
  g_statusChar->notify();
}

// ---------- Setup / loop ----------

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  applyRelay(0);

  Serial.println("\n=================================");
  Serial.println("  GODZILLA BANGER - ESP32 SUPER MINI");
  Serial.println("=================================");
  Serial.printf("Relay Pin: GPIO %d\n", RELAY_PIN);
  Serial.printf("On-board LED: GPIO %d\n", LED_PIN);
  Serial.println("Wiring:");
  Serial.println("  ESP32 5V (or 3.3V) -> Relay VCC");
  Serial.println("  ESP32 GND          -> Relay GND");
  Serial.printf("  ESP32 GPIO %d       -> Relay IN\n", RELAY_PIN);
  Serial.println("=================================\n");

  String deviceName = String(DEVICE_NAME_PREFIX) + String((uint32_t)(ESP.getEfuseMac() & 0xFFFF), HEX);
  BLEDevice::init(deviceName.c_str());

  BLEServer *server = BLEDevice::createServer();
  server->setCallbacks(new ServerCallbacks());

  BLEService *service = server->createService(SERVICE_UUID);

  BLECharacteristic *commandChar = service->createCharacteristic(
      COMMAND_CHAR_UUID,
      BLECharacteristic::PROPERTY_WRITE
  );
  commandChar->setCallbacks(new CommandCallbacks());

  g_statusChar = service->createCharacteristic(
      STATUS_CHAR_UUID,
      BLECharacteristic::PROPERTY_NOTIFY
  );
  g_statusChar->addDescriptor(new BLE2902());

  service->start();

  BLEAdvertising *advertising = BLEDevice::getAdvertising();
  advertising->addServiceUUID(SERVICE_UUID);
  advertising->setScanResponse(true);
  BLEDevice::startAdvertising();

  Serial.print("Advertising as ");
  Serial.println(deviceName);
}

void loop() {
  updatePlayback();
  notifyStatus();
  delay(5); // yield for BLE stack; keep short for millisecond-accurate scheduling
}

export const BLE_CONFIG = {
  DEVICE_NAME_PREFIX: 'Godzilla_Banker',
  // Nordic UART Service (NUS) - widely supported, rock solid for ESP32 BLE Serial
  SERVICE_UUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
  CHARACTERISTIC_RX_UUID: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // App -> ESP32 (Write)
  CHARACTERISTIC_TX_UUID: '6e400003-b5a3-f393-e0a9-e50e24dcca9e', // ESP32 -> App (Notify)
  
  // Timing & Watchdog
  KEEPALIVE_INTERVAL_MS: 1500,
  WATCHDOG_TIMEOUT_MS: 3500,
  SCAN_DURATION_MS: 8000,
  MAX_BATCH_SIZE: 64, // Max pin triggers per batch packet
};

# Godzilla Banker

Mobile control center for drawing/mapping beat patterns and syncing them
to an ESP32-driven relay over BLE.

## App setup (Expo, bare/dev-client — BLE isn't available in Expo Go)

```bash
npx create-expo-app godzilla-banker -t expo-template-blank-typescript
cd godzilla-banker
npx expo install react-native-ble-plx react-native-svg @react-native-community/slider
npm install buffer
npx expo prebuild
npx expo run:android   # or run:ios
```

Then drop in `App.tsx` and everything under `src/` from this delivery.

`react-native-ble-plx` needs native linking, which is why this requires a
dev client / bare workflow rather than Expo Go. On Android you'll also
need to request `BLUETOOTH_SCAN` / `BLUETOOTH_CONNECT` (API 31+) or
`ACCESS_FINE_LOCATION` (older) at runtime before calling `scanAndConnect`.

## Firmware setup

1. Arduino IDE → Boards Manager → install the **esp32** board package.
2. Library Manager → install **ArduinoJson** (v6.x).
3. Open `firmware/godzilla_banker_esp32.ino`, set `RELAY_PIN` to whatever
   GPIO your relay module's IN pin is wired to, flash to the board.
4. Power the ESP32 — it advertises as `GODZILLA-<chip-id-suffix>`.

## Project layout

```
App.tsx                          # screen composition + rAF sync dispatcher
src/types/index.ts                # BeatPattern / BeatTrigger / status types
src/services/beatMath.ts          # grid quantization, ms<->px, due-trigger lookup
src/services/BLEManager.ts        # scan/connect/RSSI + command protocol
src/components/Header.tsx         # title + BT status/RSSI badge
src/components/BeatCanvas.tsx     # tap-to-pin canvas + playback scrubber
src/components/ControlPanel.tsx   # play/pause/clear/sync, BPM slider, override
firmware/godzilla_banker_esp32.ino
docs/DATA_PROTOCOL.md             # exact wire format, read this before touching either side
```

## Notes / next hardening steps

- The GATT UUIDs in `BLEManager.ts` and the firmware **must match** —
  they're placeholder-but-valid custom UUIDs; regenerate your own if you
  want this to not collide with someone else's BLE-UART-alike device.
- No checksum/ack on `SYNC:*` chunks yet — fine on a workbench, but for a
  noisy RF environment add a chunk-count or CRC ack before trusting a
  synced pattern in the field.
- `MAX_TRIGGERS` is 256 in firmware; raise it (and `SYNC_BUFFER_SIZE`)
  if you need denser patterns, watch ESP32 RAM.
- Relay polarity: flip `RELAY_ACTIVE_HIGH` if your module is active-low.

# Godzilla Banker — BLE Data Protocol

Custom GATT service. UUIDs must match exactly between
`src/services/BLEManager.ts` and `firmware/godzilla_banker_esp32.ino`.

| Role       | UUID                                   | Properties |
|------------|-----------------------------------------|------------|
| Service    | `6e400001-b5a3-f393-e0a9-e50e24dcca9e` | —          |
| Command    | `6e400002-b5a3-f393-e0a9-e50e24dcca9e` | WRITE      |
| Status     | `6e400003-b5a3-f393-e0a9-e50e24dcca9e` | NOTIFY     |

All command payloads are UTF-8 strings, newline-terminated, base64-encoded
at the BLE transport layer by `react-native-ble-plx` (handled for you by
`BLEManager.writeCommand`).

## Commands (app → ESP32, on the Command characteristic)

### Manual relay override
```
RELAY:1\n   // drive relay HIGH immediately
RELAY:0\n   // drive relay LOW immediately
```
Applied immediately regardless of playback state — used by the Manual
Override switch and by the live-preview dispatcher in `App.tsx` as the
playback cursor crosses each pinned trigger.

### Transport control (drives the ESP32's own scheduler, post-SYNC)
```
CTRL:PLAY\n
CTRL:PAUSE\n
CTRL:STOP\n
```

### Pattern sync (push a full schedule for autonomous, jitter-free playback)
BLE MTU is small, so the JSON payload is chunked. Framing:
```
SYNC:BEGIN:<total_chunk_count>\n
SYNC:CHUNK:<index>:<chunk_data>\n   // repeated, index 0..total_chunk_count-1
SYNC:END\n
```
Reassembled JSON shape:
```json
{
  "bpm": 120,
  "durationMs": 8000,
  "triggers": [
    [0, 1],
    [500, 0],
    [1000, 1]
  ]
}
```
Each trigger is a `[t_ms, state]` pair — arrays instead of objects to keep
the payload small, since this may be split across many BLE writes. Trigger
list MUST be sorted ascending by `t_ms`; the firmware assumes this and
walks it with a single monotonic index (`g_nextIndex`) rather than
searching, which is what keeps playback deterministic on-device.

Chunk size defaults to 180 bytes (`SAFE_CHUNK_BYTES` in `BLEManager.ts`),
comfortably under the 185-byte MTU requested at connect time. If you
change `requestMTU`, keep the chunk size a safe margin below it to leave
room for the `SYNC:CHUNK:<index>:` prefix and BLE ATT overhead.

## Status frames (ESP32 → app, on the Status characteristic, NOTIFY)

Sent every ~200ms while a central is connected:
```json
{
  "relay": 0,
  "playing": true,
  "nextIndex": 4,
  "deviceMillis": 128302
}
```
- `relay` — last applied relay state (0/1), whether from manual override or scheduled playback.
- `playing` — whether the on-device scheduler is currently running a synced pattern.
- `nextIndex` — index of the next trigger the firmware expects to fire, or `-1` when idle.
- `deviceMillis` — firmware's own `millis()` at the time of the frame, useful for spotting BLE-clock drift if you later add resync logic.

## Two playback modes, by design

1. **Live preview** — `App.tsx`'s `requestAnimationFrame` loop walks the
   in-memory pattern on the *phone's* clock and fires `RELAY:1`/`RELAY:0`
   over BLE the instant the cursor crosses a pin. Good for sketching and
   auditioning a pattern, but timing is only as good as BLE write latency
   (typically 10-30ms, spikier under interference).
2. **Synced/autonomous** — the **Sync** button pushes the whole pattern
   down once via `SYNC:*`, then `CTRL:PLAY` hands timing over to the
   ESP32's own `millis()` scheduler. This is the mode to use for anything
   where sub-BLE-latency timing actually matters, since the relay toggles
   run entirely on-device once synced.

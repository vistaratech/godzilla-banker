import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, PanResponder } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, G } from 'react-native-svg';
import { COLORS } from '../constants/theme';
import { BeatPin, QuantizeOption } from '../types';
import { quantizeTime, getBeatDurationMs, formatTimeMs } from '../utils/timeUtils';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CANVAS_PADDING = 16;
const CANVAS_WIDTH = SCREEN_WIDTH - CANVAS_PADDING * 2;
const CANVAS_HEIGHT = 200;
const PIN_RADIUS = 8;
const TRACK_Y = CANVAS_HEIGHT / 2;
const ON_LANE_Y = TRACK_Y - 35;
const OFF_LANE_Y = TRACK_Y + 35;
const SCRUBBER_WIDTH = 2;

interface BeatCanvasProps {
  pins: BeatPin[];
  bpm: number;
  totalDurationMs: number;
  currentTimeMs: number;
  quantize: QuantizeOption;
  relayActive: boolean;
  isPlaying: boolean;
  onAddPin: (timeMs: number, durationMs: number) => void;
  onRemovePin: (pinId: string) => void;
  onMovePin: (pinId: string, newTimeMs: number) => void;
}

export const BeatCanvas: React.FC<BeatCanvasProps> = ({
  pins,
  bpm,
  totalDurationMs,
  currentTimeMs,
  quantize,
  relayActive,
  isPlaying,
  onAddPin,
  onRemovePin,
  onMovePin,
}) => {
  const [draggingPinId, setDraggingPinId] = useState<string | null>(null);
  const svgRef = useRef<View>(null);

  const msToX = useCallback(
    (ms: number) => (ms / totalDurationMs) * CANVAS_WIDTH,
    [totalDurationMs]
  );

  const xToMs = useCallback(
    (x: number) => {
      const raw = (x / CANVAS_WIDTH) * totalDurationMs;
      return quantizeTime(Math.max(0, Math.min(raw, totalDurationMs)), bpm, quantize);
    },
    [totalDurationMs, bpm, quantize]
  );

  // Beat grid lines
  const beatMs = getBeatDurationMs(bpm);
  const gridLines: { x: number; isMajor: boolean }[] = [];
  for (let t = 0; t <= totalDurationMs; t += beatMs / 4) {
    const isMajor = t % beatMs < 1;
    gridLines.push({ x: msToX(t), isMajor });
  }

  // Scrubber position
  const scrubberX = msToX(Math.min(currentTimeMs, totalDurationMs));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isPlaying,
      onMoveShouldSetPanResponder: () => !isPlaying,
      onPanResponderGrant: (evt) => {
        const touchX = evt.nativeEvent.locationX;
        // Check if we tapped on an existing pin
        const hitPin = pins.find((p) => {
          const px = msToX(p.timeMs);
          return Math.abs(touchX - px) < PIN_RADIUS * 2;
        });

        if (hitPin) {
          setDraggingPinId(hitPin.id);
        }
      },
      onPanResponderMove: (evt) => {
        if (draggingPinId) {
          const touchX = evt.nativeEvent.locationX;
          const newTimeMs = xToMs(touchX);
          onMovePin(draggingPinId, newTimeMs);
        }
      },
      onPanResponderRelease: (evt) => {
        if (draggingPinId) {
          setDraggingPinId(null);
        } else {
          // No pin was dragged — add a new pin at tap location
          const touchX = evt.nativeEvent.locationX;
          const timeMs = xToMs(touchX);
          const defaultDuration = Math.max(50, beatMs / 4);
          onAddPin(timeMs, defaultDuration);
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>BEAT CANVAS</Text>
        <Text style={styles.durationLabel}>{formatTimeMs(totalDurationMs)}</Text>
      </View>

      <View
        ref={svgRef}
        style={styles.canvasWrap}
        {...panResponder.panHandlers}
      >
        <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          {/* Background */}
          <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={COLORS.background} rx={4} />

          {/* Grid lines */}
          {gridLines.map((gl, i) => (
            <Line
              key={`grid-${i}`}
              x1={gl.x}
              y1={0}
              x2={gl.x}
              y2={CANVAS_HEIGHT}
              stroke={gl.isMajor ? COLORS.gridLineMajor : COLORS.gridLine}
              strokeWidth={gl.isMajor ? 1 : 0.5}
            />
          ))}

          {/* ON / OFF lane labels */}
          <SvgText x={4} y={ON_LANE_Y + 3} fill={COLORS.atomicGreen} fontSize={8} fontWeight="bold" opacity={0.5}>
            ON
          </SvgText>
          <SvgText x={4} y={OFF_LANE_Y + 3} fill={COLORS.dangerRed} fontSize={8} fontWeight="bold" opacity={0.5}>
            OFF
          </SvgText>

          {/* Center track line */}
          <Line
            x1={0}
            y1={TRACK_Y}
            x2={CANVAS_WIDTH}
            y2={TRACK_Y}
            stroke={COLORS.panelBorder}
            strokeWidth={1}
            strokeDasharray="4,4"
          />

          {/* Pin duration blocks */}
          {pins.map((pin) => {
            const x = msToX(pin.timeMs);
            const w = msToX(pin.timeMs + pin.durationMs) - x;
            const isOn = pin.state === 'ON';
            const y = isOn ? ON_LANE_Y - 12 : OFF_LANE_Y - 12;
            const color = isOn ? COLORS.atomicGreen : COLORS.dangerRed;
            return (
              <G key={pin.id}>
                {/* Duration bar */}
                <Rect
                  x={x}
                  y={y}
                  width={Math.max(4, w)}
                  height={24}
                  fill={color}
                  opacity={0.25}
                  rx={3}
                />
                {/* Pin marker */}
                <Circle
                  cx={x}
                  cy={isOn ? ON_LANE_Y : OFF_LANE_Y}
                  r={PIN_RADIUS}
                  fill={color}
                  opacity={draggingPinId === pin.id ? 1 : 0.85}
                  stroke={draggingPinId === pin.id ? COLORS.textPrimary : 'none'}
                  strokeWidth={draggingPinId === pin.id ? 2 : 0}
                />
                {/* Pin label */}
                <SvgText
                  x={x}
                  y={(isOn ? ON_LANE_Y : OFF_LANE_Y) + 3}
                  fill={COLORS.background}
                  fontSize={7}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {isOn ? '▲' : '▼'}
                </SvgText>
              </G>
            );
          })}

          {/* Playback scrubber needle */}
          <Line
            x1={scrubberX}
            y1={0}
            x2={scrubberX}
            y2={CANVAS_HEIGHT}
            stroke={COLORS.scrubberNeedle}
            strokeWidth={SCRUBBER_WIDTH}
            opacity={0.9}
          />
          <Circle cx={scrubberX} cy={6} r={5} fill={COLORS.scrubberNeedle} />

          {/* Relay active glow indicator at scrubber base */}
          {relayActive && (
            <Circle cx={scrubberX} cy={CANVAS_HEIGHT - 6} r={6} fill={COLORS.atomicGreen} opacity={0.9} />
          )}
        </Svg>

        {/* Time cursor label */}
        <View style={[styles.timeLabel, { left: Math.min(scrubberX, CANVAS_WIDTH - 50) }]}>
          <Text style={styles.timeLabelText}>{formatTimeMs(currentTimeMs)}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>{pins.length} pin{pins.length !== 1 ? 's' : ''}</Text>
        <Text style={styles.infoText}>Tap to add • Long press to remove</Text>
        <Text style={styles.infoText}>Q: {quantize}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: CANVAS_PADDING,
    marginTop: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.atomicCyan,
    letterSpacing: 2,
  },
  durationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  canvasWrap: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderTopColor: 'rgba(255, 255, 255, 0.32)',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 16, 30, 0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  timeLabel: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'rgba(255, 45, 85, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timeLabelText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#fff',
    fontFamily: 'monospace',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  infoText: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
});


import React, { memo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 4 Bars × 15 steps = 60 steps total
export const BARS_CONFIG = [
  { id: 0, label: 'BAR 1', range: '1–15', start: 0, end: 14, count: 15 },
  { id: 1, label: 'BAR 2', range: '16–30', start: 15, end: 29, count: 15 },
  { id: 2, label: 'BAR 3', range: '31–45', start: 30, end: 44, count: 15 },
  { id: 3, label: 'BAR 4', range: '46–60', start: 45, end: 59, count: 15 },
];

const STRIP_PAD_WIDTH = Math.floor((SCREEN_WIDTH - 24 - 16 - (14 * 2.5)) / 15);
const GRID_PAD_WIDTH = Math.floor((SCREEN_WIDTH - 24 - 16 - (7 * 4)) / 8);

interface StepGridProps {
  steps: boolean[]; // 60 steps array
  currentPlayingStep: number; // 0 to 59, or -1 if stopped
  onToggleStep: (globalIndex: number) => void;
  initialViewMode?: 'strip' | 'grid';
}

interface StepPadProps {
  relativeNum: number;
  globalIndex: number;
  isActive: boolean;
  isPlaying: boolean;
  isBeatStart: boolean;
  viewMode: 'strip' | 'grid';
  onPress: () => void;
}

const StepPad: React.FC<StepPadProps> = memo(
  ({ relativeNum, globalIndex, isActive, isPlaying, isBeatStart, viewMode, onPress }) => {
    const isStrip = viewMode === 'strip';

    return (
      <TouchableOpacity
        style={[
          styles.padBase,
          isStrip ? styles.stripPad : styles.gridPad,
          isBeatStart && styles.padBeatStart,
          isActive ? styles.padActive : styles.padInactive,
          isPlaying && styles.padPlaying,
        ]}
        onPress={onPress}
        activeOpacity={0.65}
        hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
        accessibilityLabel={`Step ${globalIndex + 1}, ${isActive ? 'active' : 'inactive'}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isActive }}
      >
        <Text
          style={[
            styles.padText,
            isStrip ? styles.stripText : styles.gridText,
            isActive ? styles.textActive : styles.textInactive,
            isPlaying && styles.textPlaying,
          ]}
        >
          {relativeNum}
        </Text>

        {/* Micro indicator dot for inactive pads */}
        {!isActive && !isPlaying && (
          <View style={[styles.microDot, isBeatStart && styles.microDotBeat]} />
        )}
      </TouchableOpacity>
    );
  }
);

export const StepGrid: React.FC<StepGridProps> = ({
  steps = [],
  currentPlayingStep = -1,
  onToggleStep,
  initialViewMode = 'strip',
}) => {
  const [viewMode, setViewMode] = useState<'strip' | 'grid'>(initialViewMode);
  const activePlayingBar =
    currentPlayingStep >= 0 ? Math.floor(currentPlayingStep / 15) : -1;

  return (
    <View style={styles.container}>
      {/* Top Bar Header & View Mode Switch */}
      <View style={styles.topControlRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle}>60-STEP MASTER</Text>
          <Text style={styles.headerSub}>4 BARS • SINGLE PAGE</Text>
        </View>

        {/* Mode Toggle Pills */}
        <View style={styles.viewToggleGroup}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'strip' && styles.toggleBtnActive]}
            onPress={() => setViewMode('strip')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleBtnText,
                viewMode === 'strip' && styles.toggleBtnTextActive,
              ]}
            >
              15 Lanes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => setViewMode('grid')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleBtnText,
                viewMode === 'grid' && styles.toggleBtnTextActive,
              ]}
            >
              8×2 Grid
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4 BARS DISPLAYED ON A SINGLE PAGE */}
      {BARS_CONFIG.map((bar) => {
        const isBarPlaying = activePlayingBar === bar.id;
        // Count active steps in this bar
        let activeInBar = 0;
        for (let s = bar.start; s <= bar.end; s++) {
          if (steps[s]) activeInBar++;
        }

        return (
          <View
            key={bar.id}
            style={[
              styles.barCard,
              isBarPlaying && styles.barCardPlaying,
            ]}
          >
            {/* Bar Section Header */}
            <View style={styles.barHeader}>
              <View style={styles.barTitleRow}>
                <View
                  style={[
                    styles.barLed,
                    isBarPlaying ? styles.barLedActive : styles.barLedInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.barLabel,
                    isBarPlaying ? styles.barLabelActive : styles.barLabelInactive,
                  ]}
                >
                  {bar.label}
                </Text>
                {isBarPlaying && (
                  <View style={styles.playingBadge}>
                    <Text style={styles.playingBadgeText}>PLAYING</Text>
                  </View>
                )}
              </View>

              <View style={styles.barMetaRow}>
                <Text style={styles.rangeText}>{bar.range}</Text>
                {activeInBar > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{activeInBar}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Steps Container: Strip vs Grid View */}
            {viewMode === 'strip' ? (
              // 15-Pad Horizontal Lane
              <View style={styles.stripLane}>
                {Array.from({ length: 15 }).map((_, stepIdx) => {
                  const globalIndex = bar.start + stepIdx;
                  const relativeNum = stepIdx + 1;
                  const isActive = !!steps[globalIndex];
                  const isPlaying = currentPlayingStep === globalIndex;
                  const isBeatStart = stepIdx % 4 === 0;

                  return (
                    <StepPad
                      key={globalIndex}
                      relativeNum={relativeNum}
                      globalIndex={globalIndex}
                      isActive={isActive}
                      isPlaying={isPlaying}
                      isBeatStart={isBeatStart}
                      viewMode="strip"
                      onPress={() => onToggleStep(globalIndex)}
                    />
                  );
                })}
              </View>
            ) : (
              // 8×2 Grid View (Row 1: 8 pads, Row 2: 7 pads)
              <View style={styles.gridLane}>
                {/* Sub-row 1: steps 1 to 8 */}
                <View style={styles.gridSubRow}>
                  {Array.from({ length: 8 }).map((_, stepIdx) => {
                    const globalIndex = bar.start + stepIdx;
                    const relativeNum = stepIdx + 1;
                    const isActive = !!steps[globalIndex];
                    const isPlaying = currentPlayingStep === globalIndex;
                    const isBeatStart = stepIdx % 4 === 0;

                    return (
                      <StepPad
                        key={globalIndex}
                        relativeNum={relativeNum}
                        globalIndex={globalIndex}
                        isActive={isActive}
                        isPlaying={isPlaying}
                        isBeatStart={isBeatStart}
                        viewMode="grid"
                        onPress={() => onToggleStep(globalIndex)}
                      />
                    );
                  })}
                </View>

                {/* Sub-row 2: steps 9 to 15 */}
                <View style={styles.gridSubRow}>
                  {Array.from({ length: 7 }).map((_, stepIdx) => {
                    const idx = stepIdx + 8;
                    const globalIndex = bar.start + idx;
                    const relativeNum = idx + 1;
                    const isActive = !!steps[globalIndex];
                    const isPlaying = currentPlayingStep === globalIndex;
                    const isBeatStart = idx % 4 === 0;

                    return (
                      <StepPad
                        key={globalIndex}
                        relativeNum={relativeNum}
                        globalIndex={globalIndex}
                        isActive={isActive}
                        isPlaying={isPlaying}
                        isBeatStart={isBeatStart}
                        viewMode="grid"
                        onPress={() => onToggleStep(globalIndex)}
                      />
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  topControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  headerTitleGroup: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#E2E8F0',
  },
  headerSub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#00D2FF',
    letterSpacing: 0.5,
  },
  viewToggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#070E1C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#152540',
    padding: 2,
    gap: 2,
  },
  toggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#00D2FF',
  },
  toggleBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#030712',
  },

  // BAR SECTION CARD
  barCard: {
    backgroundColor: '#070E1C',
    borderWidth: 1,
    borderColor: '#122036',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingTop: 5,
    paddingBottom: 6,
    marginBottom: 6,
  },
  barCardPlaying: {
    borderColor: '#00D2FF',
    backgroundColor: '#09152B',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  barHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLed: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  barLedActive: {
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },
  barLedInactive: {
    backgroundColor: '#1E293B',
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  barLabelActive: {
    color: '#00F0FF',
  },
  barLabelInactive: {
    color: '#94A3B8',
  },
  playingBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#00F0FF',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  playingBadgeText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#00F0FF',
    letterSpacing: 0.5,
  },
  barMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rangeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  countBadge: {
    backgroundColor: 'rgba(0, 210, 255, 0.18)',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  countBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#38BDF8',
  },

  // LANES (15 Pads per row)
  stripLane: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  padBase: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  stripPad: {
    width: STRIP_PAD_WIDTH,
    height: 36,
  },
  gridPad: {
    width: GRID_PAD_WIDTH,
    height: 28,
  },
  padBeatStart: {
    borderTopWidth: 2,
    borderTopColor: '#38BDF8',
  },
  padInactive: {
    backgroundColor: '#091322',
    borderWidth: 1,
    borderColor: '#15243D',
  },
  padActive: {
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 6,
    elevation: 5,
  },
  padPlaying: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  padText: {
    fontWeight: '700',
  },
  stripText: {
    fontSize: 9,
  },
  gridText: {
    fontSize: 10,
  },
  textInactive: {
    color: '#64748B',
  },
  textActive: {
    color: '#030712',
    fontWeight: '800',
  },
  textPlaying: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  microDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#1C2F4D',
    marginTop: 2,
  },
  microDotBeat: {
    backgroundColor: '#38BDF8',
    opacity: 0.5,
  },

  // GRID VIEW (8+7)
  gridLane: {
    flexDirection: 'column',
    gap: 3,
  },
  gridSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
});

export default StepGrid;

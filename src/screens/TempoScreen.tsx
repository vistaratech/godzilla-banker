import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  PanResponder,
  Switch,
} from 'react-native';
import Svg, { Circle, Line, Path, G } from 'react-native-svg';
import { AppHeader } from '../components/AppHeader';
import {
  PlusIcon,
  MinusIcon,
  MetronomeIcon,
  ClockIcon,
  LoopIcon,
} from '../components/Icons';
import { SHADOWS } from '../theme/shadows';

interface TempoScreenProps {
  bpm: number;
  onChangeBpm: (bpm: number) => void;
  onBack: () => void;
  onOpenMenu: () => void;
}

export const TempoScreen: React.FC<TempoScreenProps> = ({
  bpm,
  onChangeBpm,
  onBack,
  onOpenMenu,
}) => {
  const [currentBpm, setCurrentBpm] = useState(bpm);
  const [timeSignature, setTimeSignature] = useState<'4/4' | '3/4' | '6/8'>('4/4');
  const [metronome, setMetronome] = useState(true);
  const [countIn, setCountIn] = useState(false);
  const [loop, setLoop] = useState(true);

  // Pan Responder for vertical or circular drag on the speedometer gauge
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      // Drag up increases, drag down decreases
      const delta = -Math.round(gestureState.dy / 3);
      const newBpm = Math.min(240, Math.max(40, bpm + delta));
      setCurrentBpm(newBpm);
      onChangeBpm(newBpm);
    },
  });

  const handleAdjust = (delta: number) => {
    const next = Math.min(240, Math.max(40, currentBpm + delta));
    setCurrentBpm(next);
    onChangeBpm(next);
  };

  const handleApply = () => {
    onChangeBpm(currentBpm);
    onBack();
  };

  // Speedometer circular gauge calculation
  const gaugePercent = (currentBpm - 40) / (240 - 40);
  const radius = 100;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  // Arc spans 260 degrees (-130 deg to +130 deg)
  const arcLength = circumference * (260 / 360);
  const strokeDashoffset = arcLength * (1 - gaugePercent);

  return (
    <View style={styles.container}>
      <AppHeader
        title="Tempo"
        showBack={true}
        onBack={onBack}
        onOpenMenu={onOpenMenu}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Speedometer Tachometer Dial */}
        <View style={styles.gaugeContainer} {...panResponder.panHandlers}>
          <Svg width={250} height={250} viewBox="0 0 250 250">
            {/* Outer automotive tick marks */}
            <G transform="translate(125, 125)">
              {Array.from({ length: 28 }).map((_, i) => {
                const angle = -130 + i * (260 / 27);
                const rad = (angle * Math.PI) / 180;
                const innerR = 108;
                const outerR = i % 3 === 0 ? 118 : 113;
                const x1 = innerR * Math.cos(rad);
                const y1 = innerR * Math.sin(rad);
                const x2 = outerR * Math.cos(rad);
                const y2 = outerR * Math.sin(rad);
                const isMajor = i % 3 === 0;

                return (
                  <Line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isMajor ? '#00D2FF' : '#1E3A60'}
                    strokeWidth={isMajor ? 1.8 : 1}
                    strokeLinecap="round"
                  />
                );
              })}
            </G>

            {/* Background track circle */}
            <Circle
              cx={125}
              cy={125}
              r={radius}
              stroke="#101B30"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(140 125 125)"
            />

            {/* Active sweep electric blue stroke */}
            <Circle
              cx={125}
              cy={125}
              r={radius}
              stroke="#00D2FF"
              strokeWidth={strokeWidth + 1}
              fill="none"
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(140 125 125)"
            />
          </Svg>

          {/* Central Speedometer Readout */}
          <View style={styles.centerReadout}>
            <Text style={styles.bpmValue}>{currentBpm}</Text>
            <Text style={styles.bpmUnit}>BPM</Text>
          </View>

          {/* Minus Button */}
          <TouchableOpacity
            style={styles.flankMinusBtn}
            onPress={() => handleAdjust(-1)}
            activeOpacity={0.7}
            accessibilityLabel="Decrease BPM by 1"
            accessibilityRole="button"
          >
            <MinusIcon size={18} color="#00D2FF" />
          </TouchableOpacity>

          {/* Plus Button */}
          <TouchableOpacity
            style={styles.flankPlusBtn}
            onPress={() => handleAdjust(1)}
            activeOpacity={0.7}
            accessibilityLabel="Increase BPM by 1"
            accessibilityRole="button"
          >
            <PlusIcon size={18} color="#00D2FF" />
          </TouchableOpacity>
        </View>

        {/* Time Signature Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Time Signature</Text>
          <View style={styles.timeSigPills}>
            {(['4/4', '3/4', '6/8'] as const).map((sig) => {
              const isSelected = timeSignature === sig;
              return (
                <TouchableOpacity
                  key={sig}
                  style={[
                    styles.timeSigPill,
                    isSelected ? styles.pillSelected : styles.pillUnselected,
                  ]}
                  onPress={() => setTimeSignature(sig)}
                  activeOpacity={0.8}
                  accessibilityLabel={`Time signature ${sig}`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.pillText,
                      isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                    ]}
                  >
                    {sig}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Toggles: Metronome, Count In, Loop */}
        <View style={styles.togglesCard}>
          {/* Metronome */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelRow}>
              <MetronomeIcon size={18} color="#00D2FF" />
              <Text style={styles.toggleTitle}>Metronome</Text>
            </View>
            <Switch
              value={metronome}
              onValueChange={setMetronome}
              trackColor={{ false: '#101B30', true: '#00D2FF' }}
              thumbColor={metronome ? '#FFFFFF' : '#475569'}
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Count In */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelRow}>
              <ClockIcon size={18} color="#00D2FF" />
              <Text style={styles.toggleTitle}>Count In</Text>
            </View>
            <Switch
              value={countIn}
              onValueChange={setCountIn}
              trackColor={{ false: '#101B30', true: '#00D2FF' }}
              thumbColor={countIn ? '#FFFFFF' : '#475569'}
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Loop */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelRow}>
              <LoopIcon size={18} color="#00D2FF" />
              <Text style={styles.toggleTitle}>Loop</Text>
            </View>
            <Switch
              value={loop}
              onValueChange={setLoop}
              trackColor={{ false: '#101B30', true: '#00D2FF' }}
              thumbColor={loop ? '#FFFFFF' : '#475569'}
            />
          </View>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          style={[styles.applyButton, SHADOWS.cardElevation]}
          onPress={handleApply}
          activeOpacity={0.8}
          accessibilityLabel="Apply tempo settings"
          accessibilityRole="button"
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  gaugeContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  centerReadout: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmValue: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 210, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  bpmUnit: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#00D2FF',
    marginTop: 2,
  },
  flankMinusBtn: {
    position: 'absolute',
    left: 4,
    bottom: 30,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flankPlusBtn: {
    position: 'absolute',
    right: 4,
    bottom: 30,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    width: '92%',
    backgroundColor: '#0A1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#152238',
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#38BDF8',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  timeSigPills: {
    flexDirection: 'row',
    gap: 10,
  },
  timeSigPill: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillUnselected: {
    backgroundColor: '#0E1729',
    borderWidth: 1,
    borderColor: '#152238',
  },
  pillSelected: {
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pillTextUnselected: {
    color: '#788FA6',
  },
  pillTextSelected: {
    color: '#030712',
  },
  togglesCard: {
    width: '92%',
    backgroundColor: '#0A1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#152238',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#152238',
  },
  applyButton: {
    width: '92%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  applyText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#030712',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { InstrumentType } from './InstrumentTabs';
import { SHADOWS } from '../theme/shadows';

interface MultiLaneGridProps {
  patterns: Record<InstrumentType, boolean[]>; // 60 steps per voice
  currentStep: number; // 0 to 59
  currentBar: number; // 0, 1, 2, 3
  onToggleCell: (instrument: InstrumentType, stepIndex: number) => void;
}

const VOICES: InstrumentType[] = ['KICK'];

export const MultiLaneGrid: React.FC<MultiLaneGridProps> = ({
  patterns,
  currentStep,
  currentBar,
  onToggleCell,
}) => {
  // Show 16 steps for the active bar (or 1 to 16)
  const barOffset = currentBar * 15;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: 16 }).map((_, stepIdx) => {
          const globalStep = barOffset + stepIdx;
          const isRowPlaying = currentStep === globalStep;

          return (
            <View
              key={stepIdx}
              style={[
                styles.row,
                isRowPlaying && styles.rowPlaying,
              ]}
            >
              {/* Row Step Number */}
              <View style={styles.stepNumCol}>
                <Text style={[styles.stepNumText, isRowPlaying && styles.stepNumPlaying]}>
                  {stepIdx + 1}
                </Text>
              </View>

              {/* 4 Voice Capsules */}
              <View style={styles.capsulesContainer}>
                {VOICES.map((voice) => {
                  const isActive = !!patterns[voice]?.[globalStep];
                  return (
                    <TouchableOpacity
                      key={voice}
                      style={[
                        styles.capsule,
                        isActive ? styles.capsuleActive : styles.capsuleInactive,
                        isActive && SHADOWS.activeGlow,
                      ]}
                      onPress={() => onToggleCell(voice, globalStep)}
                      activeOpacity={0.7}
                      accessibilityLabel={`${voice} step ${stepIdx + 1}`}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isActive }}
                    >
                      {isActive && <View style={styles.capsulePillDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Right Indicator dots */}
              <View style={styles.rightCol}>
                <View style={[styles.microDot, isRowPlaying && styles.microDotPlaying]} />
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 360,
    backgroundColor: '#060B18',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#152238',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3.5,
    borderRadius: 6,
    marginVertical: 1,
  },
  rowPlaying: {
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
  },
  stepNumCol: {
    width: 26,
    alignItems: 'center',
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  stepNumPlaying: {
    color: '#00F0FF',
    fontWeight: '800',
  },
  capsulesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 4,
  },
  capsule: {
    flex: 1,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleInactive: {
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
  },
  capsuleActive: {
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  capsulePillDot: {
    width: 14,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#030712',
  },
  rightCol: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#1E3A5F',
  },
  microDotPlaying: {
    backgroundColor: '#00F0FF',
  },
});

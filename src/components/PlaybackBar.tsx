import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PlayIcon, PauseIcon, StopIcon, MoreVerticalIcon } from './Icons';
import { SHADOWS } from '../theme/shadows';

interface PlaybackBarProps {
  isPlaying: boolean;
  currentStep: number; // 0 to 59
  totalSteps?: number; // 60
  bpm: number;
  onPlayPause: () => void;
  onStop: () => void;
  onOptionsPress?: () => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  isPlaying,
  currentStep,
  totalSteps = 60,
  bpm,
  onPlayPause,
  onStop,
  onOptionsPress,
}) => {
  const displayStep = currentStep + 1;
  const progressPercent = Math.min(100, Math.max(0, (displayStep / totalSteps) * 100));

  return (
    <View style={styles.container}>
      {/* Left: Large Circular Play Button */}
      <TouchableOpacity
        style={[
          styles.playButton,
          isPlaying && SHADOWS.playGlow,
        ]}
        onPress={onPlayPause}
        activeOpacity={0.8}
        accessibilityLabel={isPlaying ? 'Pause playback' : 'Start playback'}
        accessibilityRole="button"
      >
        {isPlaying ? (
          <PauseIcon size={18} color="#050505" />
        ) : (
          <PlayIcon size={18} color="#050505" />
        )}
      </TouchableOpacity>

      {/* Center: Step Readout & Progress Line */}
      <View style={styles.centerSection}>
        <View style={styles.stepInfoRow}>
          <Text style={styles.stepLabel}>
            Step <Text style={styles.stepNumber}>{displayStep}</Text> / {totalSteps}
          </Text>
          <Text style={styles.bpmText}>{bpm} BPM</Text>
        </View>

        {/* Thin Progress Track */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Right: Stop & More Options */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.controlSquareBtn}
          onPress={onStop}
          activeOpacity={0.7}
          accessibilityLabel="Stop playback"
          accessibilityRole="button"
        >
          <StopIcon size={13} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlRoundBtn}
          onPress={onOptionsPress}
          activeOpacity={0.7}
          accessibilityLabel="More options"
          accessibilityRole="button"
        >
          <MoreVerticalIcon size={16} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#060B18',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#152238',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 12,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00D2FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 14,
    elevation: 8,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
  },
  stepInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8295B5',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bpmText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00D2FF',
    letterSpacing: 0.5,
  },
  progressBarTrack: {
    width: '100%',
    height: 3,
    backgroundColor: '#101B30',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00D2FF',
    borderRadius: 1.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlSquareBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0C1425',
    borderWidth: 1,
    borderColor: '#192845',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlRoundBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0C1425',
    borderWidth: 1,
    borderColor: '#192845',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

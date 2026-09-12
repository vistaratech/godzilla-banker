import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { InstrumentType } from '../components/InstrumentTabs';
import { BarSelector } from '../components/BarSelector';
import { StepGrid } from '../components/StepGrid';
import { MultiLaneGrid } from '../components/MultiLaneGrid';
import { ActionButtons } from '../components/ActionButtons';
import { StatusCard } from '../components/StatusCard';
import { PlaybackBar } from '../components/PlaybackBar';

import { BluetoothPowerState } from '../types';

interface SequencerScreenProps {
  // Voice patterns (60 steps per voice)
  patterns: Record<InstrumentType, boolean[]>;
  currentVoice: InstrumentType;
  onSelectVoice: (voice: InstrumentType) => void;
  currentBar: number;
  onSelectBar: (bar: number) => void;
  onToggleStep: (voice: InstrumentType, stepIndex: number) => void;
  onFill44: (voice: InstrumentType) => void;
  onRandom: (voice: InstrumentType) => void;
  onClear: (voice: InstrumentType) => void;
  // Playback & Timing
  isPlaying: boolean;
  currentStep: number; // 0 to 59
  bpm: number;
  onPlayPause: () => void;
  onStop: () => void;
  // Hardware status
  relayStatus: 'Standby' | 'Active' | 'Disconnected';
  pulseWidthMs: number;
  triggerCount: number;
  isConnected: boolean;
  bluetoothState?: BluetoothPowerState;
  onOpenMenu: () => void;
  onConnectPress: () => void;
}

export const SequencerScreen: React.FC<SequencerScreenProps> = ({
  patterns,
  currentVoice,
  onSelectVoice,
  currentBar,
  onSelectBar,
  onToggleStep,
  onFill44,
  onRandom,
  onClear,
  isPlaying,
  currentStep,
  bpm,
  onPlayPause,
  onStop,
  relayStatus,
  pulseWidthMs,
  triggerCount,
  isConnected,
  bluetoothState,
  onOpenMenu,
  onConnectPress,
}) => {
  const currentVoicePattern = patterns[currentVoice] || Array(60).fill(false);
  const playingStep = isPlaying ? currentStep : -1;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <AppHeader
        showBack={false}
        onOpenMenu={onOpenMenu}
        onRightPress={onConnectPress}
        isConnected={isConnected}
        bluetoothState={bluetoothState}
      />

      {/* Single-Page Content Area (All 60 steps, zero scroll required) */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Hardware Status Strip */}
        <StatusCard
          relayStatus={relayStatus}
          pulseWidthMs={pulseWidthMs}
          triggerCount={triggerCount}
          totalTriggers={60}
        />

        {/* 60-Step Master Grid: All 4 Bars (1-15, 16-30, 31-45, 46-60) on 1 page */}
        <StepGrid
          steps={currentVoicePattern}
          currentPlayingStep={playingStep}
          onToggleStep={(globalIndex) => onToggleStep(currentVoice, globalIndex)}
          initialViewMode="strip"
        />

        {/* Action Buttons: Fill 4/4, Random Beat, Clear */}
        <ActionButtons
          onFill44={() => onFill44(currentVoice)}
          onRandom={() => onRandom(currentVoice)}
          onClear={() => onClear(currentVoice)}
        />
      </ScrollView>

      {/* Fixed Playback Transport Bar — outside scroll */}
      <PlaybackBar
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={60}
        bpm={bpm}
        onPlayPause={onPlayPause}
        onStop={onStop}
        onOptionsPress={onConnectPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});

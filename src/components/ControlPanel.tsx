import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS } from '../constants/theme';
import { QuantizeOption } from '../types';
import { PlayIcon, PauseIcon, StopIcon, ClearIcon, AntennaIcon } from './Icons';

interface ControlPanelProps {
  isPlaying: boolean;
  isLooping: boolean;
  bpm: number;
  quantize: QuantizeOption;
  manualOverride: boolean;
  relayActive: boolean;
  bleConnected: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onClear: () => void;
  onSync: () => void;
  onBpmChange: (bpm: number) => void;
  onQuantizeChange: (q: QuantizeOption) => void;
  onLoopToggle: () => void;
  onOverrideToggle: (value: boolean) => void;
}

const QUANTIZE_OPTIONS: QuantizeOption[] = ['OFF', '1/4', '1/8', '1/16', '1/32'];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  isLooping,
  bpm,
  quantize,
  manualOverride,
  relayActive,
  bleConnected,
  onPlay,
  onPause,
  onStop,
  onClear,
  onSync,
  onBpmChange,
  onQuantizeChange,
  onLoopToggle,
  onOverrideToggle,
}) => {
  return (
    <View style={styles.container}>
      {/* Transport Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>TRANSPORT</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, isPlaying && styles.btnActive]}
            onPress={isPlaying ? onPause : onPlay}
            activeOpacity={0.75}
          >
            {isPlaying ? <PauseIcon size={14} color={COLORS.atomicGreen} /> : <PlayIcon size={14} color="#ffffff" />}
            <Text style={[styles.btnText, isPlaying && { color: COLORS.atomicGreen }]}>
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={onStop} activeOpacity={0.75}>
            <StopIcon size={12} color={COLORS.textSecondary} />
            <Text style={styles.btnText}>STOP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, isLooping && styles.btnLoop]}
            onPress={onLoopToggle}
            activeOpacity={0.75}
          >
            <Text style={[styles.btnText, isLooping && { color: COLORS.atomicAmber }]}>LOOP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnDanger} onPress={onClear} activeOpacity={0.75}>
            <ClearIcon size={14} color={COLORS.atomicRose} />
            <Text style={[styles.btnText, { color: COLORS.atomicRose }]}>CLEAR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BPM Slider */}
      <View style={styles.section}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sectionLabel}>TEMPO (BPM)</Text>
          <Text style={styles.bpmValue}>{bpm}</Text>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={30}
          maximumValue={300}
          step={1}
          value={bpm}
          onValueChange={onBpmChange}
          minimumTrackTintColor={COLORS.atomicCyan}
          maximumTrackTintColor={'rgba(255, 255, 255, 0.15)'}
          thumbTintColor={COLORS.atomicCyan}
        />
      </View>

      {/* Quantize */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>GRID QUANTIZE</Text>
        <View style={styles.buttonRow}>
          {QUANTIZE_OPTIONS.map((q) => (
            <TouchableOpacity
              key={q}
              style={[styles.qBtn, quantize === q && styles.qBtnActive]}
              onPress={() => onQuantizeChange(q)}
              activeOpacity={0.75}
            >
              <Text style={[styles.qBtnText, quantize === q && styles.qBtnTextActive]}>
                {q}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sync & Override */}
      <View style={styles.section}>
        <View style={styles.overrideRow}>
          <TouchableOpacity
            style={[styles.syncBtn, !bleConnected && styles.syncBtnDisabled]}
            onPress={onSync}
            activeOpacity={0.75}
            disabled={!bleConnected}
          >
            <AntennaIcon size={16} color={COLORS.atomicCyan} />
            <Text style={styles.syncBtnText}>SYNC TO DEVICE</Text>
          </TouchableOpacity>

          <View style={styles.overrideBlock}>
            <Text style={styles.overrideLabel}>MANUAL PULSE</Text>
            <View style={styles.overrideToggle}>
              <Text style={[styles.overrideState, { color: manualOverride ? COLORS.atomicGreen : COLORS.textMuted }]}>
                {manualOverride ? 'ON' : 'OFF'}
              </Text>
              <Switch
                value={manualOverride}
                onValueChange={onOverrideToggle}
                trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: COLORS.atomicGreenGlow }}
                thumbColor={manualOverride ? COLORS.atomicGreen : COLORS.textMuted}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Relay Live Indicator */}
      <View style={[styles.relayBar, relayActive && styles.relayBarActive]}>
        <View style={[styles.relayDot, relayActive && styles.relayDotActive]} />
        <Text style={[styles.relayText, relayActive && styles.relayTextActive]}>
          RELAY {relayActive ? 'ENERGIZED' : 'STANDBY'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  section: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.atomicCyan,
    letterSpacing: 2,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderTopColor: 'rgba(255, 255, 255, 0.26)',
    gap: 4,
  },
  btnActive: {
    borderColor: COLORS.atomicGreen,
    backgroundColor: 'rgba(0, 245, 155, 0.14)',
    borderTopColor: 'rgba(0, 245, 155, 0.45)',
  },
  btnLoop: {
    borderColor: COLORS.atomicAmber,
    backgroundColor: 'rgba(255, 170, 0, 0.14)',
  },
  btnDanger: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 51, 102, 0.35)',
    gap: 4,
  },
  btnText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bpmValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.atomicCyan,
    fontFamily: 'monospace',
  },
  slider: {
    width: '100%',
    height: 30,
  },
  qBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
  },
  qBtnActive: {
    borderColor: COLORS.atomicCyan,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
  },
  qBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  qBtnTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  overrideRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  syncBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 240, 255, 0.12)',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.45)',
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    gap: 6,
    shadowColor: COLORS.atomicCyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  syncBtnDisabled: {
    opacity: 0.35,
    borderColor: COLORS.textMuted,
  },
  syncBtnText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.atomicCyan,
    letterSpacing: 1,
  },
  overrideBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderTopColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 8,
  },
  overrideLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  overrideToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  overrideState: {
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  relayBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    gap: 8,
  },
  relayBarActive: {
    borderColor: COLORS.atomicGreen,
    borderTopColor: 'rgba(0, 245, 155, 0.55)',
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    shadowColor: COLORS.atomicGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  relayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  relayDotActive: {
    backgroundColor: COLORS.atomicGreen,
  },
  relayText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  relayTextActive: {
    color: COLORS.atomicGreen,
  },
});

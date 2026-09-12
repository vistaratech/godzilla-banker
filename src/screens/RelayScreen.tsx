import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { AppHeader } from '../components/AppHeader';
import {
  RelayCoilIcon,
  PulseIcon,
  TriggersIcon,
  BluetoothIcon,
  SyncIcon,
  ZapIcon,
} from '../components/Icons';
import { SHADOWS } from '../theme/shadows';

import { BluetoothPowerState } from '../types';

interface RelayScreenProps {
  pulseWidthMs: number;
  onChangePulseWidth: (ms: number) => void;
  triggerCount: number;
  totalTriggers?: number;
  isConnected: boolean;
  bluetoothState?: BluetoothPowerState;
  onTriggerRelay: () => void;
  onConnectHardware: () => void;
  onBack: () => void;
  onOpenMenu: () => void;
}

export const RelayScreen: React.FC<RelayScreenProps> = ({
  pulseWidthMs,
  onChangePulseWidth,
  triggerCount,
  totalTriggers = 60,
  isConnected,
  bluetoothState,
  onTriggerRelay,
  onConnectHardware,
  onBack,
  onOpenMenu,
}) => {
  const [isFiring, setIsFiring] = useState(false);
  const [pulseValue, setPulseValue] = useState(pulseWidthMs);

  const handleManualTrigger = () => {
    setIsFiring(true);
    onTriggerRelay();
    setTimeout(() => {
      setIsFiring(false);
    }, Math.max(120, pulseValue));
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Relay Control"
        showBack={true}
        onBack={onBack}
        onOpenMenu={onOpenMenu}
        isConnected={isConnected}
        bluetoothState={bluetoothState}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hardware Status Header Card */}
        <View style={styles.hardwareCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.deviceInfo}>
              <View style={styles.bleIconCircle}>
                <BluetoothIcon size={18} color={isConnected ? '#00D2FF' : '#64748B'} />
              </View>
              <View>
                <Text style={styles.deviceTitle}>GODZILLA-ESP32 RELAY</Text>
                <Text style={styles.deviceSub}>
                  {isConnected ? 'Active BLE Link • Channel 1' : 'Hardware Disconnected'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.connectBtn}
              onPress={onConnectHardware}
              activeOpacity={0.7}
              accessibilityLabel="Connect hardware"
              accessibilityRole="button"
            >
              <Text style={styles.connectBtnText}>
                {isConnected ? 'DISCONNECT' : 'CONNECT'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3 Telemetry Metrics */}
        <View style={styles.telemetryGrid}>
          {/* Status */}
          <View style={styles.telemetryBox}>
            <View style={styles.metaRow}>
              <RelayCoilIcon size={14} color="#00D2FF" />
              <Text style={styles.metaLabel}>STATUS</Text>
            </View>
            <View style={styles.statusIndicatorRow}>
              <View
                style={[
                  styles.glowDot,
                  isFiring
                    ? styles.glowDotActive
                    : isConnected
                    ? styles.glowDotStandby
                    : styles.glowDotOffline,
                ]}
              />
              <Text style={[styles.statusWord, isFiring && styles.statusWordActive]}>
                {isFiring ? 'FIRING' : isConnected ? 'STANDBY' : 'OFFLINE'}
              </Text>
            </View>
          </View>

          {/* Pulse Width */}
          <View style={styles.telemetryBox}>
            <View style={styles.metaRow}>
              <PulseIcon size={14} color="#00D2FF" />
              <Text style={styles.metaLabel}>PULSE WIDTH</Text>
            </View>
            <Text style={styles.telemetryValue}>{pulseValue} ms</Text>
          </View>

          {/* Triggers */}
          <View style={styles.telemetryBox}>
            <View style={styles.metaRow}>
              <TriggersIcon size={14} color="#00D2FF" />
              <Text style={styles.metaLabel}>TRIGGERS</Text>
            </View>
            <Text style={styles.telemetryValue}>
              {triggerCount} <Text style={styles.slash}>/</Text> {totalTriggers}
            </Text>
          </View>
        </View>

        {/* Pulse Width Slider Control */}
        <View style={styles.sliderCard}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sectionTitle}>PULSE DWELL CONTROL</Text>
            <Text style={styles.sliderValueBadge}>{pulseValue} ms</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={500}
            step={5}
            value={pulseValue}
            onValueChange={(val) => {
              setPulseValue(val);
              onChangePulseWidth(val);
            }}
            minimumTrackTintColor="#00D2FF"
            maximumTrackTintColor="#152238"
            thumbTintColor="#00F0FF"
          />

          <View style={styles.sliderRangeLabels}>
            <Text style={styles.rangeText}>10 ms</Text>
            <Text style={styles.rangeText}>250 ms</Text>
            <Text style={styles.rangeText}>500 ms</Text>
          </View>
        </View>

        {/* Big Manual Actuator Trigger Button */}
        <TouchableOpacity
          style={[
            styles.triggerButton,
            isFiring && styles.triggerButtonFiring,
            SHADOWS.activeGlow,
          ]}
          onPress={handleManualTrigger}
          activeOpacity={0.8}
          accessibilityLabel="Trigger relay pulse"
          accessibilityRole="button"
        >
          <ZapIcon size={20} color="#030712" />
          <Text style={[styles.triggerButtonText, isFiring && styles.triggerTextFiring]}>
            {isFiring ? 'PULSE ACTUATED' : 'TRIGGER RELAY'}
          </Text>
        </TouchableOpacity>

        {/* Hardware Sync Card */}
        <View style={styles.syncCard}>
          <View style={styles.syncInfo}>
            <SyncIcon size={16} color="#8E8E93" />
            <Text style={styles.syncLabel}>Upload 60-Step Pattern to Flash Memory</Text>
          </View>
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={() => alert('Pattern Synced to ESP32 Flash')}
            activeOpacity={0.7}
          >
            <Text style={styles.syncBtnText}>SYNC PATTERN</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  hardwareCard: {
    backgroundColor: '#0A1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#152238',
    padding: 16,
    marginBottom: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: '#1C3154',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  deviceSub: {
    fontSize: 11,
    color: '#788FA6',
    marginTop: 2,
  },
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
    borderWidth: 1,
    borderColor: '#00D2FF',
  },
  connectBtnText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#00D2FF',
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  telemetryBox: {
    flex: 1,
    backgroundColor: '#0A1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#152238',
    padding: 12,
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#788FA6',
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  glowDotStandby: {
    backgroundColor: '#00D2FF',
  },
  glowDotActive: {
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  glowDotOffline: {
    backgroundColor: '#475569',
  },
  statusWord: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusWordActive: {
    color: '#00F0FF',
    textShadowColor: 'rgba(0, 240, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  slash: {
    color: '#475569',
    fontWeight: '400',
  },
  sliderCard: {
    backgroundColor: '#0A1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#152238',
    padding: 16,
    marginBottom: 16,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#38BDF8',
  },
  sliderValueBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00D2FF',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rangeText: {
    fontSize: 10,
    color: '#64748B',
  },
  triggerButton: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#00D2FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  triggerButtonFiring: {
    backgroundColor: '#00F0FF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#00F0FF',
    shadowOpacity: 0.9,
    shadowRadius: 18,
  },
  triggerButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#030712',
  },
  triggerTextFiring: {
    color: '#030712',
  },
  syncCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#152238',
    padding: 14,
  },
  syncInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  syncLabel: {
    fontSize: 11,
    color: '#788FA6',
    flex: 1,
  },
  syncBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: '#1C3154',
  },
  syncBtnText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#00D2FF',
  },
});

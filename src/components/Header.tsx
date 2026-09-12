import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import { BLEConnectionStatus } from '../types';
import { ZapIcon, BluetoothIcon } from './Icons';
import { GodzillaMasterEmblem } from './GodzillaMasterEmblem';

interface HeaderProps {
  bleStatus: BLEConnectionStatus;
  rssi: number;
  isMock: boolean;
  onPressConnect: () => void;
}

const statusColors: Record<BLEConnectionStatus, string> = {
  disconnected: COLORS.textMuted,
  scanning: COLORS.atomicAmber,
  connecting: COLORS.atomicAmber,
  connected: COLORS.atomicGreen,
  syncing: COLORS.atomicCyan,
  error: COLORS.dangerRed,
};

const statusLabels: Record<BLEConnectionStatus, string> = {
  disconnected: 'DISCONNECTED',
  scanning: 'SCANNING…',
  connecting: 'LINKING…',
  connected: 'LINKED',
  syncing: 'SYNCING…',
  error: 'ERROR',
};

function getRssiLabel(rssi: number): string {
  if (rssi >= -40) return '████';
  if (rssi >= -55) return '███░';
  if (rssi >= -70) return '██░░';
  if (rssi >= -85) return '█░░░';
  return '░░░░';
}

export const Header: React.FC<HeaderProps> = ({ bleStatus, rssi, isMock, onPressConnect }) => {
  const statusColor = statusColors[bleStatus];

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <GodzillaMasterEmblem size={38} borderRadius={10} />
        <View>
          <Text style={styles.title}>GODZILLA BANKER</Text>
          <Text style={styles.subtitle}>PRO GLASS RELAY MATRIX</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.statusBadge} onPress={onPressConnect} activeOpacity={0.75}>
        <BluetoothIcon size={14} color={statusColor} />
        <View>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabels[bleStatus]}
          </Text>
          {bleStatus === 'connected' && (
            <Text style={styles.rssiText}>
              RSSI {getRssiLabel(rssi)} {rssi}dBm
            </Text>
          )}
        </View>
        {isMock && <Text style={styles.mockBadge}>MOCK</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 14,
    backgroundColor: '#12151c',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#161a24',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.35)',
    borderTopColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.atomicCyan,
    letterSpacing: 2,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a24',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  rssiText: {
    fontSize: 8,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  mockBadge: {
    fontSize: 7,
    fontWeight: '900',
    color: COLORS.atomicAmber,
    backgroundColor: '#0c0f16',
    borderWidth: 1,
    borderColor: 'rgba(255, 170, 0, 0.3)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    letterSpacing: 1,
    overflow: 'hidden',
  },
});

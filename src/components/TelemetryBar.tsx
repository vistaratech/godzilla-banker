import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { TelemetryData } from '../types';

interface TelemetryBarProps {
  telemetry: TelemetryData;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry }) => {
  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={styles.cellLabel}>RELAY COIL</Text>
        <Text
          style={[
            styles.cellValue,
            { color: telemetry.relayState ? COLORS.atomicGreen : COLORS.textMuted },
          ]}
        >
          {telemetry.relayState ? 'HIGH' : 'LOW'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cell}>
        <Text style={styles.cellLabel}>PACKETS</Text>
        <Text style={styles.cellValue}>{telemetry.packetsSent}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cell}>
        <Text style={styles.cellLabel}>LATENCY</Text>
        <Text style={[styles.cellValue, { color: telemetry.lastLatencyMs > 20 ? COLORS.atomicAmber : COLORS.atomicCyan }]}>
          {telemetry.lastLatencyMs}ms
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.cell}>
        <Text style={styles.cellLabel}>LAST COMMAND</Text>
        <Text style={styles.cellValueSmall} numberOfLines={1}>
          {telemetry.lastCommand || '—'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderTopColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  cellLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cellValue: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.atomicCyan,
    fontFamily: 'monospace',
  },
  cellValueSmall: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    alignSelf: 'center',
  },
});

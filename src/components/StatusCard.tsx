import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RelayCoilIcon, PulseIcon, TriggersIcon } from './Icons';

interface StatusCardProps {
  relayStatus?: 'Standby' | 'Active' | 'Disconnected';
  pulseWidthMs?: number;
  triggerCount?: number;
  totalTriggers?: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  relayStatus = 'Disconnected',
  pulseWidthMs = 50,
  triggerCount = 0,
  totalTriggers = 60,
}) => {
  const isFiring = relayStatus === 'Active';
  const isStandby = relayStatus === 'Standby';

  return (
    <View style={styles.cardContainer}>
      {/* Section 1: Relay Coil */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <RelayCoilIcon size={14} color="#38BDF8" />
          <Text style={styles.label}>Relay Coil</Text>
        </View>
        <View style={styles.valueRow}>
          <View
            style={[
              styles.statusDot,
              isFiring
                ? styles.statusDotFiring
                : isStandby
                ? styles.statusDotStandby
                : styles.statusDotDisconnected,
            ]}
          />
          <Text
            style={[
              styles.valueText,
              isFiring
                ? styles.valueFiring
                : isStandby
                ? styles.valueStandby
                : styles.valueDisconnected,
            ]}
          >
            {relayStatus}
          </Text>
        </View>
      </View>

      {/* Vertical Divider */}
      <View style={styles.divider} />

      {/* Section 2: Pulse Width */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <PulseIcon size={14} color="#38BDF8" />
          <Text style={styles.label}>Pulse Width</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>{pulseWidthMs} ms</Text>
        </View>
      </View>

      {/* Vertical Divider */}
      <View style={styles.divider} />

      {/* Section 3: Triggers */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <TriggersIcon size={14} color="#38BDF8" />
          <Text style={styles.label}>Triggers</Text>
        </View>
        <View style={styles.valueRow}>
          <Text style={styles.valueText}>
            {triggerCount} <Text style={styles.slashText}>/</Text> {totalTriggers}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A1120',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#152238',
    marginHorizontal: 10,
    marginVertical: 3,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  section: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#788FA6',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  valueFiring: {
    color: '#00F0FF',
    textShadowColor: 'rgba(0, 240, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  valueStandby: {
    color: '#38BDF8',
  },
  valueDisconnected: {
    color: '#64748B',
  },
  slashText: {
    color: '#475569',
    fontWeight: '400',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotStandby: {
    backgroundColor: '#00D2FF',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  statusDotFiring: {
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  statusDotDisconnected: {
    backgroundColor: '#475569',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#16233B',
  },
});

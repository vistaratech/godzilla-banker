import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuIcon, ArrowLeftIcon, SettingsGearIcon } from './Icons';
import { GodzillaLogo } from './GodzillaLogo';

import { BluetoothPowerState } from '../types';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenMenu?: () => void;
  onRightPress?: () => void;
  rightIcon?: React.ReactNode;
  isConnected?: boolean;
  bluetoothState?: BluetoothPowerState;
  altViewToggle?: boolean;
  onToggleAltView?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenMenu,
  onRightPress,
  rightIcon,
  isConnected = false,
  bluetoothState,
  altViewToggle,
  onToggleAltView,
}) => {
  return (
    <View style={styles.header}>
      {/* Left: Menu or Back */}
      <View style={styles.leftSlot}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onBack}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeftIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onOpenMenu}
            activeOpacity={0.7}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          >
            <MenuIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Center: Logo + Brand or Screen Title */}
      <View style={styles.centerSlot}>
        {showBack && title ? (
          <Text style={styles.screenTitle}>{title}</Text>
        ) : (
          <View style={styles.brandRow}>
            <GodzillaLogo size={28} color="#FFFFFF" />
            <View style={styles.brandText}>
              <Text style={styles.brandTitle}>GODZILLA</Text>
              <Text style={styles.brandSub}>BANGER</Text>
            </View>
          </View>
        )}
      </View>

      {/* Right: Connected status + settings */}
      <View style={styles.rightSlot}>
        {!showBack && (
          <TouchableOpacity
            style={styles.connectionBadge}
            onPress={onRightPress}
            activeOpacity={0.7}
            accessibilityLabel={
              isConnected
                ? 'Connected'
                : bluetoothState === 'PoweredOff'
                ? 'Bluetooth is OFF'
                : 'Disconnected'
            }
            accessibilityRole="button"
          >
            <View
              style={[
                styles.statusDot,
                isConnected
                  ? styles.dotActive
                  : bluetoothState === 'PoweredOff'
                  ? styles.dotPoweredOff
                  : styles.dotInactive,
              ]}
            />
            <Text
              style={[
                styles.connectionText,
                isConnected
                  ? styles.connectedText
                  : bluetoothState === 'PoweredOff'
                  ? styles.btOffText
                  : styles.disconnectedText,
              ]}
            >
              {isConnected
                ? 'Connected'
                : bluetoothState === 'PoweredOff'
                ? 'Bluetooth OFF'
                : 'Offline'}
            </Text>
          </TouchableOpacity>
        )}

        {showBack && onRightPress && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onRightPress}
            activeOpacity={0.7}
            accessibilityLabel="Settings"
            accessibilityRole="button"
          >
            {rightIcon || <SettingsGearIcon size={20} color="#8E8E93" />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#030712',
    borderBottomWidth: 1,
    borderBottomColor: '#101B30',
  },
  leftSlot: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSlot: {
    minWidth: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#FFFFFF',
  },
  brandSub: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: '#38BDF8',
    marginTop: 1,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.25)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#475569',
  },
  dotPoweredOff: {
    backgroundColor: '#EF4444',
  },
  connectionText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  connectedText: {
    color: '#00D2FF',
  },
  disconnectedText: {
    color: '#64748B',
  },
  btOffText: {
    color: '#EF4444',
  },
});

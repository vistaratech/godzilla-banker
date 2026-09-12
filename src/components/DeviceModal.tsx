import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { BLEConnectionStatus, BLEDeviceItem, BluetoothPowerState } from '../types';
import { ClearIcon, BluetoothIcon, ZapIcon } from './Icons';
import { GodzillaMasterEmblem } from './GodzillaMasterEmblem';

interface DeviceModalProps {
  visible: boolean;
  bleStatus: BLEConnectionStatus;
  devices: BLEDeviceItem[];
  isMock: boolean;
  bluetoothState?: BluetoothPowerState;
  connectedDevice?: { id: string; name: string | null } | null;
  onScan: () => void;
  onConnect: (deviceId: string) => void;
  onDisconnect: () => void;
  onTestRelay?: () => void;
  onEnableBluetooth?: () => void;
  onClose: () => void;
}

function getRssiQuality(rssi: number): { label: string; color: string } {
  if (rssi >= -55) return { label: 'Strong', color: '#10B981' };
  if (rssi >= -72) return { label: 'Good', color: '#00D2FF' };
  if (rssi >= -85) return { label: 'Fair', color: '#F59E0B' };
  return { label: 'Weak', color: '#EF4444' };
}

export const DeviceModal: React.FC<DeviceModalProps> = ({
  visible,
  bleStatus,
  devices,
  isMock,
  bluetoothState,
  connectedDevice,
  onScan,
  onConnect,
  onDisconnect,
  onTestRelay,
  onEnableBluetooth,
  onClose,
}) => {
  const isScanning = bleStatus === 'scanning';
  const isConnecting = bleStatus === 'connecting';
  const isConnected = bleStatus === 'connected';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleWrap}>
              <GodzillaMasterEmblem size={34} borderRadius={8} />
              <View style={styles.titleTextCol}>
                <Text style={styles.title}>CONNECT GODZILLA BANKER</Text>
                <Text style={styles.subtitle}>ESP32 Super Mini • Real BLE Hardware</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeBtnWrap}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
            >
              <ClearIcon size={14} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Connected State */}
          {isConnected ? (
            <View style={styles.connectedBlock}>
              <View style={styles.linkedIconWrap}>
                <BluetoothIcon size={28} color="#00D2FF" />
              </View>

              <Text style={styles.connectedTitle}>ESP32 SUPER MINI LINKED</Text>
              <Text style={styles.connectedDeviceName}>
                {connectedDevice?.name || 'GODZILLA-SUPERMINI'}
              </Text>
              {connectedDevice?.id && (
                <Text style={styles.connectedDeviceId}>ID: {connectedDevice.id}</Text>
              )}

              <View style={styles.connectedInfoBox}>
                <View style={styles.statusDotRow}>
                  <View style={styles.liveGreenDot} />
                  <Text style={styles.connectedSubText}>
                    Relay Pin (GPIO 7) active & synced to 60-Step Kick 808
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.connectedActions}>
                {onTestRelay && (
                  <TouchableOpacity
                    style={styles.testRelayBtn}
                    onPress={onTestRelay}
                    activeOpacity={0.8}
                    accessibilityLabel="Test Relay Click"
                    accessibilityRole="button"
                  >
                    <ZapIcon size={14} color="#030712" />
                    <Text style={styles.testRelayBtnText}>TEST RELAY CLICK</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.disconnectBtn}
                  onPress={onDisconnect}
                  activeOpacity={0.75}
                  accessibilityLabel="Disconnect ESP32"
                  accessibilityRole="button"
                >
                  <Text style={styles.disconnectBtnText}>DISCONNECT HARDWARE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {/* Phone Bluetooth is OFF banner */}
              {bluetoothState === 'PoweredOff' && (
                <View style={styles.btOffBanner}>
                  <View style={styles.btOffHeader}>
                    <View style={styles.btOffDot} />
                    <Text style={styles.btOffTitle}>MOBILE BLUETOOTH IS TURNED OFF</Text>
                  </View>
                  <Text style={styles.btOffText}>
                    Bluetooth is currently switched OFF on this phone. You must turn ON Bluetooth
                    before scanning or connecting to your nearby ESP32 Super Mini.
                  </Text>
                  {onEnableBluetooth && (
                    <TouchableOpacity
                      style={styles.enableBtBtn}
                      onPress={onEnableBluetooth}
                      activeOpacity={0.8}
                      accessibilityLabel="Turn on Bluetooth"
                      accessibilityRole="button"
                    >
                      <ZapIcon size={14} color="#030712" />
                      <Text style={styles.enableBtBtnText}>TURN ON BLUETOOTH</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Environment notification banner */}
              {isMock ? (
                <View style={styles.expoGoBanner}>
                  <Text style={styles.expoGoBannerTitle}>📱 EXPO GO ENVIRONMENT</Text>
                  <Text style={styles.expoGoBannerText}>
                    Mock devices have been disabled. Real Bluetooth LE discovery requires an Expo
                    Development Build (npx expo run:android). Real ESP32 Super Mini boards will be
                    enlisted once running natively.
                  </Text>
                </View>
              ) : bluetoothState === 'PoweredOn' ? (
                <View style={styles.adapterStatusBar}>
                  <View style={styles.readyDot} />
                  <Text style={styles.adapterStatusText}>
                    BLUETOOTH ADAPTER ACTIVE • {devices.length} REAL DEVICE
                    {devices.length === 1 ? '' : 'S'} FOUND
                  </Text>
                </View>
              ) : null}

              {/* Scan / Turn ON Button */}
              {bluetoothState === 'PoweredOff' ? (
                <TouchableOpacity
                  style={[styles.scanBtn, styles.scanBtnBtOff]}
                  onPress={onEnableBluetooth || onScan}
                  activeOpacity={0.75}
                  accessibilityLabel="Turn on Bluetooth"
                  accessibilityRole="button"
                >
                  <View style={styles.scanLoadingRow}>
                    <BluetoothIcon size={16} color="#030712" />
                    <Text style={styles.scanBtnText}>TURN ON BLUETOOTH TO CONNECT</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.scanBtn, isScanning && styles.scanBtnActive]}
                  onPress={onScan}
                  disabled={isScanning || isConnecting}
                  activeOpacity={0.75}
                  accessibilityLabel="Scan for ESP32 Super Mini"
                  accessibilityRole="button"
                >
                  {isScanning ? (
                    <View style={styles.scanLoadingRow}>
                      <ActivityIndicator size="small" color="#030712" />
                      <Text style={styles.scanLoadingText}>SCANNING FOR REAL HARDWARE...</Text>
                    </View>
                  ) : isConnecting ? (
                    <View style={styles.scanLoadingRow}>
                      <ActivityIndicator size="small" color="#030712" />
                      <Text style={styles.scanLoadingText}>CONNECTING TO ESP32...</Text>
                    </View>
                  ) : (
                    <Text style={styles.scanBtnText}>SCAN FOR ESP32 SUPER MINI</Text>
                  )}
                </TouchableOpacity>
              )}

              {/* Discovered Real Devices List */}
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                style={styles.list}
                ListHeaderComponent={
                  devices.length > 0 ? (
                    <Text style={styles.listHeaderTitle}>
                      REAL BLUETOOTH DEVICES FOUND (TAP TO SELECT):
                    </Text>
                  ) : null
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    {isScanning ? (
                      <>
                        <ActivityIndicator size="large" color="#00D2FF" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyTitle}>Scanning Bluetooth Frequencies...</Text>
                        <Text style={styles.emptySubText}>
                          Listening for real ESP32 Super Mini broadcasts nearby.{'\n'}
                          Ensure your ESP32 board is powered ON (LED glowing).
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.emptyTitle}>No Real Devices Discovered</Text>
                        <Text style={styles.emptySubText}>
                          Tap "SCAN FOR ESP32 SUPER MINI" above to detect your hardware.
                        </Text>
                        <View style={styles.troubleCard}>
                          <Text style={styles.troubleTitle}>Hardware Quick-Check:</Text>
                          <Text style={styles.troubleItem}>• ESP32 Super Mini powered via USB-C (5V)</Text>
                          <Text style={styles.troubleItem}>• Firmware flashed (godzilla_banker_esp32.ino)</Text>
                          <Text style={styles.troubleItem}>• Phone Bluetooth & Location turned ON</Text>
                        </View>
                      </>
                    )}
                  </View>
                }
                renderItem={({ item }) => {
                  const quality = getRssiQuality(item.rssi);
                  const isEsp32 = !!item.isEsp32;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.deviceRow,
                        isEsp32 && styles.esp32DeviceRow,
                      ]}
                      onPress={() => onConnect(item.id)}
                      disabled={isConnecting}
                      activeOpacity={0.75}
                      accessibilityLabel={`Connect to ${item.name}`}
                      accessibilityRole="button"
                    >
                      {/* Left: Device identification */}
                      <View style={styles.deviceInfo}>
                        {isEsp32 && (
                          <View style={styles.targetBadgeRow}>
                            <View style={styles.targetBadge}>
                              <ZapIcon size={10} color="#030712" />
                              <Text style={styles.targetBadgeText}>ESP32 SUPER MINI</Text>
                            </View>
                            <Text style={styles.targetLabel}>TARGET CONTROLLER</Text>
                          </View>
                        )}
                        <Text style={[styles.deviceName, isEsp32 && styles.esp32DeviceName]}>
                          {item.name}
                        </Text>
                        <Text style={styles.deviceId}>MAC / ID: {item.id}</Text>
                      </View>

                      {/* Right: Signal & Connect action */}
                      <View style={styles.deviceAction}>
                        <View style={styles.rssiBlock}>
                          <Text style={[styles.rssiValue, { color: quality.color }]}>
                            {item.rssi} dBm
                          </Text>
                          <Text style={styles.rssiQualityText}>{quality.label}</Text>
                        </View>
                        <View style={[styles.connectPill, isEsp32 && styles.esp32ConnectPill]}>
                          <Text style={styles.connectPillText}>
                            {isEsp32 ? 'SELECT & CONNECT' : 'CONNECT'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#070D1A',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#152238',
    padding: 18,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E3150',
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleTextCol: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00D2FF',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  closeBtnWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0E1729',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btOffBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  btOffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  btOffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  btOffTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
  btOffText: {
    fontSize: 10,
    color: '#CBD5E1',
    lineHeight: 15,
    marginBottom: 10,
  },
  enableBtBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 9,
  },
  enableBtBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  expoGoBanner: {
    backgroundColor: '#0E1729',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  expoGoBannerTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  expoGoBannerText: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 15,
  },
  adapterStatusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#091122',
    borderWidth: 1,
    borderColor: '#152540',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  adapterStatusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  scanBtn: {
    backgroundColor: '#00D2FF',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  scanBtnActive: {
    backgroundColor: '#0284C7',
  },
  scanBtnBtOff: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  scanBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#030712',
    letterSpacing: 1.5,
  },
  scanLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanLoadingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#030712',
    letterSpacing: 1,
  },
  list: {
    maxHeight: 280,
  },
  listHeaderTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  emptySubText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 14,
  },
  troubleCard: {
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
    borderRadius: 10,
    padding: 12,
    width: '100%',
  },
  troubleTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#00D2FF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  troubleItem: {
    fontSize: 10,
    color: '#94A3B8',
    lineHeight: 16,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  esp32DeviceRow: {
    backgroundColor: '#081729',
    borderColor: '#00D2FF',
    borderWidth: 1.5,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  deviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  targetBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#00D2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  targetBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#030712',
    letterSpacing: 0.5,
  },
  targetLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  deviceName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  esp32DeviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deviceId: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  deviceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rssiBlock: {
    alignItems: 'flex-end',
  },
  rssiValue: {
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  rssiQualityText: {
    fontSize: 8,
    color: '#64748B',
    marginTop: 1,
  },
  connectPill: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  esp32ConnectPill: {
    backgroundColor: '#00D2FF',
    borderColor: '#00D2FF',
  },
  connectPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#030712',
    letterSpacing: 0.5,
  },
  connectedBlock: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 8,
  },
  linkedIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0A1728',
    borderWidth: 2,
    borderColor: '#00D2FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D2FF',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 4,
  },
  connectedTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00D2FF',
    letterSpacing: 1.5,
  },
  connectedDeviceName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  connectedDeviceId: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  connectedInfoBox: {
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 10,
    width: '100%',
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  connectedSubText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  connectedActions: {
    width: '100%',
    gap: 10,
  },
  testRelayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#00D2FF',
    borderRadius: 10,
    paddingVertical: 12,
    shadowColor: '#00D2FF',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 3,
  },
  testRelayBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#030712',
    letterSpacing: 1,
  },
  disconnectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  disconnectBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1,
  },
});

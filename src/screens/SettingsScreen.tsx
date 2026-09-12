import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { AppHeader } from '../components/AppHeader';
import {
  AudioEngineIcon,
  MidiIcon,
  ThemeIcon,
  VibrationIcon,
  PhoneScreenIcon,
  SyncIcon,
  InfoIcon,
  ChevronRightIcon,
} from '../components/Icons';
import { GodzillaLogo } from '../components/GodzillaLogo';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenMenu: () => void;
  onOpenAbout?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onOpenMenu,
  onOpenAbout,
}) => {
  const [vibration, setVibration] = useState(true);
  const [keepScreenOn, setKeepScreenOn] = useState(true);

  return (
    <View style={styles.container}>
      <AppHeader
        title="Settings"
        showBack={true}
        onBack={onBack}
        onOpenMenu={onOpenMenu}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Group List */}
        <View style={styles.groupCard}>
          {/* Audio Engine */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Audio Engine', 'Low-latency polyphonic WebAudio & Expo-Audio engine running at 48kHz.')}
            activeOpacity={0.7}
            accessibilityLabel="Audio Engine settings"
            accessibilityRole="button"
          >
            <View style={styles.rowLeft}>
              <AudioEngineIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>Audio Engine</Text>
            </View>
            <ChevronRightIcon size={16} color="#788FA6" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* MIDI Settings */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('MIDI Settings', 'Hardware MIDI Clock Master enabled over BLE Channel 1.')}
            activeOpacity={0.7}
            accessibilityLabel="MIDI settings"
            accessibilityRole="button"
          >
            <View style={styles.rowLeft}>
              <MidiIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>MIDI Settings</Text>
            </View>
            <ChevronRightIcon size={16} color="#788FA6" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Theme */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Theme', 'Godzilla Banger runs in custom Cyber Black & Electric Blue automotive mode.')}
            activeOpacity={0.7}
            accessibilityLabel="Theme settings"
            accessibilityRole="button"
          >
            <View style={styles.rowLeft}>
              <ThemeIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>Theme</Text>
            </View>
            <View style={styles.themeValueRow}>
              <Text style={styles.themeValueText}>Black & Blue</Text>
              <ChevronRightIcon size={16} color="#788FA6" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Vibration */}
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <VibrationIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>Vibration</Text>
            </View>
            <Switch
              value={vibration}
              onValueChange={setVibration}
              trackColor={{ false: '#101B30', true: '#00D2FF' }}
              thumbColor={vibration ? '#FFFFFF' : '#475569'}
            />
          </View>

          <View style={styles.divider} />

          {/* Keep Screen On */}
          <View style={styles.settingRow}>
            <View style={styles.rowLeft}>
              <PhoneScreenIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>Keep Screen On</Text>
            </View>
            <Switch
              value={keepScreenOn}
              onValueChange={setKeepScreenOn}
              trackColor={{ false: '#101B30', true: '#00D2FF' }}
              thumbColor={keepScreenOn ? '#FFFFFF' : '#475569'}
            />
          </View>

          <View style={styles.divider} />

          {/* Backup & Sync */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Alert.alert('Backup & Sync', 'All presets and patterns backed up locally.')}
            activeOpacity={0.7}
            accessibilityLabel="Backup and sync settings"
            accessibilityRole="button"
          >
            <View style={styles.rowLeft}>
              <SyncIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>Backup & Sync</Text>
            </View>
            <ChevronRightIcon size={16} color="#788FA6" />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* About */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => {
              if (onOpenAbout) {
                onOpenAbout();
              } else {
                Alert.alert('About Godzilla Banger', 'Godzilla Banger v2.0.0\nHigh-end automotive beat sequencer & relay controller.');
              }
            }}
            activeOpacity={0.7}
            accessibilityLabel="About Godzilla Banger"
            accessibilityRole="button"
          >
            <View style={styles.rowLeft}>
              <InfoIcon size={18} color="#00D2FF" />
              <Text style={styles.settingLabel}>About</Text>
            </View>
            <ChevronRightIcon size={16} color="#788FA6" />
          </TouchableOpacity>
        </View>

        {/* Bottom Automotive Branding */}
        <View style={styles.carFooter}>
          <GodzillaLogo size={36} color="#00D2FF" glowOpacity={0.15} />

          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>GODZILLA</Text>
            <Text style={styles.brandSubtitle}>BANGER</Text>
            <Text style={styles.slogan}>BEATS • BUILD • BANG</Text>
            <Text style={styles.version}>v2.0.0</Text>
          </View>
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
    paddingTop: 8,
    paddingBottom: 40,
  },
  groupCard: {
    backgroundColor: '#0A1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#152238',
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  themeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#00D2FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#152238',
    marginLeft: 48,
  },
  carFooter: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 12,
  },
  brandContainer: {
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 5,
    color: '#FFFFFF',
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 4,
    color: '#38BDF8',
    marginTop: 1,
  },
  slogan: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2.5,
    color: '#788FA6',
    marginTop: 6,
  },
  version: {
    fontSize: 9,
    fontWeight: '500',
    color: '#475569',
    marginTop: 4,
  },
});

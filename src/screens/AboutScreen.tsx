import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { GodzillaLogo } from '../components/GodzillaLogo';
import {
  AudioEngineIcon,
  BluetoothIcon,
  ZapIcon,
  InfoIcon,
} from '../components/Icons';

interface AboutScreenProps {
  onBack: () => void;
  onOpenMenu: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack, onOpenMenu }) => {
  return (
    <View style={styles.container}>
      <AppHeader
        title="About"
        showBack={true}
        onBack={onBack}
        onOpenMenu={onOpenMenu}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Branding Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoRing}>
            <GodzillaLogo size={64} color="#FFFFFF" glowOpacity={0.15} />
          </View>

          <Text style={styles.brandTitle}>GODZILLA</Text>
          <Text style={styles.brandSubtitle}>BANGER</Text>
          <Text style={styles.tagline}>BEATS • BUILD • BANG</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>VERSION 2.0.0 (BUILD 60)</Text>
          </View>
        </View>

        {/* System Specs Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ENGINE SPECIFICATIONS</Text>

          <View style={styles.specRow}>
            <View style={styles.specIconBox}>
              <AudioEngineIcon size={16} color="#00D2FF" />
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Audio Engine</Text>
              <Text style={styles.specValue}>Polyphonic 48kHz / 16-bit DSP</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <View style={styles.specIconBox}>
              <ZapIcon size={16} color="#00D2FF" />
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Sequencer Core</Text>
              <Text style={styles.specValue}>60-Step Multi-Lane Matrix</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.specRow}>
            <View style={styles.specIconBox}>
              <BluetoothIcon size={16} color="#00D2FF" />
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Hardware Link</Text>
              <Text style={styles.specValue}>Ultra-Fast Wireless Link 5.0</Text>
            </View>
          </View>
        </View>

        {/* Philosophy / Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>THE CONCEPT</Text>
          <Text style={styles.paragraph}>
            Godzilla Banger fuses high-precision automotive engineering with a modern, tactile music sequencer. Designed for rapid beat construction, high-speed pulse triggering, and uncompromising dark aesthetics.
          </Text>
        </View>

        {/* System Diagnostics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SYSTEM STATUS</Text>

          <View style={styles.diagRow}>
            <Text style={styles.diagKey}>DSP LATENCY</Text>
            <Text style={styles.diagVal}>&lt; 5 ms</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagKey}>SAMPLE RATE</Text>
            <Text style={styles.diagVal}>48,000 Hz</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagKey}>UI RENDER ENGINE</Text>
            <Text style={styles.diagVal}>Monochrome OLED 120Hz</Text>
          </View>

          <View style={styles.diagRow}>
            <Text style={styles.diagKey}>SYSTEM PROTOCOL</Text>
            <Text style={styles.diagVal}>GZ-PULSE v2.0</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>
            © 2026 GODZILLA BANGER LABS. ALL RIGHTS RESERVED.
          </Text>
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
  heroSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: '#00D2FF',
    backgroundColor: '#091325',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 6,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 210, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 5,
    color: '#38BDF8',
    marginTop: 2,
  },
  tagline: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: '#788FA6',
    marginTop: 8,
  },
  versionBadge: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#0F1A2E',
    borderWidth: 1,
    borderColor: '#1C3255',
  },
  versionText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#00D2FF',
  },
  card: {
    backgroundColor: '#0A1120',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#152238',
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#38BDF8',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  specIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specContent: {
    flex: 1,
  },
  specLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  specValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00D2FF',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#152238',
    marginVertical: 6,
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#B5C4DA',
    fontWeight: '400',
  },
  diagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  diagKey: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#788FA6',
  },
  diagVal: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: '#00F0FF',
    fontFamily: 'monospace',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  copyright: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#475569',
  },
});

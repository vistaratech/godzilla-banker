import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { soundEngine } from './src/services/soundEngine';
import { GodzillaBLEManager } from './src/services/BLEManager';
import { BLEConnectionStatus, BLEDeviceItem, BluetoothPowerState } from './src/types';
import { InstrumentType } from './src/components/InstrumentTabs';
import { BottomNav, NavTab } from './src/components/BottomNav';
import { SideDrawer, DrawerMenuItemId } from './src/components/SideDrawer';
import { DeviceModal } from './src/components/DeviceModal';
import { PresetItem } from './src/screens/PresetsScreen';

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { SequencerScreen } from './src/screens/SequencerScreen';
import { TempoScreen } from './src/screens/TempoScreen';
import { PresetsScreen } from './src/screens/PresetsScreen';
import { RelayScreen } from './src/screens/RelayScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AboutScreen } from './src/screens/AboutScreen';

const TOTAL_STEPS = 60;

function createInitialPattern(activeIndices: number[]): boolean[] {
  const arr = Array(TOTAL_STEPS).fill(false);
  activeIndices.forEach((i) => {
    if (i < TOTAL_STEPS) arr[i] = true;
  });
  return arr;
}

export default function App() {
  const [appPhase, setAppPhase] = useState<'splash' | 'main'>('splash');
  const [activeDrawerItem, setActiveDrawerItem] = useState<DrawerMenuItemId>('Sequencer');
  const [currentTab, setCurrentTab] = useState<NavTab>('Sequencer');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 60-Step Sequencer Navigation State
  const [currentVoice, setCurrentVoice] = useState<InstrumentType>('KICK');
  const [currentBar, setCurrentBar] = useState(1);

  // 60-Step patterns (Kick 808 only)
  const [patterns, setPatterns] = useState<Record<InstrumentType, boolean[]>>({
    KICK: createInitialPattern([0, 4, 8, 12]),
    HIHAT: Array(TOTAL_STEPS).fill(false),
    SNARE: Array(TOTAL_STEPS).fill(false),
    SYNTH: Array(TOTAL_STEPS).fill(false),
  });

  // Playback & Timing
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [pulseWidthMs, setPulseWidthMs] = useState(50);
  const [triggerCount, setTriggerCount] = useState(0);
  const [relayStatus, setRelayStatus] = useState<'Standby' | 'Active' | 'Disconnected'>('Disconnected');

  // BLE state
  const [bleStatus, setBleStatus] = useState<BLEConnectionStatus>('disconnected');
  const [devices, setDevices] = useState<BLEDeviceItem[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<{ id: string; name: string | null } | null>(null);
  const [btPowerState, setBtPowerState] = useState<BluetoothPowerState>('Unknown');
  const [isMock, setIsMock] = useState(true);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // Playback loop timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // BLE initialization
  useEffect(() => {
    GodzillaBLEManager.initialize(
      (status, device) => {
        setBleStatus(status);
        if (device) setConnectedDevice(device);
        else if (status === 'disconnected') setConnectedDevice(null);

        if (status === 'connected') setRelayStatus('Standby');
        else setRelayStatus('Disconnected');
      },
      (scannedDevices) => setDevices(scannedDevices),
      (mock) => setIsMock(mock),
      (powerState) => setBtPowerState(powerState)
    );
  }, []);

  // Step Sequencer Playback Loop
  useEffect(() => {
    if (isPlaying) {
      // 16th note step interval in milliseconds
      const intervalMs = Math.max(25, Math.floor((60 / bpm / 4) * 1000));

      timerRef.current = setInterval(() => {
        setCurrentStep((prevStep) => {
          const nextStep = (prevStep + 1) % TOTAL_STEPS;

          // Sound triggers - KICK 808 ONLY
          let hasTrigger = false;
          if (patterns.KICK[nextStep]) {
            soundEngine.playSound('KICK');
            hasTrigger = true;
          }

          // Hardware relay synchronization (ONLY WHEN REAL HARDWARE IS CONNECTED!)
          if (hasTrigger) {
            setTriggerCount((c) => (c + 1) % (TOTAL_STEPS + 1));
            if (bleStatus === 'connected') {
              setRelayStatus('Active');
              GodzillaBLEManager.triggerManualPulse(pulseWidthMs);
              setTimeout(() => {
                setRelayStatus('Standby');
              }, Math.min(60, pulseWidthMs));
            }
          }

          return nextStep;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, bpm, patterns, pulseWidthMs, bleStatus]);

  // Sequencer pad toggle
  const handleToggleStep = useCallback(
    (voice: InstrumentType, stepIndex: number) => {
      setPatterns((prev) => {
        const nextVoicePattern = [...prev[voice]];
        nextVoicePattern[stepIndex] = !nextVoicePattern[stepIndex];

        // Audition sample when turned on
        if (nextVoicePattern[stepIndex]) {
          soundEngine.playSound(voice);
        }

        return {
          ...prev,
          [voice]: nextVoicePattern,
        };
      });
    },
    []
  );

  // Fill 4/4 standard pattern
  const handleFill44 = useCallback((voice: InstrumentType) => {
    setPatterns((prev) => {
      const nextPattern = [...prev[voice]];
      for (let i = 0; i < TOTAL_STEPS; i++) {
        nextPattern[i] = i % 4 === 0;
      }
      return { ...prev, [voice]: nextPattern };
    });
  }, []);

  // Randomize pattern
  const handleRandom = useCallback((voice: InstrumentType) => {
    setPatterns((prev) => {
      const nextPattern = [...prev[voice]];
      for (let i = 0; i < TOTAL_STEPS; i++) {
        nextPattern[i] = Math.random() < 0.3;
      }
      return { ...prev, [voice]: nextPattern };
    });
  }, []);

  // Clear pattern
  const handleClear = useCallback((voice: InstrumentType) => {
    setPatterns((prev) => ({
      ...prev,
      [voice]: Array(TOTAL_STEPS).fill(false),
    }));
  }, []);

  // Preset loader
  const handleLoadPreset = (preset: PresetItem) => {
    setBpm(preset.bpm);
    setPulseWidthMs(preset.pulseMs);

    // Apply preset step patterns - only Kick 808
    setPatterns({
      KICK: createInitialPattern(preset.patterns.KICK || []),
      HIHAT: Array(TOTAL_STEPS).fill(false),
      SNARE: Array(TOTAL_STEPS).fill(false),
      SYNTH: Array(TOTAL_STEPS).fill(false),
    });

    setCurrentTab('Sequencer');
    setActiveDrawerItem('Sequencer');
    Alert.alert('Preset Loaded', `${preset.name} loaded (${preset.bpm} BPM)`);
  };

  // Manual relay actuation (ONLY WHEN REALLY CONNECTED!)
  const handleManualRelayTrigger = () => {
    soundEngine.playSound('KICK');
    if (bleStatus === 'connected') {
      setRelayStatus('Active');
      setTriggerCount((c) => c + 1);
      GodzillaBLEManager.triggerManualPulse(pulseWidthMs);
      setTimeout(() => {
        setRelayStatus('Standby');
      }, Math.max(120, pulseWidthMs));
    } else {
      if (btPowerState === 'PoweredOff') {
        Alert.alert(
          'Mobile Bluetooth is OFF',
          'Bluetooth is currently turned OFF on your mobile phone. Please turn ON Bluetooth to search for and connect to your ESP32 Super Mini.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Turn ON Bluetooth',
              onPress: () => GodzillaBLEManager.requestEnableBluetooth(),
            },
          ]
        );
      } else {
        Alert.alert(
          'ESP32 Not Connected',
          'Your physical ESP32 Super Mini board is not connected. Please connect your hardware to click the relay.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Connect ESP32', onPress: () => setIsDeviceModalOpen(true) },
          ]
        );
      }
    }
  };

  // Drawer menu selection handler
  const handleSelectDrawerItem = (item: DrawerMenuItemId) => {
    setActiveDrawerItem(item);
    if (item === 'Sequencer' || item === 'Tempo' || item === 'Presets' || item === 'Relay') {
      setCurrentTab(item as NavTab);
    } else if (item === 'Samples') {
      Alert.alert('Samples Library', 'Godzilla 808 Automotive Sample Bank v1.0 loaded.');
    } else if (item === 'Projects') {
      Alert.alert('Projects', 'Current Beat Project auto-saved.');
    } else if (item === 'Help') {
      Alert.alert('Help & Support', 'Godzilla Banker Automotive Beat Station\nContact: support@godzillabanker.com');
    }
  };

  // 1. SPLASH SCREEN
  if (appPhase === 'splash') {
    return <SplashScreen onFinish={() => setAppPhase('main')} />;
  }

  // 2. MAIN APPLICATION
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor="#030712" />

        <View style={styles.container}>
          {/* Active Screen View */}
          {activeDrawerItem === 'Settings' ? (
            <SettingsScreen
              onBack={() => {
                setActiveDrawerItem('Sequencer');
                setCurrentTab('Sequencer');
              }}
              onOpenMenu={() => setIsDrawerOpen(true)}
              onOpenAbout={() => setActiveDrawerItem('About')}
            />
          ) : activeDrawerItem === 'About' ? (
            <AboutScreen
              onBack={() => {
                setActiveDrawerItem('Sequencer');
                setCurrentTab('Sequencer');
              }}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          ) : currentTab === 'Sequencer' ? (
            <SequencerScreen
              patterns={patterns}
              currentVoice={currentVoice}
              onSelectVoice={setCurrentVoice}
              currentBar={currentBar}
              onSelectBar={setCurrentBar}
              onToggleStep={handleToggleStep}
              onFill44={handleFill44}
              onRandom={handleRandom}
              onClear={handleClear}
              isPlaying={isPlaying}
              currentStep={currentStep}
              bpm={bpm}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStop={() => {
                setIsPlaying(false);
                setCurrentStep(0);
              }}
              relayStatus={relayStatus}
              pulseWidthMs={pulseWidthMs}
              triggerCount={triggerCount}
              isConnected={bleStatus === 'connected'}
              bluetoothState={btPowerState}
              onOpenMenu={() => setIsDrawerOpen(true)}
              onConnectPress={() => setIsDeviceModalOpen(true)}
            />
          ) : currentTab === 'Tempo' ? (
            <TempoScreen
              bpm={bpm}
              onChangeBpm={setBpm}
              onBack={() => setCurrentTab('Sequencer')}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          ) : currentTab === 'Presets' ? (
            <PresetsScreen
              onLoadPreset={handleLoadPreset}
              onBack={() => setCurrentTab('Sequencer')}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          ) : (
            <RelayScreen
              pulseWidthMs={pulseWidthMs}
              onChangePulseWidth={setPulseWidthMs}
              triggerCount={triggerCount}
              totalTriggers={TOTAL_STEPS}
              isConnected={bleStatus === 'connected'}
              bluetoothState={btPowerState}
              onTriggerRelay={handleManualRelayTrigger}
              onConnectHardware={() => setIsDeviceModalOpen(true)}
              onBack={() => setCurrentTab('Sequencer')}
              onOpenMenu={() => setIsDrawerOpen(true)}
            />
          )}

          {/* Bottom 4-Tab Navigation Bar */}
          {activeDrawerItem !== 'Settings' && activeDrawerItem !== 'About' && (
            <BottomNav
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setActiveDrawerItem(tab as DrawerMenuItemId);
              }}
            />
          )}
        </View>

        {/* Slide-out Side Drawer */}
        <SideDrawer
          isOpen={isDrawerOpen}
          activeItem={activeDrawerItem}
          onClose={() => setIsDrawerOpen(false)}
          onSelectItem={handleSelectDrawerItem}
        />

        {/* BLE Hardware Modal */}
        <DeviceModal
          visible={isDeviceModalOpen}
          bleStatus={bleStatus}
          devices={devices}
          isMock={isMock}
          bluetoothState={btPowerState}
          connectedDevice={connectedDevice}
          onScan={() => GodzillaBLEManager.startScan()}
          onConnect={(id) => GodzillaBLEManager.connect(id)}
          onDisconnect={() => GodzillaBLEManager.disconnect()}
          onTestRelay={handleManualRelayTrigger}
          onEnableBluetooth={() => GodzillaBLEManager.requestEnableBluetooth()}
          onClose={() => setIsDeviceModalOpen(false)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
});

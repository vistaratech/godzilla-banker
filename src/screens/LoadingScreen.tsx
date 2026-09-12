import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Easing,
} from 'react-native';
import { GodzillaLogo } from '../components/GodzillaLogo';

const { width: W, height: H } = Dimensions.get('window');

interface LoadingScreenProps {
  onFinish: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const contentFade = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const loadingPulse = useRef(new Animated.Value(0.4)).current;
  const glowPulse = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Content fades in
    Animated.timing(contentFade, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // Loading text pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingPulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(loadingPulse, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 0.7,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      delay: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onFinish, 200);
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Ambient subtle glow */}
      <Animated.View style={[styles.ambientGlow, { opacity: glowPulse }]} />

      {/* Center content */}
      <Animated.View style={[styles.center, { opacity: contentFade }]}>
        {/* Godzilla Logo */}
        <GodzillaLogo size={56} color="#FFFFFF" glowOpacity={0.08} />

        {/* Brand */}
        <View style={styles.brandBlock}>
          <Text style={styles.brandTitle}>GODZILLA</Text>
          <Text style={styles.brandSub}>BANKER</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>BEATS  •  BUILD  •  BANK</Text>
      </Animated.View>

      {/* Bottom loading section */}
      <View style={styles.bottomSection}>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <Animated.View style={[styles.progressGlow, { opacity: glowPulse }]} />
          </Animated.View>
        </View>

        {/* Loading text */}
        <Animated.View style={{ opacity: loadingPulse }}>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    width: W * 0.7,
    height: W * 0.7,
    borderRadius: W * 0.35,
    backgroundColor: '#00D2FF',
    top: H * 0.28,
  },
  center: {
    alignItems: 'center',
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 8,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 210, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  brandSub: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 8,
    color: '#38BDF8',
    marginTop: 4,
  },
  tagline: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#8295B5',
    marginTop: 4,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    width: W,
  },
  progressTrack: {
    width: 160,
    height: 3,
    backgroundColor: '#101B30',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D2FF',
    borderRadius: 1.5,
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    right: -4,
    top: -3.5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00F0FF',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#38BDF8',
  },
});

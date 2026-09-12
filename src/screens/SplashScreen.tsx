import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Easing,
} from 'react-native';
import { GodzillaLogo } from '../components/GodzillaLogo';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animation phases
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandSlide = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Phase 1: Logo materializes from darkness (0 → 1000ms)
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 40,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // Phase 2: Horizontal line expands (1000 → 1500ms)
      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),

      // Phase 3: Brand name slides up (1500 → 2100ms)
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(brandSlide, {
          toValue: 0,
          tension: 50,
          friction: 12,
          useNativeDriver: true,
        }),
      ]),

      // Phase 4: Tagline appears (2100 → 2500ms)
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // Hold
      Animated.delay(600),

      // Fade out
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const animatedLineWidth = lineWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, W * 0.5],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Ambient background glow - smooth radial aura */}
      <Animated.View
        style={[
          styles.ambientGlowContainer,
          { opacity: glowPulse },
        ]}
        pointerEvents="none"
      >
        <Svg width={W * 0.95} height={W * 0.95} viewBox={`0 0 ${W * 0.95} ${W * 0.95}`}>
          <Defs>
            <RadialGradient id="splashAmbientGlow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0%" stopColor="#00D2FF" stopOpacity={0.16} />
              <Stop offset="35%" stopColor="#00D2FF" stopOpacity={0.06} />
              <Stop offset="70%" stopColor="#00D2FF" stopOpacity={0.015} />
              <Stop offset="100%" stopColor="#00D2FF" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect width={W * 0.95} height={W * 0.95} fill="url(#splashAmbientGlow)" />
        </Svg>
      </Animated.View>

      {/* Central logo */}
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <GodzillaLogo size={136} color="#FFFFFF" glowOpacity={0.35} />
        </Animated.View>

        {/* Separator line */}
        <View style={styles.lineContainer}>
          <Animated.View style={[styles.line, { width: animatedLineWidth }]} />
        </View>

        {/* Brand text */}
        <Animated.View
          style={[
            styles.brandBlock,
            {
              opacity: brandOpacity,
              transform: [{ translateY: brandSlide }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>GODZILLA</Text>
          <Text style={styles.brandSub}>BANGER</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text style={styles.tagline}>BEATS  •  BUILD  •  BANG</Text>
        </Animated.View>
      </View>

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={onFinish}
        activeOpacity={0.5}
        accessibilityLabel="Skip intro"
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>SKIP</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambientGlowContainer: {
    position: 'absolute',
    width: W * 0.95,
    height: W * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  lineContainer: {
    height: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  line: {
    height: 2,
    backgroundColor: '#00D2FF',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  brandBlock: {
    alignItems: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 210, 255, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  brandSub: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 10,
    color: '#38BDF8',
    marginTop: 4,
  },
  tagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3.5,
    color: '#8295B5',
    marginTop: 8,
  },
  skipBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 210, 255, 0.3)',
  },
  skipText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#00D2FF',
  },
});

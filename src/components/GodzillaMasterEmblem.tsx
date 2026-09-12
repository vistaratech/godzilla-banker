import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface GodzillaMasterEmblemProps {
  size?: number;
  borderRadius?: number;
  showGlow?: boolean;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const GodzillaMasterEmblem: React.FC<GodzillaMasterEmblemProps> = ({
  size = 36,
  borderRadius = 8,
  showGlow = true,
  borderColor = 'rgba(255, 255, 255, 0.25)',
  style,
}) => {
  const fontSize = Math.max(10, size * 0.45);

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          width: size,
          height: size,
          borderRadius,
          borderColor,
          shadowColor: showGlow ? '#FFFFFF' : 'transparent',
        },
        style,
      ]}
    >
      {/* Inner circle */}
      <View
        style={[
          styles.innerCircle,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: (size * 0.72) / 2,
          },
        ]}
      >
        <Text style={[styles.monogram, { fontSize }]}>G</Text>
      </View>

      {/* Chrome glass sheen overlay */}
      <View
        pointerEvents="none"
        style={[
          styles.glassSheen,
          {
            borderRadius: Math.max(2, borderRadius - 1),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  innerCircle: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255,255,255,0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  glassSheen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.35)',
    opacity: 0.7,
  },
});

export default GodzillaMasterEmblem;

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const GODZILLA_REALISTIC_IMAGE = require('../../assets/images/godzilla_realistic_logo.jpg');

interface GodzillaLogoProps {
  size?: number;
  color?: string;
  glowOpacity?: number;
}

/**
 * Hyper-Realistic 3D Cinematic Godzilla Emblem.
 * - Photorealistic Monsterverse / Minus-One style roaring Godzilla
 * - Metallic circular badge enclosure with cyan atomic glow
 * - High-definition obsidian skin textures, glowing eyes & dorsal spines
 */
export const GodzillaLogo: React.FC<GodzillaLogoProps> = ({
  size = 32,
  color = '#FFFFFF',
  glowOpacity = 0,
}) => {
  const borderWidth = Math.max(1, Math.round(size / 36));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer Cyan Ambient Glow Halo */}
      {glowOpacity > 0 && (
        <View
          style={[
            styles.glowHalo,
            {
              width: size * 1.15,
              height: size * 1.15,
              borderRadius: (size * 1.15) / 2,
              opacity: Math.min(1, glowOpacity * 2),
            },
          ]}
        />
      )}

      {/* Realistic 3D Godzilla Badge */}
      <View
        style={[
          styles.imageWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth,
          },
        ]}
      >
        <Image
          source={GODZILLA_REALISTIC_IMAGE}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowHalo: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 240, 255, 0.35)',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 12,
  },
  imageWrapper: {
    overflow: 'hidden',
    borderColor: 'rgba(0, 240, 255, 0.5)',
    backgroundColor: '#030712',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default GodzillaLogo;

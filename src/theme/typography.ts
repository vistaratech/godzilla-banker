// Typography definitions for Godzilla Banger
// Font: Inter / Space Grotesk / System default
import { TextStyle, Platform } from 'react-native';

const FONT_FAMILY = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const FONT_FAMILY_MONO = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const TYPOGRAPHY = {
  // H1 — Large display (BPM, hero numbers)
  h1: {
    fontSize: 48,
    fontWeight: '800' as const,
    letterSpacing: -1,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // H2 — Screen titles
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Brand Title
  brandTitle: {
    fontSize: 15,
    fontWeight: '800' as const,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Brand Subtitle
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '600' as const,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    color: '#8E8E93',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Screen Headers
  screenHeader: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 1,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Section Titles
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: '#8E8E93',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Large BPM Display
  giantBpm: {
    fontSize: 56,
    fontWeight: '800' as const,
    letterSpacing: -2,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Step Numbers on Pads
  stepNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Button Labels
  buttonLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    color: '#8E8E93',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Micro text
  micro: {
    fontSize: 9,
    fontWeight: '600' as const,
    letterSpacing: 1,
    color: '#666666',
    fontFamily: FONT_FAMILY,
  } as TextStyle,

  // Mono / data readout
  mono: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY_MONO,
  } as TextStyle,
};

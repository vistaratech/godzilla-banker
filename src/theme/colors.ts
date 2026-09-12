// High-End Black & Blue Automotive Design Tokens for Godzilla Banker
// Deep Obsidian Blacks, Midnight Slate, Electric Cyan, and Neon Blue.

export const COLORS = {
  // Backgrounds (Obsidian to Midnight Navy)
  background: '#030712',
  backgroundSecondary: '#060B18',
  backgroundTertiary: '#0A1124',

  // Surfaces & Cards
  surface: '#0A101D',
  surfaceCard: '#0D1527',
  surfaceElevated: '#111C34',
  surfaceHover: '#162442',
  surfacePressed: '#1B2E54',
  surfaceLight: '#20345E',

  // Borders & Dividers (Subtle Neon & Dark Slate Blue)
  borderSubtle: 'rgba(0, 210, 255, 0.08)',
  border: '#152238',
  borderLight: '#1C2E4C',
  borderHighlight: 'rgba(0, 210, 255, 0.35)',
  borderActive: '#00D2FF',

  // Text & Icons
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#334155',
  textDark: '#030712', // Used inside vibrant electric blue active buttons
  textBlue: '#00D2FF',
  textCyan: '#00F0FF',

  // Electric Blue & Cyan Accents
  electricBlue: '#00D2FF',
  neonCyan: '#00F0FF',
  skyBlue: '#38BDF8',
  deepBlue: '#0284C7',
  royalBlue: '#1D4ED8',
  glowBlue: 'rgba(0, 210, 255, 0.40)',
  glowBlueSoft: 'rgba(0, 210, 255, 0.15)',

  // Active / Selected States
  activeBlue: '#00D2FF',
  activeSoftBlue: '#38BDF8',
  activeWhite: '#FFFFFF',
  activeSoftGrey: '#E2E8F0',
  activeGlow: 'rgba(0, 210, 255, 0.45)',
  activeGlowSoft: 'rgba(0, 210, 255, 0.18)',

  // Transport & Hardware Status
  relayStandby: '#00D2FF',
  relayDot: '#38BDF8',
  relayActive: '#00F0FF',
  playheadHighlight: '#00F0FF',
  needleColor: '#00D2FF',

  // Micro-accents
  metallicSilver: '#CBD5E1',
  smokeGrey: '#8295B5',
  charcoalDark: '#030712',

  // High-contrast tokens
  atomicCyan: '#00F0FF',
  atomicGreen: '#00D2FF',
  atomicGreenGlow: 'rgba(0, 210, 255, 0.4)',
  atomicAmber: '#38BDF8',
  atomicRose: '#0284C7',
  dangerRed: '#EF4444',
  gridLine: 'rgba(0, 210, 255, 0.06)',
  gridLineMajor: 'rgba(0, 210, 255, 0.18)',
  panelBorder: '#152238',
  scrubberNeedle: '#00D2FF',
};

export type ThemeColors = typeof COLORS;

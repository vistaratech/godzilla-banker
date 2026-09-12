// Strict Monochrome Theme Tokens for Godzilla Banger
import { COLORS } from '../theme/colors';

export interface ColorTheme {
  isDark: boolean;
  background: string;
  backgroundSecondary: string;

  // Surface Tokens
  neuBase: string;
  neuRaised: string;
  neuRaisedHover: string;
  neuSunken: string;
  neuHighlight: string;
  neuShadow: string;
  neuBorder: string;
  neuBorderLight: string;
  neuBorderDark: string;
  neuPill: string;
  neuPillActive: string;
  neuTrackBg: string;

  // Card Surfaces
  glassPanel: string;
  glassPanelLight: string;
  glassCard: string;
  glassCardHover: string;
  glassInput: string;
  glassPill: string;
  glassPillActive: string;
  panel: string;

  // Borders
  glassBorder: string;
  glassBorderHighlight: string;
  glassBorderSubtle: string;
  glassBorderCyan: string;
  glassBorderGreen: string;
  panelBorder: string;
  panelBorderHighlight: string;

  // Accents (Strict Monochrome)
  atomicCyan: string;
  atomicCyanGlow: string;
  atomicGreen: string;
  atomicGreenGlow: string;
  atomicAmber: string;
  atomicAmberGlow: string;
  atomicRose: string;
  atomicRoseGlow: string;
  atomicPurple: string;
  atomicPurpleGlow: string;
  nuclearOrange: string;
  dangerRed: string;
  dangerRedGlow: string;

  // Instrument Colors (Strict Monochrome)
  kick: string;
  kickGlow: string;
  snare: string;
  snareGlow: string;
  hihat: string;
  hihatGlow: string;
  synth: string;
  synthGlow: string;

  // Typography
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textGlass: string;

  // Grid Lines & Transport
  gridLine: string;
  gridLineMajor: string;
  gridLineBeat: string;
  scrubberNeedle: string;
  scrubberGlow: string;
  ambientOrb1: string;
  ambientOrb2: string;
  ambientOrb3: string;

  // States
  relayActive: string;
  relayInactive: string;
  headerBackground: string;
  cellBackground: string;
  cellBorder: string;
}

export const MONOCHROME_THEME: ColorTheme = {
  isDark: true,
  background: '#050505',
  backgroundSecondary: '#080808',

  neuBase: '#050505',
  neuRaised: '#121212',
  neuRaisedHover: '#1B1B1B',
  neuSunken: '#171717',
  neuHighlight: 'rgba(255, 255, 255, 0.12)',
  neuShadow: '#000000',
  neuBorder: '#1F1F1F',
  neuBorderLight: '#2C2C2E',
  neuBorderDark: '#121212',
  neuPill: '#151515',
  neuPillActive: '#FFFFFF',
  neuTrackBg: '#181818',

  glassPanel: '#0E0E0E',
  glassPanelLight: 'rgba(255, 255, 255, 0.04)',
  glassCard: '#121212',
  glassCardHover: '#1A1A1A',
  glassInput: '#171717',
  glassPill: '#151515',
  glassPillActive: '#FFFFFF',
  panel: '#101010',

  glassBorder: '#1F1F1F',
  glassBorderHighlight: 'rgba(255, 255, 255, 0.25)',
  glassBorderSubtle: 'rgba(255, 255, 255, 0.06)',
  glassBorderCyan: '#FFFFFF',
  glassBorderGreen: '#FFFFFF',
  panelBorder: '#1F1F1F',
  panelBorderHighlight: 'rgba(255, 255, 255, 0.2)',

  atomicCyan: '#FFFFFF',
  atomicCyanGlow: 'rgba(255, 255, 255, 0.3)',
  atomicGreen: '#FFFFFF',
  atomicGreenGlow: 'rgba(255, 255, 255, 0.3)',
  atomicAmber: '#E0E0E0',
  atomicAmberGlow: 'rgba(255, 255, 255, 0.2)',
  atomicRose: '#CCCCCC',
  atomicRoseGlow: 'rgba(255, 255, 255, 0.2)',
  atomicPurple: '#D0D0D0',
  atomicPurpleGlow: 'rgba(255, 255, 255, 0.2)',
  nuclearOrange: '#E0E0E0',
  dangerRed: '#AAAAAA',
  dangerRedGlow: 'rgba(255, 255, 255, 0.15)',

  kick: '#FFFFFF',
  kickGlow: 'rgba(255, 255, 255, 0.35)',
  snare: '#E5E5EA',
  snareGlow: 'rgba(255, 255, 255, 0.3)',
  hihat: '#D1D1D6',
  hihatGlow: 'rgba(255, 255, 255, 0.3)',
  synth: '#FFFFFF',
  synthGlow: 'rgba(255, 255, 255, 0.35)',

  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  textGlass: '#FFFFFF',

  gridLine: 'rgba(255, 255, 255, 0.04)',
  gridLineMajor: 'rgba(255, 255, 255, 0.18)',
  gridLineBeat: 'rgba(255, 255, 255, 0.14)',
  scrubberNeedle: '#FFFFFF',
  scrubberGlow: 'rgba(255, 255, 255, 0.5)',
  ambientOrb1: 'rgba(255, 255, 255, 0.02)',
  ambientOrb2: 'rgba(255, 255, 255, 0.02)',
  ambientOrb3: 'rgba(255, 255, 255, 0.02)',

  relayActive: '#FFFFFF',
  relayInactive: 'rgba(255, 255, 255, 0.15)',
  headerBackground: '#050505',
  cellBackground: '#121212',
  cellBorder: '#1F1F1F',
};

export const DARK_THEME = MONOCHROME_THEME;
export const LIGHT_THEME = MONOCHROME_THEME; // App remains strictly monochrome dark
export { COLORS };

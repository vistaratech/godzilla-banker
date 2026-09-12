import React from 'react';
import Svg, { Path, Circle, Rect, Polygon, Line, Ellipse } from 'react-native-svg';

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// 1. Menu / Hamburger (automotive dashboard style)
export const MenuIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="3" y1="12" x2="16" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 2. Close 'X'
export const CloseIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="18" y1="6" x2="6" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="6" y1="6" x2="18" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 3. Arrow Left / Back
export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 22, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 4. Chevron Right
export const ChevronRightIcon: React.FC<IconProps> = ({ size = 18, color = '#777777', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18L15 12L9 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 5. Crown / Status Emblem
export const CrownIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 18L5 8L9.5 13L12 5L14.5 13L19 8L21 18H3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="5" r="1" fill={color} />
    <Circle cx="5" cy="8" r="1" fill={color} />
    <Circle cx="19" cy="8" r="1" fill={color} />
  </Svg>
);

// 6. Kick 808
export const KickIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="3.5" fill={color} />
    <Path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 7. Hi-Hat
export const HiHatIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="12" r="2" fill={color} />
  </Svg>
);

// 8. Snare
export const SnareIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="6" width="16" height="12" rx="3" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="4" y1="14" x2="20" y2="14" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M8 6L10 18M14 6L16 18" stroke={color} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
  </Svg>
);

// 9. Synth
export const SynthIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 13L7 5L12 17L17 8L21 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="7" cy="5" r="1.5" fill={color} />
    <Circle cx="12" cy="17" r="1.5" fill={color} />
    <Circle cx="17" cy="8" r="1.5" fill={color} />
  </Svg>
);

// 10. Play Icon
export const PlayIcon: React.FC<IconProps> = ({ size = 18, color = '#050505' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polygon points="7 4 20 12 7 20 7 4" fill={color} />
  </Svg>
);

// 11. Pause Icon
export const PauseIcon: React.FC<IconProps> = ({ size = 18, color = '#050505' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="4" width="4" height="16" rx="1.5" fill={color} />
    <Rect x="14" y="4" width="4" height="16" rx="1.5" fill={color} />
  </Svg>
);

// 12. Stop Icon
export const StopIcon: React.FC<IconProps> = ({ size = 14, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="5" width="14" height="14" rx="2" fill={color} />
  </Svg>
);

// 13. Three Dots Vertical (Options)
export const MoreVerticalIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="5" r="1.8" fill={color} />
    <Circle cx="12" cy="12" r="1.8" fill={color} />
    <Circle cx="12" cy="19" r="1.8" fill={color} />
  </Svg>
);

// 14. Fill 4/4 (Grid 4 squares)
export const FillGridIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="6" height="6" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="14" y="4" width="6" height="6" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="4" y="14" width="6" height="6" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="14" y="14" width="6" height="6" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// 15. Random / Shuffle
export const RandomIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 3H21V8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 20L21 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M21 16V21H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15 15L21 21M4 4L9 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 16. Clear / Trash Can
export const ClearIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6H21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 17. Relay Coil Icon (Refresh/loop with central dot)
export const RelayCoilIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 12A9 9 0 1 1 18.5 5.6L21 8M21 3V8H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="12" cy="12" r="2.5" fill={color} />
  </Svg>
);

// 18. Pulse Width / ECG
export const PulseIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M22 12H18L15 20L9 4L6 12H2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 19. Sliders / Triggers
export const TriggersIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="4" cy="12" r="2" fill={color} />
    <Circle cx="12" cy="10" r="2" fill={color} />
    <Circle cx="20" cy="14" r="2" fill={color} />
  </Svg>
);

// 20. Waveform (Audio waveform)
export const WaveformIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="3" y1="10" x2="3" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="7" y1="6" x2="7" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="11" y1="3" x2="11" y2="21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="15" y1="7" x2="15" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="19" y1="9" x2="19" y2="15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 21. Heart (Favorite)
export const HeartIcon: React.FC<{ size?: number; color?: string; filled?: boolean }> = ({
  size = 18,
  color = '#777777',
  filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke={color}
      strokeWidth={1.8}
      fill={filled ? color : 'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 22. Plus & Minus
export const PlusIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const MinusIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 2.5 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12H19" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 23. Metronome
export const MetronomeIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 21L10 3H14L18 21H6Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
    <Line x1="12" y1="18" x2="16" y2="8" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="16" cy="8" r="2" fill={color} />
  </Svg>
);

// 24. Loop
export const LoopIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 3L15 6L12 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// 25. Clock / Count-In
export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 26. Settings / Gear
export const GearIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 27. MIDI Keyboard
export const MidiIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="8" y1="5" x2="8" y2="12" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="12" y1="5" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="16" y1="5" x2="16" y2="12" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

// 28. Theme / Light bulb
export const ThemeIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18h6M10 22h4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path
      d="M12 2a7 7 0 0 0-4.95 11.95c.78.78 1.45 1.7 1.7 2.65h6.5c.25-.95.92-1.87 1.7-2.65A7 7 0 0 0 12 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 29. Vibration / Haptic
export const VibrationIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="7" y="4" width="10" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M3 8V16M21 8V16M1 10V14M23 10V14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 30. Mobile Screen / Keep Screen On
export const PhoneScreenIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="2" width="12" height="20" rx="3" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="10" y1="18" x2="14" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 31. Cloud / Sync
export const SyncIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73.81" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 32. Info / About
export const InfoIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Line x1="12" y1="16" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="8" r="1" fill={color} />
  </Svg>
);

// 33. Help / Question
export const HelpIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

// 34. Folder / Projects
export const FolderIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 35. Audio Engine / Sound waves
export const AudioEngineIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// 36. Bottom Navigation Wireframe / Line Icons
export const NavSequencerIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

export const NavTempoIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

export const NavPresetsIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="4" y1="21" x2="4" y2="14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="4" y1="10" x2="4" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="12" y1="21" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="12" y1="8" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="20" y1="21" x2="20" y2="16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="20" y1="12" x2="20" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="4" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="10" r="1.5" fill={color} />
    <Circle cx="20" cy="14" r="1.5" fill={color} />
  </Svg>
);

export const NavRelayIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="4" width="16" height="16" rx="3" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="12" cy="12" r="3.5" fill={color} />
    <Path d="M9 1V4M15 1V4M9 20V23M15 20V23M1 9H4M1 15H4M20 9H23M20 15H23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

// Backward compatibility exports
export const SunIcon = ThemeIcon;
export const MoonIcon = ThemeIcon;
export const BluetoothIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.5 6.5L17.5 17.5L12 23V1L17.5 6.5L6.5 17.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const ZapIcon: React.FC<IconProps> = ({ size = 18, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const DiceIcon = RandomIcon;
export const WireframeStudioIcon = NavSequencerIcon;
export const WireframeTempoIcon = NavTempoIcon;
export const WireframePresetsIcon = NavPresetsIcon;
export const WireframeRelayIcon = NavRelayIcon;
export const AntennaIcon = SyncIcon;
export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF', strokeWidth = 2 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17L4 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Settings Gear
export const SettingsGearIcon: React.FC<IconProps> = ({ size = 20, color = '#FFFFFF', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

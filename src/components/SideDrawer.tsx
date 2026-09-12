import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {
  CloseIcon,
  NavSequencerIcon,
  NavTempoIcon,
  NavPresetsIcon,
  NavRelayIcon,
  WaveformIcon,
  FolderIcon,
  GearIcon,
  HelpIcon,
  InfoIcon,
} from './Icons';
import { TYPOGRAPHY } from '../theme/typography';
import { GodzillaLogo } from './GodzillaLogo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 320);

export type DrawerMenuItemId =
  | 'Sequencer'
  | 'Tempo'
  | 'Presets'
  | 'Relay'
  | 'Samples'
  | 'Projects'
  | 'Settings'
  | 'About'
  | 'Help';

interface SideDrawerProps {
  isOpen: boolean;
  activeItem: DrawerMenuItemId;
  onClose: () => void;
  onSelectItem: (item: DrawerMenuItemId) => void;
}

interface MenuItem {
  id: DrawerMenuItemId;
  label: string;
  icon: (color: string) => React.ReactNode;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'Sequencer',
    label: 'Sequencer',
    icon: (c) => <NavSequencerIcon size={18} color={c} />,
  },
  {
    id: 'Tempo',
    label: 'Tempo',
    icon: (c) => <NavTempoIcon size={18} color={c} />,
  },
  {
    id: 'Presets',
    label: 'Presets',
    icon: (c) => <NavPresetsIcon size={18} color={c} />,
  },
  {
    id: 'Relay',
    label: 'Relay',
    icon: (c) => <NavRelayIcon size={18} color={c} />,
  },
  {
    id: 'Samples',
    label: 'Samples',
    icon: (c) => <WaveformIcon size={18} color={c} />,
  },
  {
    id: 'Projects',
    label: 'Projects',
    icon: (c) => <FolderIcon size={18} color={c} />,
  },
  {
    id: 'Settings',
    label: 'Settings',
    icon: (c) => <GearIcon size={18} color={c} />,
  },
  {
    id: 'About',
    label: 'About',
    icon: (c) => <InfoIcon size={18} color={c} />,
  },
  {
    id: 'Help',
    label: 'Help & Support',
    icon: (c) => <HelpIcon size={18} color={c} />,
  },
];

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  activeItem,
  onClose,
  onSelectItem,
}) => {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]} />
      </TouchableWithoutFeedback>

      {/* Slide-out Content */}
      <Animated.View
        style={[
          styles.drawerSheet,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.brandRow}>
            <GodzillaLogo size={30} color="#FFFFFF" />
            <View style={styles.brandTextBlock}>
              <Text style={styles.brandTitle}>GODZILLA</Text>
              <Text style={styles.brandSubtitle}>BANKER</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <CloseIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Menu Items List */}
        <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.itemsList}>
            {MENU_ITEMS.map((item) => {
              const isSelected = activeItem === item.id;
              const iconColor = isSelected ? '#00D2FF' : '#788FA6';
              const textColor = isSelected ? '#00D2FF' : '#94A3B8';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuRow,
                    isSelected && styles.menuRowSelected,
                  ]}
                  onPress={() => {
                    onSelectItem(item.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  accessibilityLabel={item.label}
                  accessibilityRole="button"
                >
                  <View style={styles.iconSlot}>{item.icon(iconColor)}</View>
                  <Text style={[styles.menuLabel, { color: textColor }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footerSection}>
          <View style={styles.footerDivider} />

          <GodzillaLogo size={28} color="#00D2FF" glowOpacity={0.15} />

          <View style={styles.footerTextContainer}>
            <Text style={styles.footerBrand}>GODZILLA BANKER</Text>
            <Text style={styles.footerSlogan}>BEATS • BUILD • BANK</Text>
            <Text style={styles.footerVersion}>v2.0.0</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  drawerSheet: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#040814',
    borderRightWidth: 1,
    borderRightColor: '#101B30',
    paddingTop: 48,
    display: 'flex',
    flexDirection: 'column',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#101B30',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextBlock: {
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#FFFFFF',
  },
  brandSubtitle: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#38BDF8',
    marginTop: 1,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#0C1527',
  },
  menuScroll: {
    flex: 1,
  },
  itemsList: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 14,
  },
  menuRowSelected: {
    backgroundColor: 'rgba(0, 210, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.35)',
  },
  iconSlot: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  footerSection: {
    borderTopWidth: 1,
    borderTopColor: '#101B30',
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#030712',
    alignItems: 'center',
  },
  footerDivider: {
    width: '60%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 210, 255, 0.15)',
    alignSelf: 'center',
    marginBottom: 14,
  },
  footerTextContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerBrand: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#00D2FF',
    marginBottom: 3,
  },
  footerSlogan: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2,
    color: '#788FA6',
  },
  footerVersion: {
    fontSize: 9,
    fontWeight: '500',
    color: '#475569',
    marginTop: 3,
  },
});

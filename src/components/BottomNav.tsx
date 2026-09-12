import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  NavSequencerIcon,
  NavTempoIcon,
  NavPresetsIcon,
  NavRelayIcon,
} from './Icons';

export type NavTab = 'Sequencer' | 'Tempo' | 'Presets' | 'Relay';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

interface TabItem {
  id: NavTab;
  label: string;
  icon: (color: string) => React.ReactNode;
}

const TABS: TabItem[] = [
  {
    id: 'Sequencer',
    label: 'Sequencer',
    icon: (color) => <NavSequencerIcon size={20} color={color} strokeWidth={1.8} />,
  },
  {
    id: 'Tempo',
    label: 'Tempo',
    icon: (color) => <NavTempoIcon size={20} color={color} strokeWidth={1.8} />,
  },
  {
    id: 'Presets',
    label: 'Presets',
    icon: (color) => <NavPresetsIcon size={20} color={color} strokeWidth={1.8} />,
  },
  {
    id: 'Relay',
    label: 'Relay',
    icon: (color) => <NavRelayIcon size={20} color={color} strokeWidth={1.8} />,
  },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <View style={styles.navBar}>
      {TABS.map((tab) => {
        const isSelected = currentTab === tab.id;
        const iconColor = isSelected ? '#00D2FF' : '#475569';
        const textColor = isSelected ? '#00D2FF' : '#64748B';

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabButton}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
            accessibilityLabel={`${tab.label} tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={styles.iconContainer}>{tab.icon(iconColor)}</View>
            <Text style={[styles.tabLabel, { color: textColor }]}>{tab.label}</Text>

            {/* Selected Blue Underline Bar */}
            {isSelected ? (
              <View style={styles.selectedIndicator} />
            ) : (
              <View style={styles.indicatorPlaceholder} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#030712',
    borderTopWidth: 1,
    borderTopColor: '#101B30',
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0.3,
  },
  selectedIndicator: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#00D2FF',
    marginTop: 4,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  indicatorPlaceholder: {
    width: 20,
    height: 2,
    marginTop: 4,
    backgroundColor: 'transparent',
  },
});

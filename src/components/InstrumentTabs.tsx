import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { KickIcon, HiHatIcon, SnareIcon, SynthIcon } from './Icons';

export type InstrumentType = 'KICK' | 'HIHAT' | 'SNARE' | 'SYNTH';

interface InstrumentTabsProps {
  selected: InstrumentType;
  onSelect: (instrument: InstrumentType) => void;
}

interface InstrumentItem {
  id: InstrumentType;
  label: string;
  icon: (color: string) => React.ReactNode;
}

const INSTRUMENTS: InstrumentItem[] = [
  {
    id: 'KICK',
    label: 'Kick 808',
    icon: (color) => <KickIcon size={18} color={color} />,
  },
  {
    id: 'HIHAT',
    label: 'Hi-Hat',
    icon: (color) => <HiHatIcon size={18} color={color} />,
  },
  {
    id: 'SNARE',
    label: 'Snare',
    icon: (color) => <SnareIcon size={18} color={color} />,
  },
  {
    id: 'SYNTH',
    label: 'Synth',
    icon: (color) => <SynthIcon size={18} color={color} />,
  },
];

export const InstrumentTabs: React.FC<InstrumentTabsProps> = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {INSTRUMENTS.map((inst) => {
        const isSelected = selected === inst.id;
        const iconColor = isSelected ? '#030712' : '#788FA6';
        const textColor = isSelected ? '#030712' : '#94A3B8';

        return (
          <TouchableOpacity
            key={inst.id}
            style={[
              styles.tab,
              isSelected ? styles.tabSelected : styles.tabUnselected,
            ]}
            onPress={() => onSelect(inst.id)}
            activeOpacity={0.8}
            accessibilityLabel={`${inst.label} instrument`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <View style={styles.iconBox}>{inst.icon(iconColor)}</View>
            <Text style={[styles.label, { color: textColor }]}>{inst.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabUnselected: {
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
  },
  tabSelected: {
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  iconBox: {
    marginBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

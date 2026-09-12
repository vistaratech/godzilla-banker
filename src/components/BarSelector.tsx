import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BarSelectorProps {
  selectedBar: number; // 0, 1, 2, 3
  onSelectBar: (barIndex: number) => void;
}

const BARS = [
  { index: 0, label: 'Bar 1', range: '1–15' },
  { index: 1, label: 'Bar 2', range: '16–30' },
  { index: 2, label: 'Bar 3', range: '31–45' },
  { index: 3, label: 'Bar 4', range: '46–60' },
];

export const BarSelector: React.FC<BarSelectorProps> = ({ selectedBar, onSelectBar }) => {
  return (
    <View style={styles.container}>
      {BARS.map((bar) => {
        const isSelected = selectedBar === bar.index;
        return (
          <TouchableOpacity
            key={bar.index}
            style={[
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillUnselected,
            ]}
            onPress={() => onSelectBar(bar.index)}
            activeOpacity={0.7}
            accessibilityLabel={`${bar.label}, steps ${bar.range}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={[styles.barLabel, isSelected ? styles.textSel : styles.textUn]}>
              {bar.label}
            </Text>
            <Text style={[styles.rangeLabel, isSelected ? styles.rangeSel : styles.rangeUn]}>
              {bar.range}
            </Text>
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
    paddingTop: 8,
    paddingBottom: 6,
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  pillUnselected: {
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
  },
  pillSelected: {
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 5,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rangeLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
  },
  textSel: {
    color: '#030712',
  },
  textUn: {
    color: '#CBD5E1',
  },
  rangeSel: {
    color: '#07244D',
  },
  rangeUn: {
    color: '#64748B',
  },
});

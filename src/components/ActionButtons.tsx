import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FillGridIcon, RandomIcon, ClearIcon } from './Icons';

interface ActionButtonsProps {
  onFill44: () => void;
  onRandom: () => void;
  onClear: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onFill44,
  onRandom,
  onClear,
}) => {
  return (
    <View style={styles.container}>
      {/* Fill 4/4 */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onFill44}
        activeOpacity={0.7}
        accessibilityLabel="Fill 4/4 pattern"
        accessibilityRole="button"
      >
        <FillGridIcon size={18} color="#00D2FF" />
        <Text style={styles.btnText}>Fill 4/4</Text>
      </TouchableOpacity>

      {/* Random */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onRandom}
        activeOpacity={0.7}
        accessibilityLabel="Generate random pattern"
        accessibilityRole="button"
      >
        <RandomIcon size={18} color="#00D2FF" />
        <Text style={styles.btnText}>Random Beat</Text>
      </TouchableOpacity>

      {/* Clear */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={onClear}
        activeOpacity={0.7}
        accessibilityLabel="Clear pattern"
        accessibilityRole="button"
      >
        <ClearIcon size={18} color="#00D2FF" />
        <Text style={styles.btnText}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 3,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.2,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { WaveformIcon, HeartIcon, MoreVerticalIcon } from '../components/Icons';
import { InstrumentType } from '../components/InstrumentTabs';

export interface PresetItem {
  id: string;
  name: string;
  description: string;
  bpm: number;
  pulseMs: number;
  category: 'Factory' | 'User' | 'Favorites';
  isFavorite?: boolean;
  patterns: Record<InstrumentType, number[]>; // step indices
}

const DEFAULT_PRESETS: PresetItem[] = [
  {
    id: '1',
    name: 'Dark 808',
    description: 'Deep Sub Bass Kick',
    bpm: 130,
    pulseMs: 50,
    category: 'Factory',
    isFavorite: true,
    patterns: {
      KICK: [0, 6, 10, 14, 16, 22, 26, 30],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
  {
    id: '2',
    name: 'Trap 808',
    description: 'Aggressive 808 Pattern',
    bpm: 140,
    pulseMs: 45,
    category: 'Factory',
    isFavorite: false,
    patterns: {
      KICK: [0, 3, 6, 10, 13, 16, 19, 22, 26],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
  {
    id: '3',
    name: 'Metro 808',
    description: 'Clean Sub Hits',
    bpm: 132,
    pulseMs: 48,
    category: 'Factory',
    isFavorite: true,
    patterns: {
      KICK: [0, 4, 8, 12, 16, 20, 24, 28],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
  {
    id: '4',
    name: 'Drill 808',
    description: 'Sliding Low End',
    bpm: 142,
    pulseMs: 42,
    category: 'Factory',
    isFavorite: false,
    patterns: {
      KICK: [0, 5, 8, 11, 16, 21, 24, 27],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
  {
    id: '5',
    name: 'Classic 808',
    description: 'Boom Bap Sub Kick',
    bpm: 96,
    pulseMs: 65,
    category: 'Factory',
    isFavorite: false,
    patterns: {
      KICK: [0, 4, 10, 16, 20, 26],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
  {
    id: '6',
    name: 'Heavy 808',
    description: 'Extended Low Sub',
    bpm: 128,
    pulseMs: 55,
    category: 'Factory',
    isFavorite: true,
    patterns: {
      KICK: [0, 7, 10, 16, 23, 26],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
  {
    id: '7',
    name: 'Custom 808',
    description: '4-on-Floor Sub Kick',
    bpm: 120,
    pulseMs: 50,
    category: 'User',
    isFavorite: false,
    patterns: {
      KICK: [0, 4, 8, 12],
      HIHAT: [],
      SNARE: [],
      SYNTH: [],
    },
  },
];

interface PresetsScreenProps {
  onLoadPreset: (preset: PresetItem) => void;
  onBack: () => void;
  onOpenMenu: () => void;
}

export const PresetsScreen: React.FC<PresetsScreenProps> = ({
  onLoadPreset,
  onBack,
  onOpenMenu,
}) => {
  const [activeTab, setActiveTab] = useState<'Factory' | 'User' | 'Favorites'>('Factory');
  const [presets, setPresets] = useState<PresetItem[]>(DEFAULT_PRESETS);

  const toggleFavorite = (id: string) => {
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const filteredPresets = presets.filter((p) => {
    if (activeTab === 'Favorites') return p.isFavorite;
    return p.category === activeTab;
  });

  return (
    <View style={styles.container}>
      <AppHeader
        title="Presets"
        showBack={true}
        onBack={onBack}
        onOpenMenu={onOpenMenu}
      />

      {/* Tabs Row: Factory / User / Favorites */}
      <View style={styles.tabsWrapper}>
        {(['Factory', 'User', 'Favorites'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabPill,
                isSelected ? styles.tabPillActive : styles.tabPillInactive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
              accessibilityLabel={`${tab} presets`}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.tabPillText,
                  isSelected ? styles.textActive : styles.textInactive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Presets List */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredPresets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>NO PRESETS YET</Text>
            <Text style={styles.emptySub}>Create your first beat preset.</Text>
            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => setActiveTab('Factory')}
              activeOpacity={0.8}
            >
              <Text style={styles.createBtnText}>EXPLORE FACTORY</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPresets.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.presetCard}
              onPress={() => onLoadPreset(item)}
              activeOpacity={0.7}
              accessibilityLabel={`Load ${item.name}`}
              accessibilityRole="button"
            >
              {/* Waveform Icon */}
              <View style={styles.waveformSlot}>
                <WaveformIcon size={20} color="#00D2FF" />
              </View>

              {/* Title & Description */}
              <View style={styles.textSlot}>
                <Text style={styles.presetName}>{item.name}</Text>
                <Text style={styles.presetDesc}>{item.description}</Text>
              </View>

              {/* Actions: More & Favorite Heart */}
              <View style={styles.actionsSlot}>
                <TouchableOpacity
                  style={styles.iconHit}
                  onPress={() =>
                    Alert.alert(item.name, `${item.bpm} BPM • ${item.pulseMs}ms pulse width`)
                  }
                  activeOpacity={0.7}
                  accessibilityLabel="Preset options"
                  accessibilityRole="button"
                >
                  <MoreVerticalIcon size={16} color="#788FA6" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconHit}
                  onPress={() => toggleFavorite(item.id)}
                  activeOpacity={0.7}
                  accessibilityLabel="Toggle favorite"
                  accessibilityRole="button"
                >
                  <HeartIcon
                    size={17}
                    color={item.isFavorite ? '#00D2FF' : '#475569'}
                    filled={item.isFavorite}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabPillInactive: {
    backgroundColor: '#0A1120',
    borderWidth: 1,
    borderColor: '#152238',
  },
  tabPillActive: {
    backgroundColor: '#00D2FF',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textInactive: {
    color: '#788FA6',
  },
  textActive: {
    color: '#030712',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
    paddingBottom: 40,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1120',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#152238',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  waveformSlot: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0F1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textSlot: {
    flex: 1,
  },
  presetName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  presetDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 2,
  },
  actionsSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconHit: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 20,
  },
  createBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#0E192E',
    borderWidth: 1,
    borderColor: '#1C3255',
  },
  createBtnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#00D2FF',
  },
});

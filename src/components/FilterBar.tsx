import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Chip} from 'react-native-paper';
import {COLORS, SPACING} from '../theme';
import {CapsuleCategory} from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomSearchbar from './CustomSearchbar';

interface FilterBarProps {
  selectedCategory: CapsuleCategory | null;
  onSelectCategory: (category: CapsuleCategory | null) => void;
  onSearch: (query: string) => void;
}

const FilterBar = ({selectedCategory, onSelectCategory, onSearch}: FilterBarProps) => {
  const categories: Array<{
    id: CapsuleCategory;
    label: string;
    icon: string;
    color: string;
    description?: string;
  }> = [
    {
      id: 'tümü',
      label: 'Tümü',
      icon: 'view-grid',
      color: '#A0A0A0',
    },
    {
      id: 'anı',
      label: 'Anılar',
      icon: 'camera',
      color: '#FF6B6B',
      description: 'Özel anlarınızı saklayın',
    },
    {
      id: 'hedef',
      label: 'Hedefler',
      icon: 'target',
      color: '#4ECDC4',
      description: 'Gelecek hedeflerinizi belirleyin',
    },
    {
      id: 'mesaj',
      label: 'Mesajlar',
      icon: 'message',
      color: '#FFD93D',
      description: 'Sevdiklerinize gelecek mesajlar bırakın',
    },
    {
      id: 'gelecek',
      label: 'Gelecek',
      icon: 'rocket',
      color: '#9B59B6',
      description: 'Geleceğe notlar bırakın',
    },
    {
      id: 'sürpriz',
      label: 'Sürprizler',
      icon: 'gift',
      color: '#6C63FF',
      description: 'Sürpriz içerikli kapsüller oluşturun',
    },
  ];

  return (
    <View style={styles.container}>
      <CustomSearchbar
        placeholder="Kapsül ara..."
        onChangeText={onSearch}
      />
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}>
        {categories.map(({id, label, icon, color}) => (
          <Chip
            key={id}
            selected={selectedCategory === id}
            onPress={() => onSelectCategory(selectedCategory === id ? null : id)}
            style={[
              styles.chip,
              id === 'tümü' && styles.allChip,
              selectedCategory === id && {backgroundColor: `${color}20`},
            ]}
            textStyle={[
              styles.chipText,
              selectedCategory === id && {color},
            ]}
            icon={() => (
              <Icon
                name={icon}
                size={18}
                color={selectedCategory === id ? color : COLORS.text.secondary}
              />
            )}>
            {label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chips: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  chipText: {
    color: COLORS.text.secondary,
  },
  allChip: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default FilterBar; 
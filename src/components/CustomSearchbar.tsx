import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SPACING} from '../theme';

interface CustomSearchbarProps {
  placeholder?: string;
  onChangeText: (text: string) => void;
}

const CustomSearchbar = ({placeholder, onChangeText}: CustomSearchbarProps) => {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color={COLORS.text.secondary} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.secondary}
        style={styles.input}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.sm,
    color: COLORS.text.primary,
    fontSize: 16,
  },
});

export default CustomSearchbar; 
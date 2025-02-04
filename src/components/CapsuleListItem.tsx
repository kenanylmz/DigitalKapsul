import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SPACING} from '../theme';
import HolographicCard from './HolographicCard';

const CapsuleListItem = ({capsule, onPress}) => {
  return (
    <HolographicCard onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon
            name={capsule.type === 'image' ? 'image' : 'text'}
            size={24}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{capsule.title}</Text>
          <Text style={styles.description}>{capsule.description}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={COLORS.text.secondary} />
      </View>
    </HolographicCard>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
  },
});

export default CapsuleListItem; 
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SPACING} from '../theme';

interface CapsuleStatsProps {
  totalCapsules: number;
  openedCapsules: number;
  nearestCapsule?: Date;
}

const CapsuleStats = ({totalCapsules, openedCapsules, nearestCapsule}: CapsuleStatsProps) => {
  return (
    <Surface style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <View style={[styles.iconBg, {backgroundColor: 'rgba(108, 99, 255, 0.1)'}]}>
            <Icon name="clock-outline" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.statValue}>{totalCapsules - openedCapsules}</Text>
            <Text style={styles.statLabel}>Bekleyen</Text>
          </View>
        </View>
        
        <View style={styles.statItem}>
          <View style={[styles.iconBg, {backgroundColor: 'rgba(78, 205, 196, 0.1)'}]}>
            <Icon name="lock-open-variant" size={24} color="#4ECDC4" />
          </View>
          <View>
            <Text style={styles.statValue}>{openedCapsules}</Text>
            <Text style={styles.statLabel}>Açılan</Text>
          </View>
        </View>

        {nearestCapsule && (
          <View style={styles.statItem}>
            <View style={[styles.iconBg, {backgroundColor: 'rgba(255, 217, 61, 0.1)'}]}>
              <Icon name="calendar-clock" size={24} color="#FFD93D" />
            </View>
            <View>
              <Text style={styles.statValue}>
                {new Date(nearestCapsule).toLocaleDateString('tr-TR')}
              </Text>
              <Text style={styles.statLabel}>Yaklaşan</Text>
            </View>
          </View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
});

export default CapsuleStats; 
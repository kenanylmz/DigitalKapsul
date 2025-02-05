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
          <Icon name="clock-outline" size={18} color={COLORS.primary} />
          <View>
            <Text style={styles.statValue}>{totalCapsules - openedCapsules}</Text>
            <Text style={styles.statLabel}>bekleyen</Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Icon name="lock-open-variant" size={18} color={COLORS.primary} />
          <View>
            <Text style={styles.statValue}>{openedCapsules}</Text>
            <Text style={styles.statLabel}>açılan</Text>
          </View>
        </View>

        {nearestCapsule && (
          <>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Icon name="calendar-clock" size={18} color={COLORS.primary} />
              <View>
                <Text style={styles.statValue}>
                  {new Date(nearestCapsule).toLocaleDateString('tr-TR')}
                </Text>
                <Text style={styles.statLabel}>yaklaşan</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.2)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.primary,
    textAlign: 'center',
  },
});

export default CapsuleStats;

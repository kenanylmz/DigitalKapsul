import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SPACING} from '../theme';
import {Capsule} from '../types';
import ShimmerCard from './ShimmerCard';

interface AnimatedCapsuleCardProps {
  capsule: Capsule;
  index: number;
  onPress: () => void;
}

const AnimatedCapsuleCard = ({capsule, onPress}: AnimatedCapsuleCardProps) => {
  const getIconProps = () => {
    switch (capsule.type) {
      case 'image':
        return {
          name: 'image-multiple',
          color: COLORS.capsule.icon.image,
        };
      default:
        return {
          name: 'text-box-outline',
          color: COLORS.capsule.icon.text,
        };
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRemainingTime = () => {
    const now = new Date();
    const openDate = new Date(capsule.openDate);
    const diffTime = openDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (capsule.isLocked) {
      return diffDays <= 0 ? 'Açılabilir' : `${diffDays} gün`;
    }
    return 'Açıldı';
  };

  const iconProps = getIconProps();

  return (
    <ShimmerCard onPress={onPress}>
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: `${iconProps.color}20`},
          ]}>
          <Icon name={iconProps.name} size={24} color={iconProps.color} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {capsule.title}
            </Text>
            <View style={styles.statusContainer}>
              <Icon
                name={capsule.isLocked ? 'lock-clock' : 'lock-open-variant'}
                size={16}
                color={capsule.isLocked ? COLORS.primary : COLORS.success}
              />
              <Text
                style={[
                  styles.statusText,
                  {color: capsule.isLocked ? COLORS.primary : COLORS.success},
                ]}
                numberOfLines={1}>
                {getRemainingTime()}
              </Text>
            </View>
          </View>
          <Text style={styles.description} numberOfLines={2}>
            {capsule.description}
          </Text>
          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Icon
                name="calendar-clock"
                size={14}
                color={COLORS.text.secondary}
              />
              <Text style={styles.dateText}>
                Oluşturulma: {formatDate(capsule.createdAt)}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Icon
                name="calendar-check"
                size={14}
                color={COLORS.text.secondary}
              />
              <Text style={styles.dateText}>
                Açılış: {formatDate(capsule.openDate)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ShimmerCard>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    flex: 1,
    marginRight: SPACING.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '40%',
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  footer: {
    marginTop: SPACING.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginLeft: SPACING.xs,
  },
});

export default AnimatedCapsuleCard;

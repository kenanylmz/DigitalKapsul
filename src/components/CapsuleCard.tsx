import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Card, Title, Text, Surface} from 'react-native-paper';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {Capsule} from '../types';
import {COLORS, SPACING} from '../theme';

interface CapsuleCardProps {
  capsule: Capsule;
  onPress: () => void;
}

const CapsuleCard = ({capsule, onPress}: CapsuleCardProps) => {
  const getIconByType = () => {
    switch (capsule.type) {
      case 'text':
        return require('../assets/images/text-capsule-icon.png');
      case 'image':
        return require('../assets/images/image-capsule-icon.jpg');
      case 'video':
        return require('../assets/images/video-capsule-icon.png');
      default:
        return require('../assets/images/text-capsule-icon.png');
    }
  };

  const isOpenable = new Date(capsule.openDate) <= new Date();

  return (
    <Surface style={styles.surface}>
      <Card style={styles.card} onPress={onPress}>
        <View style={styles.contentContainer}>
          <View style={styles.typeIconContainer}>
            <Image source={getIconByType()} style={styles.typeIcon} />
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: capsule.isLocked
                    ? COLORS.error
                    : COLORS.success,
                },
              ]}
            />
          </View>

          <View style={styles.textContainer}>
            <Title style={styles.title} numberOfLines={1}>
              {capsule.title}
            </Title>

            <Text style={styles.description} numberOfLines={2}>
              {capsule.description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Açılış:</Text>
                <Text
                  style={[
                    styles.dateValue,
                    !isOpenable && styles.futureDateValue,
                  ]}>
                  {format(new Date(capsule.openDate), 'dd MMM yyyy', {
                    locale: tr,
                  })}
                </Text>
              </View>

              {capsule.recipientEmail && (
                <View style={styles.recipientContainer}>
                  <Text style={styles.recipientLabel}>Alıcı:</Text>
                  <Text style={styles.recipientValue} numberOfLines={1}>
                    {capsule.recipientEmail}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.capsuleIconContainer}>
            <Image
              source={require('../assets/images/time-capsule-bg.png')}
              style={styles.capsuleIcon}
            />
          </View>
        </View>
      </Card>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    borderRadius: 12,
    elevation: 4,
    marginHorizontal: SPACING.sm,
    marginVertical: SPACING.xs,
    backgroundColor: COLORS.card.background,
    borderWidth: 1,
    borderColor: COLORS.card.border,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: COLORS.card.highlight,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  typeIcon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -2,
    right: -2,
    borderWidth: 2,
    borderColor: COLORS.white,
    zIndex: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.text.light,
    marginRight: SPACING.xs,
  },
  dateValue: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  futureDateValue: {
    color: COLORS.primary,
  },
  recipientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientLabel: {
    fontSize: 12,
    color: COLORS.text.light,
    marginRight: SPACING.xs,
  },
  recipientValue: {
    fontSize: 12,
    color: COLORS.primary,
    maxWidth: 120,
  },
  capsuleIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capsuleIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    opacity: 0.7,
  },
});

export default CapsuleCard;

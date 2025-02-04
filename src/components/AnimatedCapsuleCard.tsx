import React, {useEffect} from 'react';
import {StyleSheet, Animated, View, Dimensions} from 'react-native';
import {Surface} from 'react-native-paper';
import {Capsule} from '../types';
import CapsuleCard from './CapsuleCard';
import {COLORS, SPACING} from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface AnimatedCapsuleCardProps {
  capsule: Capsule;
  index: number;
  onPress: () => void;
}

const AnimatedCapsuleCard = ({capsule, index, onPress}: AnimatedCapsuleCardProps) => {
  const fadeAnim = new Animated.Value(0);
  const translateY = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, scaleAnim, index]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {translateY},
            {scale: scaleAnim},
          ],
        },
      ]}>
      <Surface style={styles.cardSurface}>
        <CapsuleCard capsule={capsule} onPress={onPress} />
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  cardSurface: {
    elevation: 4,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
});

export default AnimatedCapsuleCard; 
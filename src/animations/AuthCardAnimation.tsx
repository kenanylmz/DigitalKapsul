import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, Dimensions, View} from 'react-native';
import {Surface} from 'react-native-paper';
import {COLORS, SPACING} from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface AuthCardAnimationProps {
  children: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
}

const AuthCardAnimation = ({children, isFlipped}: AuthCardAnimationProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 1 : 0,
      tension: 12,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const frontRotate = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });

  const backRotate = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '270deg', '360deg'],
  });

  const frontOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.3, 0],
  });

  const backOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.3, 1],
  });

  return (
    <View style={styles.container}>
      {/* Ön yüz */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{perspective: 2000}, {rotateY: frontRotate}],
            opacity: frontOpacity,
            backfaceVisibility: 'hidden',
          },
        ]}>
        <Surface style={[styles.surface, styles.holographicEffect]}>
          {children}
        </Surface>
      </Animated.View>

      {/* Arka yüz */}
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{perspective: 2000}, {rotateY: backRotate}],
            opacity: backOpacity,
            backfaceVisibility: 'hidden',
            position: 'absolute',
          },
        ]}>
        <Surface style={[styles.surface, styles.holographicEffect]}>
          {children}
        </Surface>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: SCREEN_WIDTH - SPACING.lg * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: 16,
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.4)',
  },
  holographicEffect: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 35,
    elevation: 10,
  },
});

export default AuthCardAnimation;

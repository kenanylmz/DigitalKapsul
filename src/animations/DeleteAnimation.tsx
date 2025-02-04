import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View, Dimensions} from 'react-native';
import {COLORS} from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface DeleteAnimationProps {
  onAnimationComplete: () => void;
}

const DeleteAnimation = ({onAnimationComplete}: DeleteAnimationProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(onAnimationComplete, 200);
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-180deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowContainer,
          {
            transform: [{scale: glowAnim}, {rotate: spin}],
          },
        ]}>
        <View style={[styles.glow, {backgroundColor: COLORS.error}]} />
      </Animated.View>
      <Animated.View
        style={[
          styles.capsule,
          {
            backgroundColor: COLORS.error,
            transform: [{scale: scaleAnim}, {rotate: spin}],
          },
        ]}>
        <View style={[styles.capsuleInner, {backgroundColor: COLORS.error}]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  glowContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.5,
    height: SCREEN_WIDTH * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: SCREEN_WIDTH * 0.25,
    opacity: 0.3,
  },
  capsule: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    borderRadius: SCREEN_WIDTH * 0.2,
    elevation: 10,
    shadowColor: COLORS.error,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  capsuleInner: {
    width: '100%',
    height: '100%',
    borderRadius: SCREEN_WIDTH * 0.2,
    opacity: 0.8,
  },
});

export default DeleteAnimation;

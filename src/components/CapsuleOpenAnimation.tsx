import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View, Dimensions, Easing} from 'react-native';
import {COLORS} from '../theme';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface CapsuleOpenAnimationProps {
  onAnimationComplete: () => void;
}

const CapsuleOpenAnimation = ({onAnimationComplete}: CapsuleOpenAnimationProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Başlangıç animasyonu
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      // Dönme ve parıldama efekti
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        // Parçacık efekti
        Animated.timing(particlesAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(onAnimationComplete, 500);
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const glow = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.glowContainer,
          {
            transform: [
              {scale: glow},
              {rotate: spin},
            ],
          },
        ]}>
        <View style={styles.glow} />
      </Animated.View>
      <Animated.View
        style={[
          styles.capsule,
          {
            transform: [
              {scale: scaleAnim},
              {rotate: spin},
            ],
          },
        ]}>
        <View style={styles.capsuleInner} />
      </Animated.View>
      {/* Parçacık efektleri */}
      {Array.from({length: 8}).map((_, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              transform: [
                {
                  translateX: particlesAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.cos(i * Math.PI / 4) * 100],
                  }),
                },
                {
                  translateY: particlesAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Math.sin(i * Math.PI / 4) * 100],
                  }),
                },
                {scale: particlesAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 0],
                })},
              ],
            },
          ]}
        />
      ))}
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
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  capsule: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    borderRadius: SCREEN_WIDTH * 0.2,
    backgroundColor: COLORS.primary,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  capsuleInner: {
    width: '100%',
    height: '100%',
    borderRadius: SCREEN_WIDTH * 0.2,
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
});

export default CapsuleOpenAnimation; 
import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Pressable, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLORS} from '../theme';

interface HolographicCardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const HolographicCard = ({children, onPress}: HolographicCardProps) => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startGlowAnimation = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => startGlowAnimation());
    };

    startGlowAnimation();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.7, 0.3],
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.container, {opacity: glowOpacity}]}>
        <Image
          source={require('../assets/images/time-capsule-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[COLORS.capsule.background.start, COLORS.capsule.background.end]}
          style={styles.gradient}>
          <View style={styles.content}>{children}</View>
        </LinearGradient>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
  gradient: {
    borderWidth: 1,
    borderColor: COLORS.capsule.border.default,
    borderRadius: 16,
  },
  content: {
    padding: 16,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primaryGlow,
    borderRadius: 16,
  },
});

export default HolographicCard; 
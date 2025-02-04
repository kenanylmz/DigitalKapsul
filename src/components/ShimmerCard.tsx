import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Pressable} from 'react-native';
import {COLORS} from '../theme';

interface ShimmerCardProps {
  children: React.ReactNode;
  onPress?: () => void;
}

const ShimmerCard = ({children, onPress}: ShimmerCardProps) => {
  const shimmerAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 400,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        shimmerAnim.setValue(-200);
        setTimeout(startShimmer, 3000);
      });
    };

    startShimmer();
  }, [shimmerAnim]);

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.content}>{children}</View>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{translateX: shimmerAnim}],
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.capsule.card.background,
    borderWidth: 1,
    borderColor: COLORS.capsule.card.border,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: COLORS.capsule.card.shimmer,
    opacity: 0.2,
    transform: [{skewX: '-25deg'}],
  },
});

export default ShimmerCard; 
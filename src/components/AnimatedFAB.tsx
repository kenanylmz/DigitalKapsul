import React, {useEffect} from 'react';
import {StyleSheet, Animated} from 'react-native';
import {FAB} from 'react-native-paper';
import {COLORS, SPACING} from '../theme';

interface AnimatedFABProps {
  onPress: () => void;
}

const AnimatedFAB = ({onPress}: AnimatedFABProps) => {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{scale: scaleAnim}],
        },
      ]}>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={onPress}
        color={COLORS.white}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: SPACING.md,
    bottom: SPACING.md,
  },
  fab: {
    backgroundColor: COLORS.primary,
  },
});

export default AnimatedFAB; 
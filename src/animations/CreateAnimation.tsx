import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View, Dimensions, Easing} from 'react-native';
import {COLORS} from '../theme';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface CreateAnimationProps {
  onAnimationComplete: () => void;
}

const CreateAnimation = ({onAnimationComplete}: CreateAnimationProps) => {
  const rocketPositionY = useRef(
    new Animated.Value(SCREEN_WIDTH * 0.5),
  ).current;
  const rocketScale = useRef(new Animated.Value(1)).current;
  const letterScale = useRef(new Animated.Value(1)).current;
  const letterPositionY = useRef(new Animated.Value(0)).current;
  const smokeOpacity = useRef(new Animated.Value(0)).current;
  const starsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Mektup yukarı süzülür
      Animated.timing(letterPositionY, {
        toValue: -50,
        duration: 1000,
        useNativeDriver: true,
      }),
      // 2. Mektup roketin içine girer
      Animated.parallel([
        Animated.timing(letterScale, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(letterPositionY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // 3. Roket fırlatılır
      Animated.parallel([
        Animated.timing(rocketPositionY, {
          toValue: -SCREEN_WIDTH,
          duration: 2000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(smokeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(starsOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setTimeout(onAnimationComplete, 200);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Yıldızlar */}
      <Stars starsOpacity={starsOpacity} />

      {/* Mektup */}
      <Animated.View
        style={[
          styles.letter,
          {
            transform: [{translateY: letterPositionY}, {scale: letterScale}],
          },
        ]}>
        {/* Mektup başlığı */}
        <View style={styles.letterHeader}>
          <View style={styles.letterDate} />
        </View>

        {/* Mektup çizgileri */}
        <View style={styles.letterContent}>
          {Array.from({length: 6}).map((_, index) => (
            <View key={index} style={styles.line} />
          ))}
        </View>

        {/* Mektup altlığı */}
        <View style={styles.letterFooter}>
          <View style={styles.signature} />
        </View>

        {/* Mühür */}
        <View style={styles.seal}>
          <View style={styles.sealInner} />
        </View>
      </Animated.View>

      {/* Roket */}
      <Rocket
        rocketScale={rocketScale}
        rocketPositionY={rocketPositionY}
        smokeOpacity={smokeOpacity}
      />
    </View>
  );
};

// Alt bileşenler...
const Stars = ({starsOpacity}: {starsOpacity: Animated.Value}) => (
  <>
    {Array.from({length: 50}).map((_, i) => {
      const size = Math.random() * 3 + 1;
      const twinkle = useRef(new Animated.Value(0)).current;

      useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(twinkle, {
              toValue: 1,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
            Animated.timing(twinkle, {
              toValue: 0.3,
              duration: 1000 + Math.random() * 1000,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, []);

      return (
        <Animated.View
          key={`star-${i}`}
          style={[
            styles.star,
            {
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: size,
              height: size,
              borderRadius: size / 2,
              opacity: Animated.multiply(starsOpacity, twinkle),
              transform: [
                {
                  scale: starsOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                },
              ],
            },
          ]}
        />
      );
    })}
  </>
);

// Letter bileşeni
interface LetterProps {
  scale: Animated.Value;
  positionY: Animated.Value;
}

const Letter = ({
  scale,
  positionY,
}: {
  scale: Animated.Value;
  positionY: Animated.Value;
}) => (
  <Animated.View
    style={[
      styles.letter,
      {
        transform: [{translateY: positionY}, {scale}],
      },
    ]}>
    {/* Mektup başlığı */}
    <View style={styles.letterHeader}>
      <View style={styles.letterDate} />
    </View>

    {/* Mektup çizgileri */}
    <View style={styles.letterContent}>
      {Array.from({length: 6}).map((_, index) => (
        <View key={index} style={styles.line} />
      ))}
    </View>

    {/* Mektup altlığı */}
    <View style={styles.letterFooter}>
      <View style={styles.signature} />
    </View>

    {/* Mühür */}
    <View style={styles.seal}>
      <View style={styles.sealInner} />
    </View>
  </Animated.View>
);

// Rocket bileşeni
interface RocketProps {
  rocketScale: Animated.Value;
  rocketPositionY: Animated.Value;
  smokeOpacity: Animated.Value;
}

const Rocket = ({rocketScale, rocketPositionY, smokeOpacity}: RocketProps) => (
  <Animated.View
    style={[
      styles.rocketContainer,
      {
        transform: [{scale: rocketScale}, {translateY: rocketPositionY}],
      },
    ]}>
    <View style={styles.rocketBody} />
    <View style={styles.rocketHead} />
    <View style={styles.finLeft} />
    <View style={styles.finRight} />

    {/* Roket dumanı */}
    <Animated.View style={[styles.smoke, {opacity: smokeOpacity}]}>
      {Array.from({length: 5}).map((_, i) => (
        <View
          key={`smoke-${i}`}
          style={[
            styles.smokeParticle,
            {
              transform: [{scale: 1 - i * 0.15}],
              opacity: 1 - i * 0.2,
            },
          ]}
        />
      ))}
    </Animated.View>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  letter: {
    width: 120,
    height: 160,
    backgroundColor: COLORS.letter.background,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.letter.ribbon.primary,
    padding: 12,
    overflow: 'hidden',
  },
  letterHeader: {
    height: 20,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.letter.lines,
  },
  letterDate: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.letter.lines,
    marginBottom: 4,
  },
  letterContent: {
    flex: 1,
    paddingVertical: 8,
  },
  line: {
    height: 2,
    backgroundColor: COLORS.letter.lines,
    marginVertical: 8,
    opacity: 0.6,
  },
  letterFooter: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  signature: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.letter.ink,
    opacity: 0.8,
  },
  seal: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.letter.seal,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sealInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.letter.ribbon.primary,
    opacity: 0.8,
  },
  rocketContainer: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rocketBody: {
    width: '80%',
    height: '70%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  rocketHead: {
    position: 'absolute',
    top: 0,
    width: '80%',
    height: '30%',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  finLeft: {
    position: 'absolute',
    bottom: '10%',
    left: 0,
    width: '30%',
    height: '20%',
    backgroundColor: COLORS.primary,
    transform: [{rotate: '45deg'}],
  },
  finRight: {
    position: 'absolute',
    bottom: '10%',
    right: 0,
    width: '30%',
    height: '20%',
    backgroundColor: COLORS.primary,
    transform: [{rotate: '-45deg'}],
  },
  smoke: {
    position: 'absolute',
    bottom: -30,
    alignItems: 'center',
  },
  smokeParticle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: -5,
  },
});

export default CreateAnimation;

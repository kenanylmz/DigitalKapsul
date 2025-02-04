import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View, Easing} from 'react-native';
import {Text} from 'react-native-paper';
import {COLORS, LETTER_FONTS} from '../theme';

interface SealAnimationProps {
  onAnimationComplete: () => void;
}

const SealAnimation = ({onAnimationComplete}: SealAnimationProps) => {
  const sealScale = useRef(new Animated.Value(1.5)).current;
  const sealOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const stampPressure = useRef(new Animated.Value(0)).current;
  const inkSpread = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Mühür damgası görünür
      Animated.timing(sealOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      // Mühür basma ve mürekkep yayılma efekti
      Animated.parallel([
        Animated.timing(sealScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.elastic(1.2),
          useNativeDriver: true,
        }),
        Animated.timing(stampPressure, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(inkSpread, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Metin görünür
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(onAnimationComplete, 1000);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.sealContainer,
          {
            opacity: sealOpacity,
            transform: [
              {scale: sealScale},
              {
                rotate: stampPressure.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['15deg', '0deg'],
                }),
              },
            ],
          },
        ]}>
        {/* Mürekkep dağılma efekti */}
        <Animated.View
          style={[
            styles.inkSpread,
            {
              opacity: inkSpread.interpolate({
                inputRange: [0, 0.2, 1],
                outputRange: [0, 0.6, 0.2],
              }),
              transform: [
                {
                  scale: inkSpread.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.1],
                  }),
                },
              ],
            },
          ]}
        />

        <View style={styles.seal}>
          <Animated.View style={[styles.sealInner]}>
            <View style={styles.sealPattern} />
            <Animated.Text style={[styles.sealText, {opacity: textOpacity}]}>
              Geleceğe
            </Animated.Text>
            <Animated.Text style={[styles.sealText, {opacity: textOpacity}]}>
              Mesajlandı
            </Animated.Text>
          </Animated.View>
          <Animated.View style={styles.sealRing} />
          <View style={styles.sealBorder} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  sealContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inkSpread: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 60,
    backgroundColor: COLORS.letter.seal,
    opacity: 0.2,
  },
  seal: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: COLORS.letter.seal,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  sealInner: {
    width: '88%',
    height: '88%',
    borderRadius: 44,
    backgroundColor: COLORS.letter.ribbon.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  sealPattern: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    opacity: 0.1,
    backgroundColor: COLORS.white,
    transform: [{rotate: '45deg'}],
  },
  sealRing: {
    position: 'absolute',
    width: '94%',
    height: '94%',
    borderRadius: 47,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sealBorder: {
    position: 'absolute',
    width: '102%',
    height: '102%',
    borderRadius: 51,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  sealText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: LETTER_FONTS.handwriting,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
});

export default SealAnimation;

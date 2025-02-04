import React, {useEffect, useRef} from 'react';
import {StyleSheet, Animated, View, Easing} from 'react-native';
import {COLORS, LETTER_FONTS} from '../theme';

interface SealAnimationProps {
  onAnimationComplete: () => void;
}

const SealAnimation = ({onAnimationComplete}: SealAnimationProps) => {
  const waxScale = useRef(new Animated.Value(0)).current;
  const waxOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const waxSpread = useRef(new Animated.Value(0)).current;
  const dropAnimations = useRef(
    Array(8)
      .fill(0)
      .map(() => ({
        scale: new Animated.Value(0),
        position: new Animated.Value(0),
        delay: Math.random() * 300,
        angle: Math.random() * 360,
        distance: 35 + Math.random() * 25,
      })),
  ).current;

  useEffect(() => {
    Animated.sequence([
      // Ana mühür belirme animasyonu
      Animated.parallel([
        Animated.timing(waxScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(waxOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(waxSpread, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      // Mum damlaları animasyonu
      Animated.stagger(50, [
        ...dropAnimations.map(drop =>
          Animated.parallel([
            Animated.timing(drop.scale, {
              toValue: 1,
              duration: 500,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(drop.position, {
              toValue: 1,
              duration: 600,
              easing: Easing.bezier(0.2, 0.8, 0.2, 1),
              useNativeDriver: true,
            }),
          ]),
        ),
      ]),
      // Yazı belirme animasyonu
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setTimeout(onAnimationComplete, 500));
  }, []);

  return (
    <View style={styles.container}>
      {/* Mum damlaları */}
      {dropAnimations.map((drop, index) => (
        <Animated.View
          key={index}
          style={[
            styles.waxDrop,
            {
              transform: [
                {
                  translateX: drop.position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0,
                      Math.cos((drop.angle * Math.PI) / 180) * drop.distance,
                    ],
                  }),
                },
                {
                  translateY: drop.position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      0,
                      Math.sin((drop.angle * Math.PI) / 180) * drop.distance,
                    ],
                  }),
                },
                {scale: drop.scale},
              ],
              opacity: drop.position.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [1, 0.8, 0.6],
              }),
            },
          ]}
        />
      ))}

      {/* Ana mühür */}
      <Animated.View
        style={[
          styles.sealContainer,
          {
            opacity: waxOpacity,
            transform: [
              {scale: waxScale},
              {
                scale: waxSpread.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.sealContent}>
          <View style={styles.sealInner}>
            <View style={styles.sealBorder} />
            <View style={styles.sealPattern} />
            <View style={styles.textContainer}>
              <Animated.Text style={[styles.sealText, {opacity: textOpacity}]}>
                Geleceğe
              </Animated.Text>
              <Animated.Text style={[styles.sealText, {opacity: textOpacity}]}>
                Kapsüllendi
              </Animated.Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 15,
    bottom: 0,
    zIndex: 1,
  },
  sealContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealContent: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#D4173F',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sealInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E81C3D',
    borderRadius: 50,
    padding: 8,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{scale: 0.9}],
  },
  sealPattern: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    backgroundColor: '#FF1744',
    opacity: 0.1,
    transform: [{rotate: '45deg'}],
  },
  sealBorder: {
    position: 'absolute',
    width: '94%',
    height: '94%',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  waxDrop: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#D4173F',
    borderRadius: 5,
    zIndex: -1,
  },
  sealText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: LETTER_FONTS.handwriting,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginVertical: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});

export default SealAnimation;

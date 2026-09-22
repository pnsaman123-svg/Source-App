import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StartupSplashScreenProps {
  onFinish: () => void;
}

export const StartupSplashScreen: React.FC<StartupSplashScreenProps> = ({ onFinish }) => {
  // Master opacity & scale
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const cameraScaleAnim = useRef(new Animated.Value(0.92)).current;

  // 3D Parallax & Tilt floats
  const floatYAnim = useRef(new Animated.Value(0)).current;
  const tiltXAnim = useRef(new Animated.Value(0)).current;
  const tiltYAnim = useRef(new Animated.Value(0)).current;

  // Ambient Halo Breathing
  const haloScaleAnim = useRef(new Animated.Value(0.85)).current;
  const haloOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Cinematic Dolly Zoom Entrance
    Animated.parallel([
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cameraScaleAnim, {
        toValue: 1.0,
        duration: 1400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(haloOpacityAnim, {
        toValue: 0.7,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. 3D Floating & Parallax Tilt Loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(floatYAnim, {
            toValue: -10,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tiltXAnim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tiltYAnim, {
            toValue: 1,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(haloScaleAnim, {
            toValue: 1.15,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(floatYAnim, {
            toValue: 4,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tiltXAnim, {
            toValue: -1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(tiltYAnim, {
            toValue: -1,
            duration: 2200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(haloScaleAnim, {
            toValue: 0.95,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    floatLoop.start();

    // 3. Smooth Camera Exit Dissolve after 2.4 seconds
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenFadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cameraScaleAnim, {
          toValue: 1.08,
          duration: 600,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(haloOpacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2400);

    return () => {
      floatLoop.stop();
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  const rotateXStr = tiltXAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  const rotateYStr = tiltYAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-4deg', '0deg', '4deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenFadeAnim,
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" translucent />

      {/* Ambient Breathing Radial Light Halo behind 3D Enclosure */}
      <Animated.View
        style={[
          styles.ambientHalo,
          {
            opacity: haloOpacityAnim,
            transform: [{ scale: haloScaleAnim }],
          },
        ]}
      />

      {/* 3D Perspective Container with Parallax Tilt & Dolly Zoom */}
      <Animated.View
        style={[
          styles.perspectiveWrapper,
          {
            transform: [
              { perspective: 1000 },
              { scale: cameraScaleAnim },
              { translateY: floatYAnim },
              { rotateX: rotateXStr },
              { rotateY: rotateYStr },
            ],
          },
        ]}
      >
        <Animated.Image
          source={require('../../assets/images/startup-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F5F5F7',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  ambientHalo: {
    position: 'absolute',
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 0.85,
    borderRadius: (SCREEN_WIDTH * 0.85) / 2,
    backgroundColor: 'rgba(217, 229, 255, 0.45)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 50,
    elevation: 12,
  },
  perspectiveWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
});

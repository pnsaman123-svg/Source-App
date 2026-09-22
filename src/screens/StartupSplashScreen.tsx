import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
  StatusBar,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StartupSplashScreenProps {
  onFinish: () => void;
}

export const StartupSplashScreen: React.FC<StartupSplashScreenProps> = ({ onFinish }) => {
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const imageScaleAnim = useRef(new Animated.Value(0.95)).current;
  const imageFadeAnim = useRef(new Animated.Value(0)).current;
  const overlayGlowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation: Smooth zoom-in & fade-in of 3D architectural mockup
    Animated.parallel([
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(imageFadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(imageScaleAnim, {
        toValue: 1.0,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(overlayGlowAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 2. Hold, slow ambient drift, then exit transition
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenFadeAnim, {
          toValue: 0,
          duration: 550,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(imageScaleAnim, {
          toValue: 1.06,
          duration: 550,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(exitTimer);
  }, [onFinish]);

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

      {/* 3D Faceted Architectural Enclosure with smooth zoom & fade (Figma Node 2861:3249) */}
      <Animated.Image
        source={require('../../assets/images/startup-bg.png')}
        style={[
          styles.backgroundImage,
          {
            opacity: imageFadeAnim,
            transform: [{ scale: imageScaleAnim }],
          },
        ]}
        resizeMode="cover"
      />

      {/* Subtle Ambient Light Shimmer Overlay */}
      <Animated.View
        style={[
          styles.ambientGlow,
          {
            opacity: overlayGlowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.25],
            }),
          },
        ]}
      />
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
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  ambientGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    pointerEvents: 'none',
  },
});

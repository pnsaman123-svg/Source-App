import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
  StatusBar,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StartupSplashScreenProps {
  onFinish: () => void;
}

export const StartupSplashScreen: React.FC<StartupSplashScreenProps> = ({ onFinish }) => {
  // Animation values
  const whitePulseAnim = useRef(new Animated.Value(0.6)).current;
  const greenOpacityAnim = useRef(new Animated.Value(0)).current;
  const whiteOpacityAnim = useRef(new Animated.Value(1)).current;
  const screenFadeAnim = useRef(new Animated.Value(1)).current;
  const screenScaleAnim = useRef(new Animated.Value(1)).current;
  const glowSpreadAnim = useRef(new Animated.Value(1)).current;
  const statusTextOpacity = useRef(new Animated.Value(0)).current;

  const [loadingState, setLoadingState] = useState<'booting' | 'ready' | 'launching'>('booting');

  useEffect(() => {
    // 1. Initial White Light Breathing Animation (Simulating background hardware startup)
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(whitePulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(whitePulseAnim, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Fade in subtle status indicator text
    Animated.timing(statusTextOpacity, {
      toValue: 0.6,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // 2. Simulated background loading duration (~2.2 seconds)
    const loadTimer = setTimeout(() => {
      pulseLoop.stop();
      setLoadingState('ready');

      // 3. Transition White Light -> Green Light
      Animated.parallel([
        // Fade out white LED
        Animated.timing(whiteOpacityAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        // Fade in vibrant Green LED with glow flare
        Animated.timing(greenOpacityAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Flare pulse expansion
        Animated.sequence([
          Animated.timing(glowSpreadAnim, {
            toValue: 1.5,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(glowSpreadAnim, {
            toValue: 1.1,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // 4. Hold green confirmation light, then smooth transition to app
        setTimeout(() => {
          setLoadingState('launching');
          Animated.parallel([
            Animated.timing(screenFadeAnim, {
              toValue: 0,
              duration: 650,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(screenScaleAnim, {
              toValue: 1.04,
              duration: 650,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start(() => {
            onFinish();
          });
        }, 800);
      });
    }, 2200);

    return () => {
      clearTimeout(loadTimer);
      pulseLoop.stop();
    };
  }, [onFinish]);

  // Scaled positioning based on 375x834 design reference
  // Crease is located at y = 577px (69.2% from top), width = 200px (53.3% of 375)
  const lightBarTop = SCREEN_HEIGHT * 0.692;
  const lightBarWidth = SCREEN_WIDTH * 0.533;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenFadeAnim,
          transform: [{ scale: screenScaleAnim }],
        },
      ]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F7" translucent />

      {/* 3D Faceted Architectural Enclosure Background */}
      <Image
        source={require('../../assets/images/startup-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Crease Overlays & Animated LED Light Bars */}
      <View
        style={[
          styles.ledContainer,
          {
            top: lightBarTop - 8,
            width: lightBarWidth,
            left: (SCREEN_WIDTH - lightBarWidth) / 2,
          },
        ]}
      >
        {/* Neutral Crease Mask for clean initial state */}
        <Animated.View
          style={[
            styles.creaseNeutralBase,
            {
              opacity: whiteOpacityAnim,
            },
          ]}
        />

        {/* Phase 1: White LED Glow & Beam (Breathing while loading) */}
        <Animated.View
          style={[
            styles.whiteLedWrapper,
            {
              opacity: Animated.multiply(whiteOpacityAnim, whitePulseAnim),
            },
          ]}
        >
          {/* Ambient White Bloom / Dispersion */}
          <View style={styles.whiteAmbientBloom} />
          {/* Crisp White LED Core Bar */}
          <View style={styles.whiteCoreBar} />
        </Animated.View>

        {/* Phase 2: Electric Green LED Glow & Flare (Triggered once ready) */}
        <Animated.View
          style={[
            styles.greenLedWrapper,
            {
              opacity: greenOpacityAnim,
              transform: [{ scaleY: glowSpreadAnim }],
            },
          ]}
        >
          {/* Outer Radiant Green Bloom */}
          <View style={styles.greenOuterBloom} />
          {/* Concentrated Green Neon Halo */}
          <View style={styles.greenInnerHalo} />
          {/* High-Intensity Green Core Bar */}
          <View style={styles.greenCoreBar} />
        </Animated.View>
      </View>
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
  ledContainer: {
    position: 'absolute',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  creaseNeutralBase: {
    position: 'absolute',
    width: '108%',
    height: 18,
    borderRadius: 8,
    backgroundColor: '#EEEEF2',
  },
  /* White LED Styles */
  whiteLedWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteAmbientBloom: {
    position: 'absolute',
    width: '112%',
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    opacity: 0.85,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 14,
    elevation: 8,
  },
  whiteCoreBar: {
    width: '100%',
    height: 3.2,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
  /* Green LED Styles */
  greenLedWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenOuterBloom: {
    position: 'absolute',
    width: '120%',
    height: 22,
    borderRadius: 11,
    backgroundColor: '#34C759',
    opacity: 0.75,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 12,
  },
  greenInnerHalo: {
    position: 'absolute',
    width: '106%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00E676',
    opacity: 0.9,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  greenCoreBar: {
    width: '100%',
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#E8FFE8',
    borderColor: '#00FF66',
    borderWidth: 0.5,
    shadowColor: '#00FF66',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
});

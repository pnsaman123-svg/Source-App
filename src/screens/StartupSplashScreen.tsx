import React, { useEffect, useRef } from 'react';
import {
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
  const screenFadeAnim = useRef(new Animated.Value(1)).current;
  const screenScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Show static startup screen for 1.8 seconds, then smoothly transition into app
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenFadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(screenScaleAnim, {
          toValue: 1.03,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

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

      {/* Static 3D Faceted Architectural Enclosure (Figma Node 2861:3249) */}
      <Image
        source={require('../../assets/images/startup-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
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
});

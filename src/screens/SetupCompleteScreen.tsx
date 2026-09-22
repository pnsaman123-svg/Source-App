import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

interface SetupCompleteScreenProps {
  onFinish: () => void;
}

export const SetupCompleteScreen: React.FC<SetupCompleteScreenProps> = ({
  onFinish,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();

  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Pop in checkmark
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle glow pulsing
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1.0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();

    return () => glowLoop.stop();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.topSpacer} />

      {/* Centered Success State (Figma Node 2273:13020) */}
      <View style={[styles.centerContainer, { paddingHorizontal: horizontalPadding }]}>
        {/* Glowing Green Layer */}
        <Animated.View
          style={[
            styles.glowContainer,
            { transform: [{ scale: glowAnim }] },
          ]}
        >
          <View style={styles.outerGlow} />
        </Animated.View>

        {/* Checkmark Circle Icon */}
        <Animated.View
          style={[
            styles.checkmarkCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Ionicons name="checkmark" size={54} color="#FFFFFF" />
        </Animated.View>

        {/* Text Group */}
        <View style={styles.textGroup}>
          <Text style={[styles.title, isSmallScreen && { fontSize: 22, lineHeight: 28 }]}>
            Your device is connected
          </Text>
          <Text style={styles.subtitle}>
            Your inverter is now connected and ready to monitor.
          </Text>
        </View>
      </View>

      {/* Bottom Action Button (Figma Node 2273:13040) */}
      <View style={[styles.bottomContainer, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onFinish}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8E8ED',
    justifyContent: 'space-between',
  },
  topSpacer: {
    height: 40,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -15,
  },
  outerGlow: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  checkmarkCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  textGroup: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#747474',
    textAlign: 'center',
    maxWidth: 280,
  },
  bottomContainer: {
    paddingBottom: 28,
  },
  ctaButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

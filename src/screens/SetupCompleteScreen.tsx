import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SetupCompleteScreenProps {
  onFinish: () => void;
}

export const SetupCompleteScreen: React.FC<SetupCompleteScreenProps> = ({
  onFinish,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulse1Anim = useRef(new Animated.Value(0.6)).current;
  const pulse2Anim = useRef(new Animated.Value(0.6)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.7)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.5)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation for inverter
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Gentle floating breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Concentric Green Pulse Effect
    const pulse1Loop = Animated.loop(
      Animated.parallel([
        Animated.timing(pulse1Anim, {
          toValue: 1.5,
          duration: 2400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(pulseOpacity1, {
            toValue: 0.5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity1, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const pulse2Loop = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.parallel([
          Animated.timing(pulse2Anim, {
            toValue: 1.65,
            duration: 2400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(pulseOpacity2, {
              toValue: 0.4,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity2, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    );

    pulse1Loop.start();
    pulse2Loop.start();

    return () => {
      pulse1Loop.stop();
      pulse2Loop.stop();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.topSpacer} />

      {/* Centered Inverter with Green Pulse Effect */}
      <View style={[styles.centerContainer, { paddingHorizontal: horizontalPadding }]}>
        {/* Pulse Waves Layer 2 */}
        <Animated.View
          style={[
            styles.pulseWaveOuter,
            {
              transform: [{ scale: pulse2Anim }],
              opacity: pulseOpacity2,
            },
          ]}
        />

        {/* Pulse Waves Layer 1 */}
        <Animated.View
          style={[
            styles.pulseWaveInner,
            {
              transform: [{ scale: pulse1Anim }],
              opacity: pulseOpacity1,
            },
          ]}
        />

        {/* Ambient Core Green Glow */}
        <View style={styles.coreGlow} />

        {/* Inverter Image Container with Floating and Entrance Animation */}
        <Animated.View
          style={[
            styles.inverterContainer,
            {
              transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <Image
            source={require('../../assets/images/source-inverter-connected.png')}
            style={styles.inverterImage}
            resizeMode="contain"
          />

          {/* Connected Badge Overlay */}
          <View style={styles.connectedBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.connectedBadgeText}>Connected</Text>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          </View>
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
    height: 20,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pulseWaveOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    top: 10,
  },
  pulseWaveInner: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.55)',
    top: 30,
  },
  coreGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    top: 55,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 28,
  },
  inverterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  inverterImage: {
    width: 170,
    height: 230,
  },
  connectedBadge: {
    position: 'absolute',
    bottom: -12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  connectedBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  textGroup: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
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
    maxWidth: 290,
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

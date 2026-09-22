import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ConnectingDeviceScreenProps {
  ssid?: string;
  defaultDeviceId?: string;
  onConfirm: (deviceId: string) => void;
  onBack?: () => void;
}

// Custom 8-Spoke iOS/Figma Activity Indicator with Emerald Leading Spoke
const RadialSpinner: React.FC<{ size?: number; isSmall?: boolean }> = ({
  size = 48,
  isSmall = false,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spokeWidth = isSmall ? 2 : 3.5;
  const spokeHeight = isSmall ? 5.5 : 9.5;
  const spokeRadius = isSmall ? 1 : 2;
  const containerSize = size;
  const centerOffset = containerSize / 2 - spokeWidth / 2;

  // 8 spokes with opacities matching Figma Node 2273:5719 & 2285:3996
  const spokes = [
    { angle: 0, color: '#10B981', opacity: 1 },
    { angle: 45, color: '#3C3C43', opacity: 0.87 },
    { angle: 90, color: '#3C3C43', opacity: 0.75 },
    { angle: 135, color: '#3C3C43', opacity: 0.63 },
    { angle: 180, color: '#3C3C43', opacity: 0.51 },
    { angle: 225, color: '#3C3C43', opacity: 0.39 },
    { angle: 270, color: '#3C3C43', opacity: 0.27 },
    { angle: 315, color: '#3C3C43', opacity: 0.15 },
  ];

  return (
    <Animated.View
      style={{
        width: containerSize,
        height: containerSize,
        transform: [{ rotate: spin }],
      }}
    >
      {spokes.map((spoke, idx) => (
        <View
          key={idx}
          style={{
            position: 'absolute',
            left: centerOffset,
            top: 0,
            width: spokeWidth,
            height: spokeHeight,
            backgroundColor: spoke.color,
            opacity: spoke.opacity,
            borderRadius: spokeRadius,
            transformOrigin: `50% ${containerSize / 2}px`,
            transform: [{ rotate: `${spoke.angle}deg` }],
          }}
        />
      ))}
    </Animated.View>
  );
};

export const ConnectingDeviceScreen: React.FC<ConnectingDeviceScreenProps> = ({
  ssid = 'Home_WiFi',
  defaultDeviceId = 'AMEC-INV-24001852',
  onConfirm,
  onBack,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();
  const [deviceId, setDeviceId] = useState(defaultDeviceId);
  const [stepState, setStepState] = useState<'connecting' | 'finalizing' | 'completed'>('connecting');

  // Pulse animation on outer circle
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const formSlideAnim = useRef(new Animated.Value(60)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Step 3 (Connecting to AMEC) -> Step 4 (Finalizing setup) after 2 seconds
    const timer1 = setTimeout(() => {
      setStepState('finalizing');
    }, 2000);

    // Step 4 -> Completed (Show Enter Device ID confirmation card) after 3.8 seconds
    const timer2 = setTimeout(() => {
      setStepState('completed');

      Animated.parallel([
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(formOpacityAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3800);

    return () => {
      pulseLoop.stop();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleConfirm = () => {
    onConfirm(deviceId.trim() || defaultDeviceId);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <View style={[styles.mainWrapper, { paddingHorizontal: horizontalPadding }]}>
        {/* Figma Node 2285:3993 - LoaderBlock */}
        <View style={styles.loaderBlock}>
          <Animated.View
            style={[
              styles.pulseCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.spinnerWrapper}>
              <RadialSpinner size={44} isSmall={false} />
            </View>
          </Animated.View>
        </View>

        {/* Figma Node 2273:9961 - TitleBlock */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, isSmallScreen && { fontSize: 22, lineHeight: 28 }]}>
            Connecting your device...
          </Text>
          <Text style={styles.subtitle}>
            This may take a few moments. Please keep your device powered on.
          </Text>
        </View>

        {/* Figma Node 2273:9963 - Checklist */}
        <View style={styles.checklist}>
          {/* Step 1: Device detected (Completed) */}
          <View style={styles.checklistStep}>
            <View style={styles.checkCircleBadge}>
              <Ionicons name="checkmark" size={14} color="#10B981" />
            </View>
            <Text style={styles.stepTextActive}>Device detected</Text>
          </View>

          {/* Step 2: Wi-Fi connected (Completed) */}
          <View style={styles.checklistStep}>
            <View style={styles.checkCircleBadge}>
              <Ionicons name="checkmark" size={14} color="#10B981" />
            </View>
            <Text style={styles.stepTextActive}>Wi-Fi connected</Text>
          </View>

          {/* Step 3: Connecting to AMEC */}
          <View style={styles.checklistStep}>
            {stepState === 'connecting' ? (
              <View style={styles.smallSpinnerWrapper}>
                <RadialSpinner size={22} isSmall={true} />
              </View>
            ) : (
              <View style={styles.checkCircleBadge}>
                <Ionicons name="checkmark" size={14} color="#10B981" />
              </View>
            )}
            <Text
              style={[
                styles.stepTextActive,
                stepState === 'connecting' && styles.stepTextBold,
              ]}
            >
              Connecting to AMEC
            </Text>
          </View>

          {/* Step 4: Finalizing setup */}
          <View style={styles.checklistStep}>
            {stepState === 'completed' ? (
              <View style={styles.checkCircleBadge}>
                <Ionicons name="checkmark" size={14} color="#10B981" />
              </View>
            ) : stepState === 'finalizing' ? (
              <View style={styles.smallSpinnerWrapper}>
                <RadialSpinner size={22} isSmall={true} />
              </View>
            ) : (
              <View style={styles.emptyDot} />
            )}
            <Text
              style={[
                stepState === 'completed'
                  ? styles.stepTextActive
                  : stepState === 'finalizing'
                  ? styles.stepTextBold
                  : styles.stepTextPending,
              ]}
            >
              Finalizing setup
            </Text>
          </View>
        </View>
      </View>

      {/* Figma Node 2296:712 - Floating "Enter Device ID" Card */}
      {stepState === 'completed' && (
        <Animated.View
          style={[
            styles.floatingForm,
            {
              marginHorizontal: horizontalPadding,
              transform: [{ translateY: formSlideAnim }],
              opacity: formOpacityAnim,
            },
          ]}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Enter Device ID</Text>
            <Text style={styles.formSubtitle}>
              Type your inverter serial number to connect.
            </Text>
          </View>

          <View style={styles.fieldWrapper}>
            <TextInput
              style={styles.fieldInput}
              value={deviceId}
              onChangeText={setDeviceId}
              autoCapitalize="characters"
              placeholder="e.g. AMEC-INV-24001852"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.88}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8E8ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  mainWrapper: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 24,
  },
  loaderBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  pulseCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(191, 191, 191, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  titleBlock: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#747474',
    fontWeight: '400',
  },
  checklist: {
    gap: 20,
  },
  checklistStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkCircleBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallSpinnerWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepTextActive: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  stepTextBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stepTextPending: {
    fontSize: 15,
    fontWeight: '500',
    color: '#747474',
  },
  floatingForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 20,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#747474',
    textAlign: 'center',
  },
  fieldWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  fieldInput: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1A1A1A',
  },
  confirmButton: {
    height: 56,
    borderRadius: 100,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

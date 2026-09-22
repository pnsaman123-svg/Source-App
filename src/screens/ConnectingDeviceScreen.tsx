import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

interface ConnectingDeviceScreenProps {
  ssid?: string;
  defaultDeviceId?: string;
  onConfirm: (deviceId: string) => void;
  onBack?: () => void;
}

export const ConnectingDeviceScreen: React.FC<ConnectingDeviceScreenProps> = ({
  ssid = 'Home_WiFi',
  defaultDeviceId = 'AMEC-INV-24001852',
  onConfirm,
  onBack,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();
  const [deviceId, setDeviceId] = useState(defaultDeviceId);
  const [stepIndex, setStepIndex] = useState<number>(2); // 0: detecting, 1: wifi, 2: amec, 3: finalize, 4: complete
  const [isDone, setIsDone] = useState<boolean>(false);

  // Pulse & spin animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const formSlideAnim = useRef(new Animated.Value(40)).current;
  const formOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
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

    // Continuous Spin animation
    const spinLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // Step 2 -> 3 after 1.5s
    const timer1 = setTimeout(() => {
      setStepIndex(3);
    }, 1500);

    // Step 3 -> 4 after 3.2s
    const timer2 = setTimeout(() => {
      setStepIndex(4);
      setIsDone(true);

      // Slide up the Device ID form
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
    }, 3200);

    return () => {
      pulseLoop.stop();
      spinLoop.stop();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

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

      <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
        {/* Animated Loader Block (Figma Node 2285:3993) */}
        <View style={styles.loaderBlock}>
          <Animated.View
            style={[
              styles.pulseCircle,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <View style={styles.spinnerWrapper}>
              <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
                <Ionicons name="sync" size={38} color="#10B981" />
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        {/* Title Block */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, isSmallScreen && { fontSize: 22 }]}>
            Connecting your device...
          </Text>
          <Text style={styles.subtitle}>
            This may take a few moments. Please keep your device powered on.
          </Text>
        </View>

        {/* Checklist Steps (Figma Node 2273:9963 & 2296:626) */}
        <View style={styles.checklist}>
          {/* Step 1: Device detected */}
          <View style={styles.checklistStep}>
            <View style={styles.checkBadgeActive}>
              <Ionicons name="checkmark" size={14} color="#10B981" />
            </View>
            <Text style={styles.stepTextActive}>Device detected</Text>
          </View>

          {/* Step 2: Wi-Fi connected */}
          <View style={styles.checklistStep}>
            <View style={styles.checkBadgeActive}>
              <Ionicons name="checkmark" size={14} color="#10B981" />
            </View>
            <Text style={styles.stepTextActive}>
              Wi-Fi connected {ssid ? `(${ssid})` : ''}
            </Text>
          </View>

          {/* Step 3: Connecting to AMEC */}
          <View style={styles.checklistStep}>
            {stepIndex > 2 ? (
              <View style={styles.checkBadgeActive}>
                <Ionicons name="checkmark" size={14} color="#10B981" />
              </View>
            ) : (
              <View style={styles.spinnerBadge}>
                <ActivityIndicator size="small" color="#10B981" />
              </View>
            )}
            <Text
              style={[
                styles.stepTextActive,
                stepIndex === 2 && styles.stepTextBold,
              ]}
            >
              Connecting to AMEC
            </Text>
          </View>

          {/* Step 4: Finalizing setup */}
          <View style={styles.checklistStep}>
            {stepIndex >= 4 ? (
              <View style={styles.checkBadgeActive}>
                <Ionicons name="checkmark" size={14} color="#10B981" />
              </View>
            ) : stepIndex === 3 ? (
              <View style={styles.spinnerBadge}>
                <ActivityIndicator size="small" color="#10B981" />
              </View>
            ) : (
              <View style={styles.emptyDot} />
            )}
            <Text
              style={[
                stepIndex >= 4 ? styles.stepTextActive : styles.stepTextPending,
                stepIndex === 3 && styles.stepTextBold,
              ]}
            >
              Finalizing setup
            </Text>
          </View>
        </View>
      </View>

      {/* Floating "Enter Device ID" Card (Figma Node 2296:712) */}
      {isDone && (
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
            activeOpacity={0.85}
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
  container: {
    flex: 1,
    paddingTop: 16,
  },
  loaderBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  pulseCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  spinnerWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  titleBlock: {
    marginBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#747474',
  },
  checklist: {
    gap: 20,
  },
  checklistStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkBadgeActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  stepTextActive: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  stepTextBold: {
    fontWeight: '800',
    color: '#1A1A1A',
  },
  stepTextPending: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  floatingForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13.5,
    color: '#747474',
    textAlign: 'center',
  },
  fieldWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
  },
  fieldInput: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  confirmButton: {
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

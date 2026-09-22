import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfirmLocationScreenProps {
  onConfirm: () => void;
  onBack: () => void;
}

interface LocationInfo {
  name: string;
  address: string;
}

const DUMMY_LOCATIONS: LocationInfo[] = [
  {
    name: 'SolarGrid Energy Solutions Pvt. Ltd.',
    address: 'Plot No. 42, Sunrise Tech Park, Whitefield Main Rd, Bengaluru, Karnataka 560066',
  },
  {
    name: 'GreenPeak Smart Residence',
    address: 'Villa 14, Palm Meadows, Varthur Road, Bengaluru, Karnataka 560066',
  },
  {
    name: 'Apex Clean Energy Hub',
    address: 'Building 7B, Cyber Gateway, Hitech City, Hyderabad, Telangana 500081',
  },
  {
    name: 'EcoVolt Microgrid Site',
    address: 'Sector 62, Electronic City Phase 1, Bengaluru, Karnataka 560100',
  },
  {
    name: 'SunWave Renewable Facility',
    address: 'Flat 402, Sunshine Heights, Baner Road, Pune, Maharashtra 411045',
  },
];

export const ConfirmLocationScreen: React.FC<ConfirmLocationScreenProps> = ({
  onConfirm,
  onBack,
}) => {
  const { isSmallScreen, horizontalPadding } = useResponsive();
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(DUMMY_LOCATIONS[0]);
  const [isLocating, setIsLocating] = useState<boolean>(true);

  // Animation values
  const pulseRing1 = useRef(new Animated.Value(0.4)).current;
  const pulseOpacity1 = useRef(new Animated.Value(0.8)).current;
  const pulseRing2 = useRef(new Animated.Value(0.4)).current;
  const pulseOpacity2 = useRef(new Animated.Value(0.8)).current;
  const cardSlideAnim = useRef(new Animated.Value(30)).current;
  const cardOpacityAnim = useRef(new Animated.Value(0)).current;

  const fetchRandomLocation = () => {
    setIsLocating(true);
    // Pick random location
    const randomIndex = Math.floor(Math.random() * DUMMY_LOCATIONS.length);
    setTimeout(() => {
      setCurrentLocation(DUMMY_LOCATIONS[randomIndex]);
      setIsLocating(false);
    }, 700);
  };

  useEffect(() => {
    // 1. Concentric Radar Pulse Animations for Map Pin
    const animateRing1 = Animated.loop(
      Animated.parallel([
        Animated.timing(pulseRing1, {
          toValue: 2.2,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity1, {
          toValue: 0,
          duration: 1800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const animateRing2 = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(pulseRing2, {
            toValue: 2.2,
            duration: 1800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity2, {
            toValue: 0,
            duration: 1800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animateRing1.start();
    animateRing2.start();

    // 2. Initial simulated location fetch
    const timer = setTimeout(() => {
      setIsLocating(false);
      Animated.parallel([
        Animated.timing(cardSlideAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 900);

    return () => {
      clearTimeout(timer);
      animateRing1.stop();
      animateRing2.stop();
    };
  }, []);

  return (
    <View style={styles.root}>
      {/* Clean Signature Background Gradient */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header Bar */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Confirm Location</Text>

          {/* Placeholder for symmetrical spacing */}
          <View style={styles.placeholderButton} />
        </View>

        {/* Central Location Pin with Animated Radar Ripple */}
        <View style={styles.centerContainer} pointerEvents="box-none">
          {/* Outer Pulse Ring 1 */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseRing1 }],
                opacity: pulseOpacity1,
              },
            ]}
          />

          {/* Outer Pulse Ring 2 */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseRing2 }],
                opacity: pulseOpacity2,
              },
            ]}
          />

          {/* Central Dark Pin Badge */}
          <TouchableOpacity
            style={styles.pinBadge}
            onPress={fetchRandomLocation}
            activeOpacity={0.85}
          >
            {isLocating ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="location-sharp" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Location Details Card & CTA Button */}
        <View style={[styles.bottomContainer, { paddingHorizontal: horizontalPadding }]}>
          {/* Location Summary Card */}
          <Animated.View
            style={[
              styles.locationCard,
              {
                opacity: cardOpacityAnim,
                transform: [{ translateY: cardSlideAnim }],
              },
            ]}
          >
            <View style={styles.locationIconContainer}>
              <Ionicons name="location-outline" size={24} color="#1A1A1A" />
            </View>

            <View style={styles.locationTextContainer}>
              <Text style={styles.locationName}>{currentLocation.name}</Text>
              <Text style={styles.locationAddress}>{currentLocation.address}</Text>
            </View>
          </Animated.View>

          {/* Confirm Location CTA Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  placeholderButton: {
    width: 44,
    height: 44,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(26, 26, 26, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(26, 26, 26, 0.3)',
  },
  pinBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  bottomContainer: {
    paddingBottom: 24,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  locationIconContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  locationAddress: {
    fontSize: 13,
    lineHeight: 18,
    color: '#737373',
    fontWeight: '400',
  },
  confirmButton: {
    backgroundColor: '#1A1A1A',
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

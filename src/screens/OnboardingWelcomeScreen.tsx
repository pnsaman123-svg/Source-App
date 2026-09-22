import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({
  onNext,
  onSkip,
}) => {
  const { isSmallScreen, horizontalPadding } = useResponsive();

  // Dynamic sizing based on screen dimensions
  const heroHeight = SCREEN_HEIGHT * 0.48;

  return (
    <View style={styles.root}>
      {/* Clean Background Gradient */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Header: 3-Segment Indicator + Skip Button */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          {/* Symmetrical placeholder for centering indicators */}
          <View style={styles.headerSpacer} />

          {/* 3 Progress Bars */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, styles.activeProgressBar]} />
            <View style={styles.progressBar} />
            <View style={styles.progressBar} />
          </View>

          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Central Phone Mockup Hero Illustration */}
        <View style={styles.heroContainer}>
          <Image
            source={require('../../assets/images/onboarding-device-mockup.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Content & CTA Section Matching Figma Node 2919:2366 */}
        <View style={[styles.bottomSection, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.textSection}>
            <Text style={[styles.title, isSmallScreen && { fontSize: 28, lineHeight: 34 }]}>
              Connect{'\n'}Your Energy
            </Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 14.5, lineHeight: 21 }]}>
              Connect your SOURCE Inverter and bring your energy system into one simple app.
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E8E8ED',
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
  headerSpacer: {
    width: 48,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressBar: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCDCE2',
  },
  activeProgressBar: {
    backgroundColor: '#6B6B70',
  },
  skipButton: {
    width: 48,
    alignItems: 'flex-end',
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 6,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  bottomSection: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  textSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: '#6B6B70',
    fontWeight: '400',
    maxWidth: '92%',
  },
  nextButton: {
    backgroundColor: '#1A1A1A',
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

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
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingWelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

const ONBOARDING_SLIDES = [
  {
    id: 'slide-1',
    image: require('../../assets/images/onboarding-device-mockup.png'),
    title: 'Connect\nYour Energy',
    subtitle: 'Connect your SOURCE Inverter and bring your energy system into one simple app.',
  },
  {
    id: 'slide-2',
    image: require('../../assets/images/onboarding-analytics-mockup.png'),
    title: 'See Your\nEnergy Clearly',
    subtitle: 'Monitor solar generation, battery status, home usage and energy flow in real time.',
  },
  {
    id: 'slide-3',
    image: require('../../assets/images/onboarding-control-mockup.png'),
    title: 'Power Smarter.\nClean Smarter.',
    subtitle: 'Control your energy. Keep your panels performing at their best.',
  },
];

export const OnboardingWelcomeScreen: React.FC<OnboardingWelcomeScreenProps> = ({
  onNext,
  onSkip,
}) => {
  const { isSmallScreen, horizontalPadding } = useResponsive();
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState<number>(0);

  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;

  const handleNext = () => {
    if (!isLastSlide) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

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
            <View
              style={[
                styles.progressBar,
                currentSlideIndex === 0 && styles.activeProgressBar,
              ]}
            />
            <View
              style={[
                styles.progressBar,
                currentSlideIndex === 1 && styles.activeProgressBar,
              ]}
            />
            <View
              style={[
                styles.progressBar,
                currentSlideIndex === 2 && styles.activeProgressBar,
              ]}
            />
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

        {/* Central Mockup / Illustration Area */}
        <View style={styles.heroContainer}>
          <Image
            key={currentSlide.id}
            source={currentSlide.image}
            style={styles.heroImage}
            resizeMode="contain"
          />
          {/* Seamless Bottom Gradient Fade into Screen Background */}
          <LinearGradient
            colors={['rgba(232, 232, 237, 0)', 'rgba(232, 232, 237, 0.4)', 'rgba(232, 232, 237, 0.85)', '#E8E8ED']}
            locations={[0, 0.4, 0.75, 1]}
            style={styles.heroBottomGradient}
            pointerEvents="none"
          />
        </View>

        {/* Bottom Content & CTA Section */}
        <View style={[styles.bottomSection, { paddingHorizontal: horizontalPadding }]}>
          <View style={styles.textSection}>
            <Text style={[styles.title, isSmallScreen && { fontSize: 28, lineHeight: 34 }]}>
              {currentSlide.title}
            </Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 14.5, lineHeight: 21 }]}>
              {currentSlide.subtitle}
            </Text>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
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
  heroBottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
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

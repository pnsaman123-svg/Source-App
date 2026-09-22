import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // Animation references for smooth transitions
  const contentFadeAnim = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  const heroScaleAnim = useRef(new Animated.Value(1)).current;
  const btnScaleAnim = useRef(new Animated.Value(1)).current;

  const currentSlide = ONBOARDING_SLIDES[currentSlideIndex];
  const isLastSlide = currentSlideIndex === ONBOARDING_SLIDES.length - 1;

  const animateSlideChange = (newIndex: number, direction: 'next' | 'prev') => {
    // Exit current content
    Animated.parallel([
      Animated.timing(contentFadeAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: direction === 'next' ? -35 : 35,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(heroScaleAnim, {
        toValue: 0.94,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSlideIndex(newIndex);
      contentTranslateX.setValue(direction === 'next' ? 35 : -35);

      // Enter new content
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(contentTranslateX, {
          toValue: 0,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.spring(heroScaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    // Button press scale feedback
    Animated.sequence([
      Animated.timing(btnScaleAnim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(btnScaleAnim, {
        toValue: 1.0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    if (!isLastSlide) {
      animateSlideChange(currentSlideIndex + 1, 'next');
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentSlideIndex > 0) {
      animateSlideChange(currentSlideIndex - 1, 'prev');
    }
  };

  return (
    <View style={[styles.root, currentSlideIndex > 0 && styles.rootFlat]}>
      {/* Clean Background Gradient Only on Slide 1 */}
      {currentSlideIndex === 0 && (
        <Image
          source={require('../../assets/images/bg-gradient.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Header: Back Button + 3-Segment Indicator + Skip Button */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          {currentSlideIndex > 0 ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}

          {/* 3 Progress Bars with Smooth Active Transitions */}
          <View style={styles.progressContainer}>
            {ONBOARDING_SLIDES.map((slide, idx) => (
              <View
                key={slide.id}
                style={[
                  styles.progressBar,
                  idx === currentSlideIndex && styles.activeProgressBar,
                  idx < currentSlideIndex && styles.completedProgressBar,
                ]}
              />
            ))}
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

        {/* Central Mockup / Illustration Area with Slide & Spring Animation */}
        <Animated.View
          style={[
            styles.heroContainer,
            {
              opacity: contentFadeAnim,
              transform: [
                { translateX: contentTranslateX },
                { scale: heroScaleAnim },
              ],
            },
          ]}
        >
          <Image
            source={currentSlide.image}
            style={styles.heroImage}
            resizeMode="contain"
          />
          {/* Seamless Bottom Gradient Fade */}
          <LinearGradient
            colors={
              currentSlideIndex === 0
                ? ['rgba(232, 232, 237, 0)', 'rgba(232, 232, 237, 0.4)', 'rgba(232, 232, 237, 0.85)', '#E8E8ED']
                : ['rgba(242, 242, 247, 0)', 'rgba(242, 242, 247, 0.4)', 'rgba(242, 242, 247, 0.85)', '#F2F2F7']
            }
            locations={[0, 0.4, 0.75, 1]}
            style={styles.heroBottomGradient}
            pointerEvents="none"
          />
        </Animated.View>

        {/* Bottom Content & CTA Section */}
        <View style={[styles.bottomSection, { paddingHorizontal: horizontalPadding }]}>
          <Animated.View
            style={[
              styles.textSection,
              {
                opacity: contentFadeAnim,
                transform: [{ translateX: contentTranslateX }],
              },
            ]}
          >
            <Text style={[styles.title, isSmallScreen && { fontSize: 28, lineHeight: 34 }]}>
              {currentSlide.title}
            </Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 14.5, lineHeight: 21 }]}>
              {currentSlide.subtitle}
            </Text>
          </Animated.View>

          {/* Animated Next Button */}
          <Animated.View style={{ transform: [{ scale: btnScaleAnim }] }}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.88}
            >
              <Text style={styles.nextButtonText}>
                {isLastSlide ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
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
  rootFlat: {
    backgroundColor: '#F2F2F7',
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
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 4,
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
    backgroundColor: '#1A1A1A',
    width: 34,
  },
  completedProgressBar: {
    backgroundColor: '#6B6B70',
  },
  skipButton: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 17.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

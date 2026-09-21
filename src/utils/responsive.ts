import { useWindowDimensions, PixelRatio, Platform } from 'react-native';

// Standard baseline dimensions (iPhone 14 / modern standard smartphone)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Hook providing responsive metrics based on the current window dimensions.
 * Dynamically adapts to orientation changes, multi-window mode, and various device sizes.
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  // Screen classifications
  const isSmallScreen = width < 365;       // e.g. iPhone SE, compact Androids (320-360px)
  const isMediumScreen = width >= 365 && width <= 410; // Standard devices (375-393px)
  const isLargeScreen = width > 410;       // Large devices / Plus / Max / Ultra (412-440px+)

  // Proportional scaling helpers
  const scale = (size: number) => (width / BASE_WIDTH) * size;
  const verticalScale = (size: number) => (height / BASE_HEIGHT) * size;
  
  /**
   * Moderate scaling with a dampening factor (0.5 by default).
   * Ideal for font sizes, padding, and borders to prevent extreme shrinking/enlargement.
   */
  const moderateScale = (size: number, factor = 0.5) => {
    return size + (scale(size) - size) * factor;
  };

  // Adaptive horizontal padding for container edges
  const horizontalPadding = isSmallScreen ? 16 : isMediumScreen ? 20 : 24;

  // Available content width within standard container padding
  const contentWidth = Math.min(width - horizontalPadding * 2, 540);

  // Top hero carousel width
  const heroWidth = contentWidth;
  const heroHeight = Math.round(moderateScale(321, 0.4));

  // Percentage-based helpers
  const wp = (percentage: number) => (width * percentage) / 100;
  const hp = (percentage: number) => (height * percentage) / 100;

  return {
    width,
    height,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    horizontalPadding,
    contentWidth,
    heroWidth,
    heroHeight,
    scale,
    verticalScale,
    moderateScale,
    wp,
    hp,
  };
};

/**
 * Static scaling helpers for use in StyleSheet.create where hooks cannot be called directly.
 */
export const scale = (size: number, screenWidth: number = BASE_WIDTH) =>
  (screenWidth / BASE_WIDTH) * size;

export const moderateScale = (
  size: number,
  factor = 0.5,
  screenWidth: number = BASE_WIDTH
) => size + (scale(size, screenWidth) - size) * factor;

import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useResponsive } from '../utils/responsive';

interface HouseHeroProps {
  solarKw?: number;
  gridKw?: number;
  batterySoc?: number;
  loadKw?: number;
  onSelectMetric?: (metric: 'solar' | 'grid' | 'battery' | 'load') => void;
}

export const HouseHero: React.FC<HouseHeroProps> = ({
  solarKw = 6.5,
  gridKw = 0.0,
  batterySoc = 77,
  loadKw = 4.5,
  onSelectMetric,
}) => {
  const { heroWidth, heroHeight } = useResponsive();

  return (
    <View style={[styles.container, { width: heroWidth, height: heroHeight }]}>
      {/* 3D Smart House Illustration */}
      <Image
        source={require('../../assets/images/house.png')}
        style={styles.houseImage}
        resizeMode="contain"
      />

      {/* Interactive Touch Callouts mapped directly to Figma 2312:1532 coordinates */}
      {/* 1. Solar (Top Left - x: 105, y: 0) */}
      <TouchableOpacity
        style={[styles.touchTarget, styles.touchSolar]}
        onPress={() => onSelectMetric?.('solar')}
        activeOpacity={0.7}
      />

      {/* 2. Grid (Top Right - x: 243, y: 0) */}
      <TouchableOpacity
        style={[styles.touchTarget, styles.touchGrid]}
        onPress={() => onSelectMetric?.('grid')}
        activeOpacity={0.7}
      />

      {/* 3. Load (Bottom Left - x: 30, y: 282) */}
      <TouchableOpacity
        style={[styles.touchTarget, styles.touchLoad]}
        onPress={() => onSelectMetric?.('load')}
        activeOpacity={0.7}
      />

      {/* 4. Battery (Bottom Right - x: 179, y: 280) */}
      <TouchableOpacity
        style={[styles.touchTarget, styles.touchBattery]}
        onPress={() => onSelectMetric?.('battery')}
        activeOpacity={0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
  touchTarget: {
    position: 'absolute',
    width: 68,
    height: 44,
    borderRadius: 8,
  },
  touchSolar: {
    top: 0,
    left: '28%',
  },
  touchGrid: {
    top: 0,
    right: '20%',
  },
  touchLoad: {
    bottom: 2,
    left: '8%',
  },
  touchBattery: {
    bottom: 4,
    right: '40%',
  },
});

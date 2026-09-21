import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useResponsive } from '../utils/responsive';

export const RobotCleanerHero: React.FC = () => {
  const { heroWidth, heroHeight } = useResponsive();

  return (
    <View style={[styles.container, { width: heroWidth, height: heroHeight }]}>
      <Image
        source={require('../../assets/images/clean-tech-hero.png')}
        style={styles.robotImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  robotImage: {
    width: '100%',
    height: '100%',
  },
});

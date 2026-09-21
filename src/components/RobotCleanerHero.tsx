import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - 48; // 24px left + 24px right padding
const HERO_HEIGHT = 321; // Figma exact slide height

export const RobotCleanerHero: React.FC = () => {
  return (
    <View style={styles.container}>
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
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
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

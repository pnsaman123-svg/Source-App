import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { PowerFlowDiagram } from './PowerFlowDiagram';
import { useResponsive } from '../utils/responsive';

interface EnergyHeroProps {
  solarKw?: number;
  gridKw?: number;
  batterySoc?: number;
  loadKw?: number;
  activeSlide?: number;
  onSlideChange?: (index: number) => void;
  onSelectMetric?: (metric: 'solar' | 'grid' | 'battery' | 'load') => void;
}

export const EnergyHero: React.FC<EnergyHeroProps> = ({
  solarKw = 6.5,
  gridKw = 0.0,
  batterySoc = 77,
  loadKw = 4.5,
  activeSlide = 0,
  onSlideChange,
  onSelectMetric,
}) => {
  const { heroWidth, heroHeight } = useResponsive();
  const [currentSlide, setCurrentSlide] = useState(activeSlide);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (activeSlide !== currentSlide) {
      setCurrentSlide(activeSlide);
      scrollViewRef.current?.scrollTo({
        x: activeSlide * heroWidth,
        animated: true,
      });
    }
  }, [activeSlide]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / heroWidth);
    if (index !== currentSlide && (index === 0 || index === 1 || index === 2)) {
      setCurrentSlide(index);
      onSlideChange?.(index);
    }
  };

  const scrollToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * heroWidth,
      animated: true,
    });
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  return (
    <View style={styles.container}>
      {/* 3-Slide Carousel Container */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
        snapToInterval={heroWidth}
        snapToAlignment="center"
        style={[styles.scrollView, { width: heroWidth, height: heroHeight }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Slide 1: 3D Smart House Hero */}
        <View style={[styles.slide, { width: heroWidth, height: heroHeight }]}>
          <View style={styles.houseContainer}>
            <Image
              source={require('../../assets/images/house.png')}
              style={styles.houseImage}
              resizeMode="contain"
            />

            {/* Pointer Lines */}
            <View style={styles.lineSolar} />
            <View style={styles.lineGrid} />
            <View style={styles.lineLoad} />
            <View style={styles.lineBattery} />

            {/* Metric 1: Solar */}
            <TouchableOpacity
              style={[styles.metricBox, styles.solarBox]}
              onPress={() => onSelectMetric?.('solar')}
              activeOpacity={0.8}
            >
              <Text style={styles.metricValue}>{solarKw}kw</Text>
              <Text style={styles.metricLabel}>Solar</Text>
            </TouchableOpacity>

            {/* Metric 2: Grid */}
            <TouchableOpacity
              style={[styles.metricBox, styles.gridBox]}
              onPress={() => onSelectMetric?.('grid')}
              activeOpacity={0.8}
            >
              <Text style={styles.metricValue}>{gridKw.toFixed(0)}.kw</Text>
              <Text style={styles.metricLabel}>Grid</Text>
            </TouchableOpacity>

            {/* Metric 3: Load */}
            <TouchableOpacity
              style={[styles.metricBox, styles.loadBox]}
              onPress={() => onSelectMetric?.('load')}
              activeOpacity={0.8}
            >
              <Text style={styles.metricValue}>{loadKw}kw</Text>
              <Text style={styles.metricLabel}>Load</Text>
            </TouchableOpacity>

            {/* Metric 4: Battery */}
            <TouchableOpacity
              style={[styles.metricBox, styles.batteryBox]}
              onPress={() => onSelectMetric?.('battery')}
              activeOpacity={0.8}
            >
              <Text style={styles.metricValue}>{batterySoc}%</Text>
              <Text style={styles.metricLabel}>Battery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Slide 2: Power Flow Diagram */}
        <View style={[styles.slide, { width: heroWidth, height: heroHeight }]}>
          <PowerFlowDiagram
            solarKw={solarKw}
            batterySoc={batterySoc}
            gridKw={-1}
            loadKw={loadKw}
          />
        </View>

        {/* Slide 3: Solar Robot Cleaner Hero */}
        <View style={[styles.slide, { width: heroWidth, height: heroHeight }]}>
          <View style={styles.robotContainer}>
            {/* Status Pill Badge */}
            <View style={styles.statusPill}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusPillText}>Online</Text>
            </View>

            {/* 3D Cleaner Robot Asset */}
            <Image
              source={require('../../assets/images/cleaner-robot.png')}
              style={styles.robotImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>

      {/* 3-Dot Carousel Indicators */}
      <View style={styles.paginationContainer}>
        {[0, 1, 2].map((idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => scrollToSlide(idx)}
            activeOpacity={0.8}
            style={[
              styles.dot,
              currentSlide === idx ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  scrollView: {},
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
  robotContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: '100%',
    height: '85%',
    marginTop: 20,
  },
  statusPill: {
    position: 'absolute',
    top: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
    zIndex: 10,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  // Connector Lines
  lineSolar: {
    position: 'absolute',
    top: 36,
    left: '32%',
    width: 1,
    height: 70,
    backgroundColor: Colors.pinLine,
  },
  lineGrid: {
    position: 'absolute',
    top: 36,
    right: '18%',
    width: 1,
    height: 65,
    backgroundColor: Colors.pinLine,
  },
  lineLoad: {
    position: 'absolute',
    bottom: 38,
    left: '20%',
    width: 1,
    height: 60,
    backgroundColor: Colors.pinLine,
  },
  lineBattery: {
    position: 'absolute',
    bottom: 38,
    right: '46%',
    width: 1,
    height: 60,
    backgroundColor: Colors.pinLine,
  },
  metricBox: {
    position: 'absolute',
    gap: 2,
  },
  solarBox: {
    top: 2,
    left: '32%',
  },
  gridBox: {
    top: 2,
    right: '18%',
  },
  loadBox: {
    bottom: 8,
    left: '12%',
  },
  batteryBox: {
    bottom: 8,
    right: '46%',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  inactiveDot: {
    width: 12,
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#6B7280',
  },
});

import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { HouseHero } from '../components/HouseHero';
import { PowerFlowDiagram } from '../components/PowerFlowDiagram';
import { RobotCleanerHero } from '../components/RobotCleanerHero';
import { CarouselIndicators } from '../components/CarouselIndicators';
import { SavingsSection } from '../components/SavingsSection';
import { OverviewSection } from '../components/OverviewSection';
import { CleanTechControls } from '../components/CleanTechControls';
import { Colors } from '../theme/colors';
import { EnergyTelemetry } from '../types/energy';
import { useResponsive } from '../utils/responsive';

const INITIAL_TELEMETRY: EnergyTelemetry = {
  userName: 'Anay',
  solarGenerationKw: 6.5,
  gridPowerKw: 0.0,
  batterySocPercent: 77,
  loadConsumptionKw: 4.57,
  sourceMonitoringKwh: 6.5,
  weeklyEarningsInr: 145,
  co2SavingsTons: 12.09,
  batteryStatus: 'Good',
  sourceStatus: 'Optimal',
  loadStatus: 'Moderate',
};

interface HomeScreenProps {
  onPressNotifications?: () => void;
  onPressSettings?: () => void;
  onPressBatterySoc?: () => void;
  onPressSourceMonitoring?: () => void;
  onPressLoadConsumption?: () => void;
  onPressEarnings?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPressNotifications,
  onPressSettings,
  onPressBatterySoc,
  onPressSourceMonitoring,
  onPressLoadConsumption,
  onPressEarnings,
}) => {
  const { heroWidth, heroHeight } = useResponsive();
  const [telemetry, setTelemetry] = useState<EnergyTelemetry>(INITIAL_TELEMETRY);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0); // 0 = House, 1 = Flow Diagram, 2 = Clean Tech

  const topHeroScrollRef = useRef<ScrollView>(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTelemetry((prev) => ({
        ...prev,
        solarGenerationKw: +(6.2 + Math.random() * 0.6).toFixed(1),
        batterySocPercent: Math.min(100, Math.max(70, prev.batterySocPercent + Math.floor(Math.random() * 3) - 1)),
        loadConsumptionKw: +(4.4 + Math.random() * 0.4).toFixed(2),
        weeklyEarningsInr: prev.weeklyEarningsInr + Math.floor(Math.random() * 2),
      }));
      setRefreshing(false);
    }, 800);
  };

  const handleSelectMetric = (metric: 'solar' | 'grid' | 'battery' | 'load') => {
    const titles = {
      solar: `Solar Generation: ${telemetry.solarGenerationKw} kW`,
      grid: `Grid Connection: ${telemetry.gridPowerKw} kW (Standby)`,
      battery: `Battery Reserve: ${telemetry.batterySocPercent}% (${telemetry.batteryStatus})`,
      load: `Current Home Load: ${telemetry.loadConsumptionKw} kW (${telemetry.loadStatus})`,
    };
    Alert.alert('Energy Telemetry', titles[metric]);
  };

  // Top Hero Carousel Scroll Handler
  const handleTopScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / heroWidth);
    if (index !== activeSlide && (index === 0 || index === 1 || index === 2)) {
      setActiveSlide(index);
    }
  };

  // Dot Navigation Tap Handler
  const scrollToSlide = (index: number) => {
    setActiveSlide(index);
    topHeroScrollRef.current?.scrollTo({
      x: index * heroWidth,
      animated: true,
    });
  };

  const isCleanTechMode = activeSlide === 2;

  return (
    <View style={styles.root}>
      {/* 100% Pixel-matched Figma Radial Background Image */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* 1. Fixed Top Header */}
        <Header
          userName={telemetry.userName}
          onPressNotifications={onPressNotifications || (() => Alert.alert('Notifications', 'All energy systems normal.'))}
          onPressSettings={onPressSettings || (() => Alert.alert('Settings', 'Configure inverter & grid tariffs.'))}
        />

        {/* Complete Page Vertical ScrollView */}
        <ScrollView
          style={styles.verticalScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.solar}
            />
          }
        >
          {/* Top Hero Carousel */}
          <View style={[styles.heroCarouselContainer, { height: heroHeight }]}>
            <ScrollView
              ref={topHeroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleTopScroll}
              scrollEventThrottle={16}
              style={[styles.heroScrollView, { width: heroWidth, height: heroHeight }]}
              contentContainerStyle={styles.heroScrollContent}
              decelerationRate="fast"
              snapToInterval={heroWidth}
              snapToAlignment="center"
            >
              {/* Slide 1: 3D Smart House with Interactive Callouts */}
              <View style={[styles.heroSlide, { width: heroWidth, height: heroHeight }]}>
                <HouseHero
                  solarKw={telemetry.solarGenerationKw}
                  gridKw={telemetry.gridPowerKw}
                  batterySoc={telemetry.batterySocPercent}
                  loadKw={telemetry.loadConsumptionKw}
                  onSelectMetric={handleSelectMetric}
                />
              </View>

              {/* Slide 2: Dynamic Animated Power Flow Diagram */}
              <View style={[styles.heroSlide, { width: heroWidth, height: heroHeight }]}>
                <PowerFlowDiagram
                  solarKw={telemetry.solarGenerationKw}
                  batterySoc={telemetry.batterySocPercent}
                  gridKw={-1}
                  loadKw={telemetry.loadConsumptionKw}
                  onSelectMetric={handleSelectMetric}
                />
              </View>

              {/* Slide 3: Clean Tech Robot Hero */}
              <View style={[styles.heroSlide, { width: heroWidth, height: heroHeight }]}>
                <RobotCleanerHero />
              </View>
            </ScrollView>
          </View>

          {/* Carousel Dot Indicators */}
          <View style={styles.dotsContainer}>
            <CarouselIndicators
              activeIndex={activeSlide}
              count={3}
              onPressDot={scrollToSlide}
            />
          </View>

          {/* Morphing Bottom Section */}
          {!isCleanTechMode ? (
            <View key="standard-dashboard">
              <SavingsSection
                weeklyEarnings={telemetry.weeklyEarningsInr}
                co2Savings={telemetry.co2SavingsTons}
                onPressEarnings={
                  onPressEarnings ||
                  (() =>
                    Alert.alert('Weekly Earnings', `Total solar export earnings: ₹${telemetry.weeklyEarningsInr}`)
                  )
                }
                onPressCo2={
                  onPressEarnings ||
                  (() =>
                    Alert.alert('Carbon Footprint', `You have reduced ${telemetry.co2SavingsTons} tons of CO₂ emissions!`)
                  )
                }
              />

              <OverviewSection
                batterySoc={telemetry.batterySocPercent}
                batteryStatus={telemetry.batteryStatus}
                sourceKwh={telemetry.sourceMonitoringKwh}
                sourceStatus={telemetry.sourceStatus}
                loadKw={telemetry.loadConsumptionKw}
                loadStatus={telemetry.loadStatus}
                onPressCard={(card) => {
                  if (card === 'battery' && onPressBatterySoc) {
                    onPressBatterySoc();
                  } else if (card === 'source' && onPressSourceMonitoring) {
                    onPressSourceMonitoring();
                  } else if (card === 'load' && onPressLoadConsumption) {
                    onPressLoadConsumption();
                  } else {
                    Alert.alert('System Detail', `Viewing detailed analytics for ${card}`);
                  }
                }}
              />
            </View>
          ) : (
            /* Slide 3: Clean Tech Controls */
            <View key="cleantech-controls">
              <CleanTechControls />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  verticalScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 175,
  },
  heroCarouselContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroScrollView: {},
  heroScrollContent: {
    alignItems: 'center',
  },
  heroSlide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    marginBottom: 4,
  },
});

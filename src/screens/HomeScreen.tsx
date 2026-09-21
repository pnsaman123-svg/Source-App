import React, { useState, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  View,
  Image,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - 48; // 24px left + 24px right padding
const HERO_HEIGHT = 321; // Figma Node 2312:1532 height

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
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPressNotifications,
  onPressSettings,
  onPressBatterySoc,
  onPressSourceMonitoring,
  onPressLoadConsumption,
}) => {
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
    const index = Math.round(offsetX / HERO_WIDTH);
    if (index !== activeSlide && (index === 0 || index === 1 || index === 2)) {
      setActiveSlide(index);
    }
  };

  // Dot Navigation Tap Handler
  const scrollToSlide = (index: number) => {
    setActiveSlide(index);
    topHeroScrollRef.current?.scrollTo({
      x: index * HERO_WIDTH,
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
          {/* 2. Top Hero Carousel (Horizontal) */}
          <View style={styles.heroCarouselContainer}>
            <ScrollView
              ref={topHeroScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleTopScroll}
              decelerationRate="fast"
              snapToInterval={HERO_WIDTH}
              snapToAlignment="center"
              style={styles.heroScrollView}
              contentContainerStyle={styles.heroScrollContent}
              nestedScrollEnabled={true}
            >
              {/* Hero 1: 3D House */}
              <View style={styles.heroSlide}>
                <HouseHero
                  solarKw={telemetry.solarGenerationKw}
                  gridKw={telemetry.gridPowerKw}
                  batterySoc={telemetry.batterySocPercent}
                  loadKw={Math.round(telemetry.loadConsumptionKw * 10) / 10}
                  onSelectMetric={handleSelectMetric}
                />
              </View>

              {/* Hero 2: Power Flow Diagram */}
              <View style={styles.heroSlide}>
                <PowerFlowDiagram
                  solarKw={telemetry.solarGenerationKw}
                  batterySoc={telemetry.batterySocPercent}
                  gridKw={telemetry.gridPowerKw}
                  loadKw={Math.round(telemetry.loadConsumptionKw * 10) / 10}
                  onSelectMetric={handleSelectMetric}
                />
              </View>

              {/* Hero 3: Clean Tech Robot Cleaner */}
              <View style={styles.heroSlide}>
                <RobotCleanerHero />
              </View>
            </ScrollView>
          </View>

          {/* 3. CAROUSEL DOTS */}
          <View style={styles.dotsContainer}>
            <CarouselIndicators
              activeIndex={activeSlide}
              total={3}
              onSelectIndex={scrollToSlide}
            />
          </View>

          {/* 4. Bottom Content (Persistent Savings & Overview for Slide 1 & 2, CleanTechControls for Slide 3) */}
          {!isCleanTechMode ? (
            /* Slide 1 & 2: Savings + Overview (Persistent & Non-sliding) */
            <View key="energy-cards">
              <SavingsSection
                weeklyEarnings={telemetry.weeklyEarningsInr}
                co2Savings={telemetry.co2SavingsTons}
                onPressEarnings={() =>
                  Alert.alert('Weekly Earnings', `Total solar export earnings: ₹${telemetry.weeklyEarningsInr}`)
                }
                onPressCo2={() =>
                  Alert.alert('Carbon Footprint', `You have reduced ${telemetry.co2SavingsTons} tons of CO₂ emissions!`)
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
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroScrollView: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  },
  heroScrollContent: {
    alignItems: 'center',
  },
  heroSlide: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
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

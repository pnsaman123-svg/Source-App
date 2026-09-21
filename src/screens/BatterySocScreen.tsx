import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface BatterySocScreenProps {
  onBack?: () => void;
  batterySoc?: number;
  batteryTemp?: number;
}

type TimeRangeTab = 'Day' | 'Week' | 'Month' | 'Year';

interface ChartItem {
  label: string;
  charge: number;
  discharge: number;
  totalHeight?: number;
}

const CHART_DATA: Record<TimeRangeTab, ChartItem[]> = {
  Day: [
    { label: '04:00', charge: 20, discharge: 15, totalHeight: 45 },
    { label: '08:00', charge: 65, discharge: 25, totalHeight: 85 },
    { label: '12:00', charge: 95, discharge: 30, totalHeight: 118 },
    { label: '16:00', charge: 75, discharge: 45, totalHeight: 96 },
    { label: '20:00', charge: 35, discharge: 60, totalHeight: 75 },
    { label: '00:00', charge: 15, discharge: 40, totalHeight: 48 },
  ],
  Week: [
    { label: 'Mon', charge: 35, discharge: 18, totalHeight: 53 },
    { label: 'Tue', charge: 52, discharge: 27, totalHeight: 79 },
    { label: 'Wed', charge: 58, discharge: 27, totalHeight: 85 },
    { label: 'Thu', charge: 78, discharge: 39, totalHeight: 117 },
    { label: 'Fri', charge: 63, discharge: 32, totalHeight: 95 },
    { label: 'Sat', charge: 47, discharge: 24, totalHeight: 71 },
    { label: 'Sun', charge: 65, discharge: 33, totalHeight: 98 },
  ],
  Month: [
    { label: 'W1', charge: 70, discharge: 45, totalHeight: 85 },
    { label: 'W2', charge: 85, discharge: 55, totalHeight: 105 },
    { label: 'W3', charge: 90, discharge: 60, totalHeight: 115 },
    { label: 'W4', charge: 78, discharge: 50, totalHeight: 95 },
  ],
  Year: [
    { label: 'Q1', charge: 60, discharge: 40, totalHeight: 75 },
    { label: 'Q2', charge: 88, discharge: 62, totalHeight: 110 },
    { label: 'Q3', charge: 95, discharge: 70, totalHeight: 120 },
    { label: 'Q4', charge: 72, discharge: 52, totalHeight: 92 },
  ],
};

// Generates halftone matrix dots for the background
const HALFTONE_GRID = Array.from({ length: 15 }, (_, row) =>
  Array.from({ length: 15 }, (_, col) => {
    const dx = col - 7;
    const dy = row - 7;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 7) return null;
    const opacity = Math.max(0.08, 0.35 - dist * 0.035);
    return { id: `${row}-${col}`, opacity, x: col * 20, y: row * 20 };
  })
).flat().filter(Boolean);

export const BatterySocScreen: React.FC<BatterySocScreenProps> = ({
  onBack,
  batterySoc = 77,
  batteryTemp = 33.5,
}) => {
  const { horizontalPadding, isSmallScreen, contentWidth } = useResponsive();
  const [activeTab, setActiveTab] = useState<TimeRangeTab>('Week');

  const gaugeSize = 200;
  const strokeWidth = 12;

  // Pure React Native semi-circle rotation calculation (Fabric-Safe)
  const rightRotation = Math.min(180, (batterySoc / 100) * 360);
  const leftRotation = batterySoc > 50 ? ((batterySoc - 50) / 50) * 180 : 0;

  return (
    <View style={styles.root}>
      {/* Background Gradient */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header - Matches Figma Node 2040:1082 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Battery SOC</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Gauge Area - Exact Match to Figma Node 2052:227 */}
          <View style={styles.gaugeArea}>
            {/* Halftone Dot Matrix Pattern */}
            <View style={styles.halftoneContainer} pointerEvents="none">
              {HALFTONE_GRID.map((dot: any) => (
                <View
                  key={dot.id}
                  style={[
                    styles.halftoneDot,
                    {
                      left: dot.x,
                      top: dot.y,
                      opacity: dot.opacity,
                    },
                  ]}
                />
              ))}
            </View>

            {/* Gauge 200px with Blue Drop Shadow */}
            <View style={styles.gaugeWrapper}>
              {/* Background Track Ring */}
              <View style={styles.trackRing} />

              {/* Progress Arc: Right Half (0-180 deg) */}
              <View
                style={[
                  styles.progressArc,
                  {
                    transform: [{ rotate: `${-45 + rightRotation}deg` }],
                  },
                ]}
              />

              {/* Progress Arc: Left Half (>180 deg) */}
              {batterySoc > 50 && (
                <View
                  style={[
                    styles.progressArcSecond,
                    {
                      transform: [{ rotate: `${-45 + leftRotation}deg` }],
                    },
                  ]}
                />
              )}

              {/* Center Display Card */}
              <View style={styles.gaugeCenterCard}>
                <Text style={styles.gaugeValueText}>
                  <Text style={styles.gaugeValueNumber}>{batterySoc}</Text>
                  <Text style={styles.gaugeValuePercent}>%</Text>
                </Text>

                <Text style={styles.gaugeLvlText}>CURRENT LVL</Text>

                <View style={styles.zapWrapper}>
                  <Ionicons name="flash" size={14} color="#0075FF" />
                </View>
              </View>
            </View>
          </View>

          {/* 2. Metrics Row - Matches Figma Node 2052:234 */}
          <View style={styles.metricsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.metricsRow, { paddingHorizontal: horizontalPadding }]}
            >
              {/* Metric 1: Run time */}
              <View style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}>
                <View style={styles.metricHeader}>
                  <Feather name="clock" size={15} color="#555555" />
                  <Text style={styles.metricTitle} numberOfLines={1}>Run time</Text>
                </View>
                <View style={styles.metricBody}>
                  <Text style={styles.metricValue} numberOfLines={1}>1h 07m</Text>
                  <Text style={styles.metricSubtext} numberOfLines={1}>Current session</Text>
                </View>
              </View>

              {/* Metric 2: ETC */}
              <View style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}>
                <View style={styles.metricHeader}>
                  <Feather name="zap" size={15} color="#555555" />
                  <Text style={styles.metricTitle} numberOfLines={1}>ETC</Text>
                </View>
                <View style={styles.metricBody}>
                  <Text style={styles.metricValue} numberOfLines={1}>1h 30m</Text>
                  <Text style={styles.metricSubtext} numberOfLines={1}>Estimated time</Text>
                </View>
              </View>

              {/* Metric 3: Temperature */}
              <View style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}>
                <View style={styles.metricHeader}>
                  <Feather name="thermometer" size={15} color="#555555" />
                  <Text style={styles.metricTitle} numberOfLines={1}>Temperature</Text>
                </View>
                <View style={styles.metricBody}>
                  <Text style={styles.metricValue} numberOfLines={1}>{batteryTemp} °C</Text>
                  <Text style={styles.metricSubtext} numberOfLines={1}>Battery</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* 3. Chart Card: Energy Split - Matches Figma Node 2052:255 */}
          <View style={[styles.chartCard, { marginHorizontal: horizontalPadding }]}>
            <View style={styles.chartHeaderRow}>
              <Text style={styles.chartTitle}>Energy Split</Text>

              {/* Time Range Tabs */}
              <View style={styles.timeTabsContainer}>
                {(['Day', 'Week', 'Month', 'Year'] as TimeRangeTab[]).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={styles.timeTabTouch}
                    onPress={() => setActiveTab(tab)}
                    activeOpacity={0.8}
                  >
                    {activeTab === tab ? (
                      <LinearGradient
                        colors={['#2D3139', '#1A1A1A']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.timeTabItemActive}
                      >
                        <Text style={styles.timeTabTextActive}>{tab}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.timeTabItemInactive}>
                        <Text style={styles.timeTabText}>{tab}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bar Chart Area with High-Fidelity Gradients */}
            <View style={styles.barChartContainer}>
              <View style={styles.barsRow}>
                {CHART_DATA[activeTab].map((item, index) => {
                  const barHeight = item.totalHeight || (item.charge + item.discharge) * 0.9;
                  const chargeHeight = (item.charge / (item.charge + item.discharge)) * barHeight;
                  const dischargeHeight = Math.max(0, barHeight - chargeHeight);

                  return (
                    <View key={index} style={styles.barCol}>
                      {/* Vertical Stacked Bar */}
                      <View style={[styles.barTrack, { height: 120 }]}>
                        <View style={[styles.stackedBar, { height: barHeight }]}>
                          {/* Discharge (Top Segment) with Dark Gradient */}
                          {dischargeHeight > 0 && (
                            <LinearGradient
                              colors={['#374151', '#111827']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={[
                                styles.dischargeSegment,
                                { height: dischargeHeight },
                              ]}
                            />
                          )}

                          {/* Charge (Bottom Segment) with Vibrant Blue Gradient */}
                          {chargeHeight > 0 && (
                            <LinearGradient
                              colors={['#00C6FF', '#0075FF']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 0, y: 1 }}
                              style={[
                                styles.chargeSegment,
                                {
                                  height: chargeHeight,
                                  borderTopLeftRadius: dischargeHeight === 0 ? 6 : 0,
                                  borderTopRightRadius: dischargeHeight === 0 ? 6 : 0,
                                },
                              ]}
                            />
                          )}
                        </View>
                      </View>

                      {/* Day / Label below */}
                      <Text style={styles.dayLabel}>{item.label}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Chart Stats / Legend Row */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <LinearGradient
                    colors={['#00C6FF', '#0075FF']}
                    style={styles.legendDot}
                  />
                  <Text style={styles.legendText}>Charge - 43.5 kWh</Text>
                </View>

                <View style={styles.legendItem}>
                  <LinearGradient
                    colors={['#374151', '#111827']}
                    style={styles.legendDot}
                  />
                  <Text style={styles.legendText}>Discharge - 34.5 kWh</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
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
  },
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  placeholderButton: {
    width: 48,
    height: 48,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Gauge Area (Figma Node 2052:227)
  gaugeArea: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  halftoneContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
  },
  halftoneDot: {
    position: 'absolute',
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#8E9AA8',
  },
  gaugeWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#4D99FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  trackRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderColor: '#E2E8F0',
  },
  progressArc: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderColor: '#0075FF',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  progressArcSecond: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 12,
    borderColor: '#0075FF',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
  gaugeCenterCard: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  gaugeValueText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    textAlign: 'center',
  },
  gaugeValueNumber: {
    fontSize: 33,
    fontWeight: '700',
    color: '#212121',
  },
  gaugeValuePercent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
  },
  gaugeLvlText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0075FF',
    letterSpacing: 0.5,
  },
  zapWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Metrics Row
  metricsContainer: {
    paddingVertical: 8,
  },
  metricsRow: {
    paddingHorizontal: 24,
    gap: 12,
  },
  metricCard: {
    minWidth: 104,
    height: 90,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    padding: 12,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  metricCardSmall: {
    minWidth: 96,
    padding: 10,
    height: 84,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555555',
  },
  metricBody: {
    gap: 2,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  metricSubtext: {
    fontSize: 11,
    color: '#9E9EA0',
  },

  // Chart Card (Figma Node 2052:255)
  chartCard: {
    marginHorizontal: 24,
    marginTop: 14,
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  chartHeaderRow: {
    marginBottom: 20,
    gap: 14,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  timeTabsContainer: {
    height: 32,
    backgroundColor: '#EBEBF0',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
  },
  timeTabTouch: {
    flex: 1,
    height: '100%',
  },
  timeTabItemActive: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  timeTabItemInactive: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  timeTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
  },
  timeTabTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  barChartContainer: {
    gap: 18,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 144,
    paddingBottom: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stackedBar: {
    width: 22,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  dischargeSegment: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  chargeSegment: {
    width: '100%',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9E9EA0',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
  },
});

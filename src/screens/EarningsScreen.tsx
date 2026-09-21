import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';

import { useResponsive } from '../utils/responsive';

type TimeframeType = 'day' | 'week' | 'month';
type ChartModeType = 'earnings' | 'gridEnergy' | 'netGrid' | 'carbon';

interface EarningsScreenProps {
  onBack?: () => void;
  netGridKwh?: number;
  gridExportMwh?: number;
  earningsInr?: number;
  carbonTons?: number;
  buyPrice?: number;
  sellPrice?: number;
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({
  onBack,
  netGridKwh = 2.68,
  gridExportMwh = 0.203,
  earningsInr = 145,
  carbonTons = 12.09,
  buyPrice = 16.5,
  sellPrice = 3.0,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>('week');
  const [chartMode, setChartMode] = useState<ChartModeType>('earnings'); // 'earnings' (2136:2842), 'gridEnergy' (2132:2261), 'netGrid' (2125:1286), 'carbon'
  const [selectedEarningsIndex, setSelectedEarningsIndex] = useState<number>(5); // Sat (₹24) default peak
  const [selectedGridEnergyIndex, setSelectedGridEnergyIndex] = useState<number>(3); // Day 19 default peak
  const [selectedCarbonIndex, setSelectedCarbonIndex] = useState<number>(4); // Bar 5 (1.5 Ton) default peak
  const [selectedNetGridIndex, setSelectedNetGridIndex] = useState<number>(1);

  // 1. Earnings (Figma 2136:2842) golden area data
  const earningsChartData = {
    day: {
      tooltip: '₹6',
      yMax: 25,
      points: [
        { label: '04', val: 3 },
        { label: '08', val: 8 },
        { label: '12', val: 18 },
        { label: '16', val: 22 },
        { label: '20', val: 14 },
        { label: '24', val: 5 },
      ],
    },
    week: {
      tooltip: '₹24',
      yMax: 25,
      points: [
        { label: 'Mon', val: 12 },
        { label: 'Tue', val: 16 },
        { label: 'Wed', val: 19 },
        { label: 'Thu', val: 14 },
        { label: 'Fri', val: 18 },
        { label: 'Sat', val: 24 },
        { label: 'Sun', val: 17 },
      ],
    },
    month: {
      tooltip: '₹185',
      yMax: 250,
      points: [
        { label: 'W1', val: 110 },
        { label: 'W2', val: 145 },
        { label: 'W3', val: 185 },
        { label: 'W4', val: 160 },
        { label: 'W5', val: 120 },
      ],
    },
  };

  // 2. Grid Energy (Figma 2132:2261) continuous curve data
  const gridEnergyData = {
    day: {
      tooltip: '2.4 kWh',
      yMax: 8,
      points: [
        { label: '00', val: 1.2, isForecast: false },
        { label: '06', val: 3.1, isForecast: false },
        { label: '12', val: 6.2, isForecast: false },
        { label: '16', val: 5.4, isForecast: false },
        { label: '20', val: 2.8, isForecast: true },
        { label: '24', val: 1.1, isForecast: true },
      ],
    },
    week: {
      tooltip: '6.9 kWh',
      yMax: 8,
      points: [
        { label: '1', val: 2.2, isForecast: false },
        { label: '7', val: 4.8, isForecast: false },
        { label: '13', val: 5.9, isForecast: false },
        { label: '19', val: 6.9, isForecast: false },
        { label: '25', val: 5.3, isForecast: true },
        { label: '31', val: 3.6, isForecast: true },
      ],
    },
    month: {
      tooltip: '7.8 kWh',
      yMax: 8,
      points: [
        { label: '1', val: 3.0, isForecast: false },
        { label: '7', val: 5.2, isForecast: false },
        { label: '13', val: 6.4, isForecast: false },
        { label: '19', val: 7.8, isForecast: false },
        { label: '25', val: 6.1, isForecast: true },
        { label: '31', val: 4.2, isForecast: true },
      ],
    },
  };

  // 3. Carbon Emission (Figma 2136:3616) 12-bar matrix data
  const carbonEmissionData = {
    day: {
      tooltip: '0.45 Ton',
      yMax: 1.75,
      bars: [
        { label: '02', val: 0.35 },
        { label: '04', val: 0.55 },
        { label: '06', val: 0.8 },
        { label: '08', val: 1.1 },
        { label: '10', val: 1.45 },
        { label: '12', val: 0.8 },
        { label: '14', val: 0.7 },
        { label: '16', val: 0.65 },
        { label: '18', val: 0.8 },
        { label: '20', val: 0.9 },
        { label: '22', val: 0.75 },
        { label: '24', val: 0.78 },
      ],
    },
    week: {
      tooltip: '1.5 Ton',
      yMax: 1.75,
      bars: [
        { label: '1', val: 0.85 },
        { label: '2', val: 1.05 },
        { label: '3', val: 1.20 },
        { label: '4', val: 1.35 },
        { label: '5', val: 1.50 },
        { label: '6', val: 0.80 },
        { label: '7', val: 0.75 },
        { label: '8', val: 0.70 },
        { label: '9', val: 0.85 },
        { label: '10', val: 0.95 },
        { label: '11', val: 0.80 },
        { label: '12', val: 0.82 },
      ],
    },
    month: {
      tooltip: '1.65 Ton',
      yMax: 1.75,
      bars: [
        { label: 'Jan', val: 0.9 },
        { label: 'Feb', val: 1.1 },
        { label: 'Mar', val: 1.25 },
        { label: 'Apr', val: 1.4 },
        { label: 'May', val: 1.65 },
        { label: 'Jun', val: 0.95 },
        { label: 'Jul', val: 0.8 },
        { label: 'Aug', val: 0.75 },
        { label: 'Sep', val: 0.9 },
        { label: 'Oct', val: 1.05 },
        { label: 'Nov', val: 0.85 },
        { label: 'Dec', val: 0.9 },
      ],
    },
  };

  // 4. Net Grid (Figma 2125:1286) data
  const netGridData = {
    day: {
      tooltip: '1.2 kWh',
      bars: [
        { label: '0', exportVal: 0.4, importVal: 0.2 },
        { label: '6', exportVal: 1.2, importVal: 0.1 },
        { label: '12', exportVal: 3.8, importVal: 0.0 },
        { label: '18', exportVal: 1.5, importVal: 0.8 },
        { label: '24', exportVal: 0.2, importVal: 1.6 },
      ],
    },
    week: {
      tooltip: '1 kWh',
      bars: [
        { label: '0', exportVal: 0.6, importVal: 0.4 },
        { label: '6', exportVal: 1.8, importVal: 0.2 },
        { label: '12', exportVal: 4.0, importVal: 0.0 },
        { label: '18', exportVal: 2.1, importVal: 1.1 },
        { label: '24', exportVal: 0.4, importVal: 1.9 },
      ],
    },
    month: {
      tooltip: '3.4 kWh',
      bars: [
        { label: 'W1', exportVal: 2.4, importVal: 0.8 },
        { label: 'W2', exportVal: 3.6, importVal: 0.5 },
        { label: 'W3', exportVal: 4.2, importVal: 0.3 },
        { label: 'W4', exportVal: 3.1, importVal: 1.0 },
        { label: 'W5', exportVal: 1.9, importVal: 1.4 },
      ],
    },
  };

  const currentEarnings = earningsChartData[selectedTimeframe];
  const currentGridEnergy = gridEnergyData[selectedTimeframe];
  const currentCarbon = carbonEmissionData[selectedTimeframe];
  const currentNetGrid = netGridData[selectedTimeframe];

  return (
    <View style={styles.root}>
      {/* 100% Pixel-matched Figma Radial Background Image */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header - Matches Figma Node 2136:2862 / 2132:2281 / 2125:1682 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Earnings</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topSection}>
            {/* Segmented Tabs (Day | Week | Month) - Matches Figma Node 2136:2870 */}
            <View style={styles.tabContainer}>
            <View style={styles.segmentedTabs}>
              {(['day', 'week', 'month'] as TimeframeType[]).map((tab) => {
                const isSelected = selectedTimeframe === tab;
                const tabTitle = tab.charAt(0).toUpperCase() + tab.slice(1);
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tabButton,
                      isSelected && styles.tabButtonActive,
                    ]}
                    onPress={() => setSelectedTimeframe(tab)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.tabButtonText,
                        isSelected && styles.tabButtonTextActive,
                      ]}
                    >
                      {tabTitle}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ================= MAIN CHART CARD ================= */}
          {chartMode === 'earnings' ? (
            /* ================= EARNINGS CHART (Figma Node 2136:2842) ================= */
            <View style={styles.chartCard}>
              {/* Header: Earnings + Money Icon */}
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>EARNINGS</Text>
                <View style={styles.batteryIconBadge}>
                  <Ionicons
                    name="cash-outline"
                    size={22}
                    color="#1A1A1A"
                  />
                </View>
              </View>

              {/* Earnings Matrix & Continuous Golden Area Chart */}
              <View style={styles.earningsChartContainer}>
                {/* Horizontal Guide Lines & Matrix Grid with Y-Axis */}
                <View style={styles.gridLinesContainer}>
                  {[25, 20, 15, 10, 5].map((val, i) => (
                    <View key={val} style={[styles.gridLineRow, { top: i * 52 + 6 }]}>
                      {/* Dotted guideline */}
                      <View style={styles.dottedGuideLine} />
                      <Text style={styles.yAxisEarningsText}>{val}</Text>
                    </View>
                  ))}
                </View>

                {/* Golden Area Wave Columns */}
                <View style={styles.earningsColumnsWrapper}>
                  {currentEarnings.points.map((point, idx) => {
                    const isSelected = idx === selectedEarningsIndex;
                    const pointHeight = (point.val / currentEarnings.yMax) * 210;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.earningsColumn}
                        activeOpacity={0.8}
                        onPress={() => setSelectedEarningsIndex(idx)}
                      >
                        {/* Highlight Point & Golden Tooltip Pill */}
                        {isSelected && (
                          <View
                            style={[
                              styles.earningsHighlightWrapper,
                              { bottom: pointHeight + 2 },
                            ]}
                          >
                            <View style={styles.earningsTooltipPill}>
                              <Text style={styles.earningsTooltipText}>
                                ₹{point.val}
                              </Text>
                            </View>
                            {/* Dashed vertical indicator line */}
                            <View style={styles.amberIndicatorLine} />
                            {/* Glowing Amber Point */}
                            <View style={styles.amberOuterRing}>
                              <View style={styles.amberInnerDot} />
                            </View>
                          </View>
                        )}

                        {/* Column Golden Gradient Pill Fill */}
                        <View style={styles.earningsFillWrapper}>
                          <LinearGradient
                            colors={
                              isSelected
                                ? ['#FFC400', 'rgba(255, 196, 0, 0.45)', 'rgba(255, 196, 0, 0.08)']
                                : ['rgba(255, 196, 0, 0.55)', 'rgba(255, 196, 0, 0.2)', 'transparent']
                            }
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={[
                              styles.earningsBarPill,
                              { height: Math.max(pointHeight, 16) },
                            ]}
                          />
                        </View>

                        {/* X-Axis Day Label (Mon, Tue, Wed, ...) */}
                        <Text
                          style={[
                            styles.earningsXLabel,
                            isSelected && styles.earningsXLabelActive,
                          ]}
                        >
                          {point.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : chartMode === 'carbon' ? (
            /* ================= CARBON EMISSION CHART (Figma Node 2136:3616) ================= */
            <View style={styles.chartCard}>
              {/* Header: Carbon Emission + Leaf Icon */}
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>CARBON EMISSION</Text>
                <View style={styles.batteryIconBadge}>
                  <Ionicons name="leaf-outline" size={24} color="#1A1A1A" />
                </View>
              </View>

              {/* 12-Bar Green Gradient Matrix Display */}
              <View style={styles.carbonChartContainer}>
                {/* Horizontal Guide Lines & Y-Axis (1.75 down to 0.25 Tons) */}
                <View style={styles.gridLinesContainer}>
                  {[1.75, 1.50, 1.25, 1.00, 0.75, 0.50, 0.25].map((val, i) => (
                    <View key={val} style={[styles.gridLineRow, { top: i * 35 + 6 }]}>
                      <View style={styles.dottedGuideLine} />
                      <Text style={styles.yAxisCarbonText}>{val.toFixed(2)}</Text>
                    </View>
                  ))}
                  {/* Baseline solid line */}
                  <View style={styles.carbonBaseline} />
                </View>

                {/* 12 Green Gradient Bars */}
                <View style={styles.carbonBarsWrapper}>
                  {currentCarbon.bars.map((bar, idx) => {
                    const isSelected = idx === selectedCarbonIndex;
                    const barHeight = (bar.val / 1.75) * 210;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.carbonBarColumn}
                        activeOpacity={0.8}
                        onPress={() => setSelectedCarbonIndex(idx)}
                      >
                        {/* Tooltip & Green Indicator Line on selected bar (e.g. Bar 5) */}
                        {isSelected && (
                          <View
                            style={[
                              styles.carbonTooltipWrapper,
                              { bottom: barHeight + 4 },
                            ]}
                          >
                            <View style={styles.carbonTooltipPill}>
                              <Text style={styles.carbonTooltipText}>
                                {bar.val} Ton
                              </Text>
                            </View>
                            <View style={styles.greenIndicatorLine} />
                          </View>
                        )}

                        {/* Bar Gradient Pill */}
                        <View style={styles.carbonFillWrapper}>
                          <LinearGradient
                            colors={
                              isSelected
                                ? ['#49B02D', '#33961B']
                                : ['rgba(73, 176, 45, 0.35)', 'rgba(73, 176, 45, 0.12)']
                            }
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={[
                              styles.carbonBarPill,
                              isSelected && styles.carbonBarPillActive,
                              { height: Math.max(barHeight, 14) },
                            ]}
                          />
                        </View>

                        {/* X-Axis Number/Month Label */}
                        <Text
                          style={[
                            styles.carbonXLabel,
                            isSelected && styles.carbonXLabelActive,
                          ]}
                        >
                          {bar.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : chartMode === 'gridEnergy' ? (
            /* ================= GRID ENERGY CHART (Figma Node 2132:2261) ================= */
            <View style={styles.chartCard}>
              {/* Header: Grid Energy + Transmission Tower Icon */}
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>GRID ENERGY</Text>
                <View style={styles.batteryIconBadge}>
                  <MaterialCommunityIcons
                    name="transmission-tower"
                    size={22}
                    color="#1A1A1A"
                  />
                </View>
              </View>

              {/* Continuous Grid Energy Chart Area */}
              <View style={styles.gridEnergyChartContainer}>
                {/* Horizontal Guide Lines */}
                <View style={styles.gridLinesContainer}>
                  {[8, 6, 4, 2, 0].map((val, i) => (
                    <View key={val} style={[styles.gridLineRow, { top: i * 53 }]}>
                      <View style={[styles.gridLine, val === 0 && styles.gridLineZero]} />
                      <Text style={styles.yAxisText}>{val}</Text>
                    </View>
                  ))}
                  <Text style={styles.unitLabel}>kWh</Text>
                </View>

                {/* Interactive Curve & Gradient Wave Area */}
                <View style={styles.curveAreaWrapper}>
                  {currentGridEnergy.points.map((point, idx) => {
                    const isSelected = idx === selectedGridEnergyIndex;
                    const pointHeight = (point.val / 8.0) * 210;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.curveColumn}
                        activeOpacity={0.8}
                        onPress={() => setSelectedGridEnergyIndex(idx)}
                      >
                        {/* Tooltip & Highlight point on selected node */}
                        {isSelected && (
                          <View
                            style={[
                              styles.curveHighlightWrapper,
                              { bottom: pointHeight + 4 },
                            ]}
                          >
                            <View style={styles.gridEnergyTooltipPill}>
                              <Text style={styles.tooltipText}>
                                {point.val} kWh
                              </Text>
                            </View>
                            {/* Glowing Target Ring */}
                            <View style={styles.outerGlowRing}>
                              <View style={styles.innerGlowDot} />
                            </View>
                          </View>
                        )}

                        {/* Column Gradient Fill */}
                        <View style={styles.areaFillWrapper}>
                          <LinearGradient
                            colors={
                              point.isForecast
                                ? ['rgba(0, 122, 254, 0.25)', 'rgba(96, 165, 250, 0.08)', 'transparent']
                                : isSelected
                                ? ['#007AFE', 'rgba(96, 165, 250, 0.45)', 'rgba(217, 229, 255, 0.1)']
                                : ['rgba(0, 122, 254, 0.55)', 'rgba(96, 165, 250, 0.2)', 'transparent']
                            }
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={[
                              styles.areaBarPill,
                              point.isForecast && styles.forecastBorder,
                              { height: Math.max(pointHeight, 20) },
                            ]}
                          />
                        </View>

                        {/* Forecast indicator */}
                        {point.isForecast && (
                          <View style={styles.forecastTagRow}>
                            <View style={styles.forecastDash} />
                          </View>
                        )}

                        {/* X-Axis Day/Time Label */}
                        <Text
                          style={[
                            styles.gridEnergyXLabel,
                            isSelected && { color: '#007AFE', fontWeight: '700' },
                          ]}
                        >
                          {point.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : (
            /* ================= NET GRID CHART (Figma Node 2125:1286) ================= */
            <View style={styles.chartCard}>
              {/* Header: Net Grid + Battery Icon */}
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>NET GRID</Text>
                <View style={styles.batteryIconBadge}>
                  <MaterialCommunityIcons
                    name="battery-charging-medium"
                    size={22}
                    color="#1A1A1A"
                  />
                </View>
              </View>

              {/* Net Grid Interactive Display */}
              <View style={styles.graphContainer}>
                {/* Tooltip badge */}
                <View style={[styles.tooltipContainer, { left: 88 }]}>
                  <View style={styles.tooltipPill}>
                    <Text style={styles.tooltipText}>{currentNetGrid.tooltip}</Text>
                  </View>
                  <View style={styles.tooltipLine} />
                </View>

                {/* Grid lines and Y-Axis Labels */}
                <View style={styles.gridLinesContainer}>
                  <View style={[styles.gridLineRow, { top: 6 }]}>
                    <View style={styles.gridLine} />
                    <Text style={styles.yAxisText}>Imported</Text>
                  </View>
                  <View style={[styles.gridLineRow, { top: 38 }]}>
                    <View style={styles.gridLine} />
                    <Text style={styles.yAxisText}>4 kW</Text>
                  </View>
                  <View style={[styles.gridLineRow, { top: 74 }]}>
                    <View style={styles.gridLine} />
                    <Text style={styles.yAxisText}>2 kW</Text>
                  </View>
                  <View style={[styles.gridLineRow, { top: 110 }]}>
                    <View style={[styles.gridLine, styles.gridLineZero]} />
                    <Text style={styles.yAxisText}>0 kW</Text>
                  </View>
                  <View style={[styles.gridLineRow, { top: 146 }]}>
                    <View style={styles.gridLine} />
                    <Text style={styles.yAxisText}>2 kW</Text>
                  </View>
                  <View style={[styles.gridLineRow, { top: 182 }]}>
                    <View style={styles.gridLine} />
                    <Text style={styles.yAxisText}>4 kW</Text>
                  </View>
                </View>

                {/* Energy Waves Visual Graphic */}
                <View style={styles.chartVisualArea}>
                  {currentNetGrid.bars.map((item, idx) => {
                    const isSelected = idx === selectedNetGridIndex;
                    const exportHeight = (item.exportVal / 4.0) * 85;
                    const importHeight = (item.importVal / 4.0) * 70;

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={styles.chartColumn}
                        activeOpacity={0.8}
                        onPress={() => setSelectedNetGridIndex(idx)}
                      >
                        {/* Export Bar */}
                        <View style={styles.exportBarWrapper}>
                          <LinearGradient
                            colors={
                              isSelected
                                ? ['#007AFE', '#60A5FA', 'rgba(96,165,250,0.15)']
                                : ['rgba(0,122,254,0.6)', 'rgba(96,165,250,0.3)', 'transparent']
                            }
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={[
                              styles.barPill,
                              { height: Math.max(exportHeight, 16) },
                            ]}
                          />
                        </View>

                        {/* Baseline dot */}
                        <View
                          style={[
                            styles.columnCenterDot,
                            isSelected && styles.columnCenterDotActive,
                          ]}
                        />

                        {/* Import Bar */}
                        <View style={styles.importBarWrapper}>
                          <LinearGradient
                            colors={
                              isSelected
                                ? ['rgba(245,158,11,0.2)', '#F59E0B', '#D97706']
                                : ['transparent', 'rgba(245,158,11,0.3)', 'rgba(245,158,11,0.6)']
                            }
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                            style={[
                              styles.barPill,
                              { height: Math.max(importHeight, 10) },
                            ]}
                          />
                        </View>

                        <Text
                          style={[
                            styles.xAxisLabel,
                            isSelected && styles.xAxisLabelActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Pricing Section (Buy Price & Sell Price) */}
              <View style={styles.pricingRow}>
                <View style={styles.priceItem}>
                  <View style={styles.priceLabelRow}>
                    <View style={[styles.priceDot, { backgroundColor: '#10B981' }]} />
                    <Text style={styles.priceLabel}>Buy Price</Text>
                  </View>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceValue}>₹{buyPrice}</Text>
                    <Text style={styles.priceUnit}>/kWh</Text>
                  </View>
                </View>

                <View style={[styles.priceItem, { alignItems: 'flex-end' }]}>
                  <View style={styles.priceLabelRow}>
                    <View style={[styles.priceDot, { backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.priceLabel}>Sell Price</Text>
                  </View>
                  <View style={styles.priceValueRow}>
                    <Text style={styles.priceValue}>₹{sellPrice}</Text>
                    <Text style={styles.priceUnit}>/kWh</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          </View>

          {/* Category Cards (2x2 Earning & Grid Cards) - Matches Figma Node 2136:4633 */}
          <View style={[styles.categoryCardContainer, { paddingHorizontal: horizontalPadding }]}>
            <View style={[styles.categoryGrid, isSmallScreen && { gap: 10 }]}>
              {/* Row 1 */}
              <View style={[styles.categoryRow, isSmallScreen && { gap: 10 }]}>
                {/* 1. Net Grid */}
                <TouchableOpacity
                  style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}
                  activeOpacity={0.8}
                  onPress={() => setChartMode('netGrid')}
                >
                  <View style={styles.metricTopRow}>
                    <View style={styles.metricIconBox}>
                      <Feather name="zap" size={24} color="#1A1A1A" />
                    </View>
                  </View>
                  <View style={styles.metricTextWrapper}>
                    <Text style={styles.metricLabel} numberOfLines={1}>Net Grid</Text>
                    <Text
                      style={[styles.metricValue, isSmallScreen && styles.metricValueSmall]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {netGridKwh} kWh
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 2. Grid Export / Grid Energy */}
                <TouchableOpacity
                  style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}
                  activeOpacity={0.8}
                  onPress={() => setChartMode('gridEnergy')}
                >
                  <View style={styles.metricTopRow}>
                    <View style={styles.metricIconBox}>
                      <Feather name="power" size={24} color="#1A1A1A" />
                    </View>
                  </View>
                  <View style={styles.metricTextWrapper}>
                    <Text style={styles.metricLabel} numberOfLines={1}>Grid Export</Text>
                    <Text
                      style={[styles.metricValue, isSmallScreen && styles.metricValueSmall]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {gridExportMwh} MWh
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Row 2 */}
              <View style={[styles.categoryRow, isSmallScreen && { gap: 10 }]}>
                {/* 3. Earnings */}
                <TouchableOpacity
                  style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}
                  activeOpacity={0.8}
                  onPress={() => setChartMode('earnings')}
                >
                  <View style={styles.metricTopRow}>
                    <View style={styles.metricIconBox}>
                      <Ionicons name="wallet-outline" size={24} color="#1A1A1A" />
                    </View>
                  </View>
                  <View style={styles.metricTextWrapper}>
                    <Text style={styles.metricLabel} numberOfLines={1}>Earnings</Text>
                    <Text
                      style={[styles.metricValue, isSmallScreen && styles.metricValueSmall]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      ₹{earningsInr}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 4. Carbon */}
                <TouchableOpacity
                  style={[styles.metricCard, isSmallScreen && styles.metricCardSmall]}
                  activeOpacity={0.8}
                  onPress={() => setChartMode('carbon')}
                >
                  <View style={styles.metricTopRow}>
                    <View style={styles.metricIconBox}>
                      <Ionicons name="leaf-outline" size={24} color="#1A1A1A" />
                    </View>
                  </View>
                  <View style={styles.metricTextWrapper}>
                    <Text style={styles.metricLabel} numberOfLines={1}>Carbon</Text>
                    <Text
                      style={[styles.metricValue, isSmallScreen && styles.metricValueSmall]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {carbonTons} Tons
                    </Text>
                  </View>
                </TouchableOpacity>
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
    paddingTop: 12,
    flexGrow: 1,
  },
  topSection: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 24,
  },
  tabContainer: {
    width: '100%',
  },
  segmentedTabs: {
    height: 36,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  tabButton: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: '#1A1A1A',
  },
  chartCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: 18,
    height: 385,
    justifyContent: 'space-between',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#747474',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  batteryIconBadge: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Grid Energy Specific Styles
  gridEnergyChartContainer: {
    height: 295,
    position: 'relative',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  unitLabel: {
    position: 'absolute',
    right: 0,
    bottom: -6,
    fontSize: 9,
    color: 'rgba(36, 51, 86, 0.4)',
    fontWeight: '500',
  },
  curveAreaWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 40,
    height: 250,
    alignItems: 'flex-end',
    zIndex: 5,
  },
  curveColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  curveHighlightWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
  gridEnergyTooltipPill: {
    backgroundColor: '#007AFE',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  outerGlowRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 254, 0.25)',
    borderWidth: 2,
    borderColor: '#007AFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerGlowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  areaFillWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  areaBarPill: {
    width: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  forecastBorder: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 254, 0.4)',
  },
  forecastTagRow: {
    marginTop: 2,
    alignItems: 'center',
  },
  forecastDash: {
    width: 8,
    height: 2,
    backgroundColor: 'rgba(0, 122, 254, 0.3)',
    borderRadius: 1,
  },
  gridEnergyXLabel: {
    fontSize: 10,
    color: 'rgba(36, 51, 86, 0.4)',
    marginTop: 8,
    fontWeight: '500',
  },
  // Net Grid Specific Styles
  graphContainer: {
    height: 235,
    position: 'relative',
    justifyContent: 'center',
    marginVertical: 2,
  },
  tooltipContainer: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  tooltipPill: {
    backgroundColor: '#007AFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tooltipLine: {
    width: 1,
    height: 175,
    backgroundColor: 'rgba(0, 122, 254, 0.35)',
    marginTop: 4,
  },
  gridLinesContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 24,
  },
  gridLineRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gridLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(36, 51, 86, 0.08)',
    marginRight: 10,
  },
  gridLineZero: {
    backgroundColor: 'rgba(36, 51, 86, 0.16)',
  },
  yAxisText: {
    fontSize: 10,
    color: 'rgba(36, 51, 86, 0.45)',
    width: 48,
    textAlign: 'right',
  },
  chartVisualArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 55,
    height: '100%',
    alignItems: 'center',
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  exportBarWrapper: {
    height: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  importBarWrapper: {
    height: 74,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  barPill: {
    width: 16,
    borderRadius: 8,
  },
  columnCenterDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(36, 51, 86, 0.3)',
    marginVertical: 3,
  },
  columnCenterDotActive: {
    backgroundColor: '#007AFE',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  xAxisLabel: {
    fontSize: 11,
    color: 'rgba(36, 51, 86, 0.4)',
    marginTop: 6,
    fontWeight: '500',
  },
  xAxisLabelActive: {
    color: '#007AFE',
    fontWeight: '700',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  priceItem: {
    flex: 1,
  },
  priceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  priceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priceLabel: {
    fontSize: 13,
    color: '#9E9EA0',
    fontWeight: '400',
  },
  priceValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9E9EA0',
  },
  categoryCardContainer: {
    backgroundColor: '#EFF0F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    borderBottomWidth: 0,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 140, // Extends all the way behind & below the floating navigation bar
    flexGrow: 1,
  },
  categoryGrid: {
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    padding: 16,
    gap: 22,
  },
  // Earnings Chart Specific Styles
  earningsChartContainer: {
    height: 295,
    position: 'relative',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  dottedGuideLine: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(36, 51, 86, 0.08)',
    borderStyle: 'dashed',
    marginRight: 12,
  },
  yAxisEarningsText: {
    fontSize: 10,
    color: '#8C8C8C',
    width: 24,
    textAlign: 'right',
  },
  earningsColumnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 32,
    height: 250,
    alignItems: 'flex-end',
    zIndex: 5,
  },
  earningsColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  earningsHighlightWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
  earningsTooltipPill: {
    backgroundColor: '#FFC400',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  earningsTooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  amberIndicatorLine: {
    width: 1,
    height: 18,
    backgroundColor: '#FFC400',
    marginVertical: 2,
  },
  amberOuterRing: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 196, 0, 0.25)',
    borderWidth: 2,
    borderColor: '#FFC400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amberInnerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  earningsFillWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  earningsBarPill: {
    width: 18,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  earningsXLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 8,
    fontWeight: '500',
  },
  earningsXLabelActive: {
    color: '#D97706',
    fontWeight: '700',
  },
  // Carbon Emission Specific Styles
  carbonChartContainer: {
    height: 295,
    position: 'relative',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  yAxisCarbonText: {
    fontSize: 9.5,
    color: '#8C8C8C',
    width: 28,
    textAlign: 'right',
  },
  carbonBaseline: {
    position: 'absolute',
    left: 0,
    right: 32,
    bottom: 0,
    height: 1,
    backgroundColor: 'rgba(36, 51, 86, 0.12)',
  },
  carbonBarsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 34,
    height: 250,
    alignItems: 'flex-end',
    zIndex: 5,
  },
  carbonBarColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
  },
  carbonTooltipWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
  carbonTooltipPill: {
    backgroundColor: '#49B02D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  carbonTooltipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  greenIndicatorLine: {
    width: 1,
    height: 10,
    backgroundColor: '#49B02D',
    marginTop: 2,
  },
  carbonFillWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  carbonBarPill: {
    width: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  carbonBarPillActive: {
    width: 15,
    shadowColor: '#49B02D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  carbonXLabel: {
    fontSize: 9.5,
    color: '#737373',
    marginTop: 8,
    fontWeight: '500',
  },
  carbonXLabelActive: {
    color: '#49B02D',
    fontWeight: '700',
  },
  metricTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  metricIconBox: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  metricCardSmall: {
    padding: 12,
    gap: 16,
  },
  metricTextWrapper: {
    gap: 2,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#747474',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  metricValueSmall: {
    fontSize: 14,
  },
});


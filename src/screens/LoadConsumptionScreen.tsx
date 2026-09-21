import React from 'react';
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
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 10) / 2; // 24px left/right padding, 10px gap

interface ApplianceItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  iconName: string;
  iconType: 'feather' | 'mci' | 'ionicons';
}

const APPLIANCES: ApplianceItem[] = [
  {
    id: '1',
    name: 'Ceiling Fan',
    value: '1.8',
    unit: 'kWh',
    iconName: 'fan',
    iconType: 'mci',
  },
  {
    id: '2',
    name: 'Light / Bulb',
    value: '1.5',
    unit: 'kWh',
    iconName: 'lightbulb-on-outline',
    iconType: 'mci',
  },
  {
    id: '3',
    name: 'Refrigerator',
    value: '0.1',
    unit: 'kWh',
    iconName: 'fridge-outline',
    iconType: 'mci',
  },
  {
    id: '4',
    name: 'TV',
    value: '0.2',
    unit: 'kWh',
    iconName: 'tv',
    iconType: 'feather',
  },
  {
    id: '5',
    name: 'AC (1.5 Ton)',
    value: '4.8',
    unit: 'kWh',
    iconName: 'air-conditioner',
    iconType: 'mci',
  },
  {
    id: '6',
    name: 'Washing Machine',
    value: '0.5',
    unit: 'kWh',
    iconName: 'washing-machine',
    iconType: 'mci',
  },
  {
    id: '7',
    name: 'EV Charger',
    value: '0.8',
    unit: 'kWh',
    iconName: 'car-electric',
    iconType: 'mci',
  },
  {
    id: '8',
    name: 'Wi-Fi Router',
    value: '0.0',
    unit: 'kWh',
    iconName: 'wifi',
    iconType: 'feather',
  },
];

interface LoadConsumptionScreenProps {
  onBack?: () => void;
  loadConsumptionKw?: number;
}

export const LoadConsumptionScreen: React.FC<LoadConsumptionScreenProps> = ({
  onBack,
  loadConsumptionKw = 4.57,
}) => {
  const renderApplianceIcon = (item: ApplianceItem) => {
    if (item.iconType === 'mci') {
      return (
        <MaterialCommunityIcons
          name={item.iconName as any}
          size={16}
          color="#007AFF"
        />
      );
    }
    if (item.iconType === 'ionicons') {
      return (
        <Ionicons
          name={item.iconName as any}
          size={16}
          color="#007AFF"
        />
      );
    }
    return <Feather name={item.iconName as any} size={16} color="#007AFF" />;
  };

  return (
    <View style={styles.root}>
      {/* Figma Radial Background Image */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header - Matches Figma Node 2065:856 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Load Consumption</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Concentric Semi-Circular Arc Gauge - Pure React Native (Fabric-Safe) */}
          <View style={styles.gaugeSection}>
            <View style={styles.gaugeContainer}>
              {/* Outer Arc (Solar - 280px) */}
              <View style={styles.outerArcTrack} />
              <View style={styles.outerArcProgress} />

              {/* Middle Arc (Battery - 220px) */}
              <View style={styles.middleArcTrack} />
              <View style={styles.middleArcProgress} />

              {/* Inner Arc (Grid - 160px) */}
              <View style={styles.innerArcTrack} />
              <View style={styles.innerArcProgress} />

              {/* Center Readout */}
              <View style={styles.gaugeCenterText}>
                <Text style={styles.consumptionValue}>
                  {loadConsumptionKw}
                </Text>
                <Text style={styles.consumptionLabel}>
                  kWh Consumption
                </Text>
              </View>
            </View>

            {/* Source Breakdown Pill - Matches Figma Node 2077:218 */}
            <View style={styles.legendCard}>
              {/* Solar */}
              <View style={styles.legendCol}>
                <Text style={styles.legendLabel}>Solar</Text>
                <Text style={[styles.legendValue, { color: '#F3A92E' }]}>100%</Text>
              </View>

              <View style={styles.legendDivider} />

              {/* Battery */}
              <View style={styles.legendCol}>
                <Text style={styles.legendLabel}>Battery</Text>
                <Text style={[styles.legendValue, { color: '#3BB139' }]}>50%</Text>
              </View>

              <View style={styles.legendDivider} />

              {/* Grid */}
              <View style={styles.legendCol}>
                <Text style={styles.legendLabel}>Grid</Text>
                <Text style={[styles.legendValue, { color: '#8183DE' }]}>25%</Text>
              </View>
            </View>
          </View>

          {/* 2. Appliance Usage Section - Matches Figma Node 2065:1614 */}
          <View style={styles.applianceSection}>
            <Text style={styles.sectionTitle}>Appliance Usage</Text>

            <View style={styles.applianceGrid}>
              {APPLIANCES.map((item) => (
                <View key={item.id} style={styles.applianceCard}>
                  {/* Top Row: Title + Icon Badge */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.applianceName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <View style={styles.iconBadge}>
                      {renderApplianceIcon(item)}
                    </View>
                  </View>

                  {/* Value */}
                  <View style={styles.valueRow}>
                    <Text style={styles.applianceValue}>{item.value}</Text>
                    <Text style={styles.applianceUnit}>{item.unit}</Text>
                  </View>

                  {/* Subtext */}
                  <Text style={styles.energyUsedLabel}>Energy Used</Text>
                </View>
              ))}
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 120, // space for floating bottom tab bar
  },

  // Gauge Section
  gaugeSection: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 16,
  },
  gaugeContainer: {
    width: 290,
    height: 155,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  // Outer Arc (Solar - 280px diameter / 140px height)
  outerArcTrack: {
    position: 'absolute',
    bottom: 0,
    width: 280,
    height: 140,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    borderWidth: 8,
    borderColor: '#E2E2EA',
    borderBottomWidth: 0,
  },
  outerArcProgress: {
    position: 'absolute',
    bottom: 0,
    width: 280,
    height: 140,
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    borderWidth: 8,
    borderColor: '#F3A92E',
    borderBottomWidth: 0,
  },

  // Middle Arc (Battery - 220px diameter / 110px height)
  middleArcTrack: {
    position: 'absolute',
    bottom: 0,
    width: 220,
    height: 110,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 110,
    borderWidth: 8,
    borderColor: '#E2E2EA',
    borderBottomWidth: 0,
  },
  middleArcProgress: {
    position: 'absolute',
    bottom: 0,
    width: 220,
    height: 110,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 0,
    borderWidth: 8,
    borderColor: '#3BB139',
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },

  // Inner Arc (Grid - 160px diameter / 80px height)
  innerArcTrack: {
    position: 'absolute',
    bottom: 0,
    width: 160,
    height: 80,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderWidth: 8,
    borderColor: '#E2E2EA',
    borderBottomWidth: 0,
  },
  innerArcProgress: {
    position: 'absolute',
    bottom: 0,
    width: 160,
    height: 80,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 0,
    borderWidth: 8,
    borderColor: '#8183DE',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },

  gaugeCenterText: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 4,
  },
  consumptionValue: {
    fontSize: 34,
    fontWeight: '700',
    color: '#121726',
    letterSpacing: -0.5,
  },
  consumptionLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8C8C94',
    marginTop: 1,
  },

  // Legend Card
  legendCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  legendCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: '#555555',
  },
  legendValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  legendDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(204, 204, 209, 0.6)',
  },

  // Appliance Usage Section
  applianceSection: {
    marginTop: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  applianceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  applianceCard: {
    width: CARD_WIDTH,
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  applianceName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
    flex: 1,
    marginRight: 4,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#E5F0FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  applianceValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  applianceUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  energyUsedLabel: {
    fontSize: 10,
    fontWeight: '400',
    color: '#99999E',
  },
});

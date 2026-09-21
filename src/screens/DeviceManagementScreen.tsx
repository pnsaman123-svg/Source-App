import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface DeviceItem {
  id: string;
  name: string;
  iconName: string;
  iconType: 'feather' | 'ionicons' | 'mci';
  isEnabled: boolean;
  category: 'critical' | 'non-critical';
}

const INITIAL_DEVICES: DeviceItem[] = [
  // Critical Devices
  {
    id: '1',
    name: 'TV',
    iconName: 'tv',
    iconType: 'feather',
    isEnabled: true,
    category: 'critical',
  },
  {
    id: '2',
    name: 'AC',
    iconName: 'snow-outline',
    iconType: 'ionicons',
    isEnabled: true,
    category: 'critical',
  },
  {
    id: '3',
    name: 'Washing Machine',
    iconName: 'refresh-cw',
    iconType: 'feather',
    isEnabled: false,
    category: 'critical',
  },
  {
    id: '4',
    name: 'EV Charger',
    iconName: 'zap',
    iconType: 'feather',
    isEnabled: false,
    category: 'critical',
  },
  // Non-Critical Devices
  {
    id: '5',
    name: 'Ceiling Fan',
    iconName: 'fan',
    iconType: 'mci',
    isEnabled: true,
    category: 'non-critical',
  },
  {
    id: '6',
    name: 'Refrigerator',
    iconName: 'fridge-outline',
    iconType: 'mci',
    isEnabled: true,
    category: 'non-critical',
  },
  {
    id: '7',
    name: 'Wi-Fi Router',
    iconName: 'wifi',
    iconType: 'feather',
    isEnabled: true,
    category: 'non-critical',
  },
  {
    id: '8',
    name: 'Water Heater',
    iconName: 'water-boiler',
    iconType: 'mci',
    isEnabled: false,
    category: 'non-critical',
  },
];

interface DeviceManagementScreenProps {
  onBack?: () => void;
}

export const DeviceManagementScreen: React.FC<DeviceManagementScreenProps> = ({
  onBack,
}) => {
  const { horizontalPadding, isSmallScreen, contentWidth } = useResponsive();
  const [activeTab, setActiveTab] = useState<'critical' | 'non-critical'>('critical');
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);

  const cardWidth = (contentWidth - 12) / 2;

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === id ? { ...dev, isEnabled: !dev.isEnabled } : dev
      )
    );
  };

  const handleAddDevice = () => {
    Alert.prompt
      ? Alert.prompt(
          'Add New Device',
          'Enter appliance name:',
          (text) => {
            if (text && text.trim()) {
              const newDev: DeviceItem = {
                id: Date.now().toString(),
                name: text.trim(),
                iconName: 'power',
                iconType: 'feather',
                isEnabled: true,
                category: activeTab,
              };
              setDevices((prev) => [...prev, newDev]);
            }
          }
        )
      : Alert.alert('Add Device', 'Scan QR code or search for smart plug device.');
  };

  const currentDevices = devices.filter((d) => d.category === activeTab);

  const renderDeviceIcon = (item: DeviceItem) => {
    const iconColor = '#1D1B20';
    const iconSize = 24;

    if (item.iconType === 'ionicons') {
      return <Ionicons name={item.iconName as any} size={iconSize} color={iconColor} />;
    }
    if (item.iconType === 'mci') {
      return <MaterialCommunityIcons name={item.iconName as any} size={iconSize} color={iconColor} />;
    }
    return <Feather name={item.iconName as any} size={iconSize} color={iconColor} />;
  };

  return (
    <View style={styles.root}>
      {/* 100% Pixel-matched Figma Radial Background Image */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header - Matches Figma Node 2107:863 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Device Management</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Segmented Tab Bar: Critical vs Non Critical - Matches Figma Node 2107:1157 */}
          <View style={styles.tabBarWrapper}>
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'critical' && styles.tabButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setActiveTab('critical')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'critical' && styles.tabButtonTextActive,
                  ]}
                >
                  Critical
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'non-critical' && styles.tabButtonActive,
                ]}
                activeOpacity={0.8}
                onPress={() => setActiveTab('non-critical')}
              >
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === 'non-critical' && styles.tabButtonTextActive,
                  ]}
                >
                  Non Critical
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Device Cards Grid - Matches Figma Node 2116:308 */}
          <View style={[styles.deviceGrid, isSmallScreen && { gap: 10 }]}>
            {currentDevices.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.deviceCard,
                  { width: cardWidth },
                  isSmallScreen && styles.deviceCardSmall,
                ]}
              >
                {/* Top Row: Icon + Custom Switch Toggle */}
                <View style={styles.cardTopRow}>
                  <View style={styles.iconWrapper}>
                    {renderDeviceIcon(item)}
                  </View>

                  {/* Switch Toggle */}
                  <Switch
                    value={item.isEnabled}
                    onValueChange={() => toggleDevice(item.id)}
                    trackColor={{ false: '#E5E5EA', true: '#34C759' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#E5E5EA"
                    style={Platform.OS === 'ios' ? { transform: [{ scale: 0.8 }] } : {}}
                  />
                </View>

                {/* Bottom Row: Device Name */}
                <View style={styles.cardBottomRow}>
                  <Text
                    style={[
                      styles.deviceName,
                      isSmallScreen && styles.deviceNameSmall,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {item.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Add Device CTA Button - Matches Figma Node 2119:307 */}
          <View style={styles.addCtaContainer}>
            <TouchableOpacity
              style={styles.addCtaButton}
              activeOpacity={0.8}
              onPress={handleAddDevice}
            >
              <Text style={styles.addCtaText}>Add +</Text>
            </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1B20',
    letterSpacing: 0.3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 140, // Space for floating bottom tab bar
    gap: 24,
  },

  // Segmented Tab Bar (Figma Node 2107:1157)
  tabBarWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    height: 42,
    padding: 3,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  tabButtonActive: {
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9EA0',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Device Cards Grid (Figma Node 2116:308)
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  deviceCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 124,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  deviceCardSmall: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    minHeight: 110,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottomRow: {
    marginTop: 24,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
  },
  deviceNameSmall: {
    fontSize: 14,
  },

  // Add Device CTA (Figma Node 2119:307)
  addCtaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addCtaButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  addCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

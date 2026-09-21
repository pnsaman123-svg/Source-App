import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface NotificationItemData {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  iconName: string;
  iconType?: 'feather' | 'mci' | 'ionicons';
  iconColor: string;
  badgeBg: string;
  category: 'today' | 'week' | 'earlier';
}

const NOTIFICATIONS: NotificationItemData[] = [
  // Today
  {
    id: '1',
    title: 'Low Battery',
    subtitle: 'Battery level is low',
    time: '5m ago',
    iconName: 'battery',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'today',
  },
  {
    id: '2',
    title: 'System temperature high',
    subtitle: 'Overheating Detected',
    time: '45m ago',
    iconName: 'thermometer',
    iconType: 'feather',
    iconColor: '#FF3B30',
    badgeBg: '#FFE4E4',
    category: 'today',
  },
  {
    id: '3',
    title: 'Grid Failure',
    subtitle: 'Disconnected from the grid',
    time: '45m ago',
    iconName: 'power',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'today',
  },
  {
    id: '4',
    title: 'Switch to Backup power',
    subtitle: 'Activate Backup Mode',
    time: 'Today',
    iconName: 'power',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'today',
  },
  {
    id: '5',
    title: 'Solar Panel Issue',
    subtitle: 'Check the solar panel system',
    time: '1 h ago',
    iconName: 'sun',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'today',
  },
  {
    id: '6',
    title: 'Wi-fi Disconnected',
    subtitle: 'No Active Wi-Fi Connection',
    time: '59m ago',
    iconName: 'wifi-off',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'today',
  },
  {
    id: '7',
    title: 'Cleaning Recommended',
    subtitle: 'Solar output dropped 15% dust detected',
    time: '10m ago',
    iconName: 'sun',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'today',
  },
  {
    id: '8',
    title: 'Optimal Time Window',
    subtitle: 'Low UV index detected, safe to clean now',
    time: '1h ago',
    iconName: 'clock',
    iconType: 'feather',
    iconColor: '#27AE60',
    badgeBg: '#E1F5E1',
    category: 'today',
  },
  {
    id: '9',
    title: 'Efficiency Alert',
    subtitle: 'Panel efficiency at 72%, cleaning advised',
    time: '3h ago',
    iconName: 'trending-up',
    iconType: 'feather',
    iconColor: '#E67E22',
    badgeBg: '#FFF3E0',
    category: 'today',
  },
  {
    id: '10',
    title: 'Fresh Water Low',
    subtitle: 'Tank at 18% refill soon',
    time: '5m ago',
    iconName: 'droplet',
    iconType: 'feather',
    iconColor: '#0288D1',
    badgeBg: '#E3F2FD',
    category: 'today',
  },
  {
    id: '11',
    title: 'Soap Reservoir Low',
    subtitle: 'Soap level at 12% refill required',
    time: '25m ago',
    iconName: 'flask-outline',
    iconType: 'mci',
    iconColor: '#8E24AA',
    badgeBg: '#F3E5F5',
    category: 'today',
  },
  {
    id: '12',
    title: 'Cleaning Completed',
    subtitle: 'Standard mode 28 panels cleaned',
    time: '15m ago',
    iconName: 'check',
    iconType: 'feather',
    iconColor: '#2ECC71',
    badgeBg: '#E8F5E9',
    category: 'today',
  },
  {
    id: '13',
    title: 'Motor Fault Detected',
    subtitle: 'Brush motor stall on Panel Row 3',
    time: '1h ago',
    iconName: 'alert-triangle',
    iconType: 'feather',
    iconColor: '#E74C3C',
    badgeBg: '#FFEBEE',
    category: 'today',
  },
  {
    id: '14',
    title: 'Low Battery',
    subtitle: 'Battery at 12% returning to dock',
    time: '2h ago',
    iconName: 'battery',
    iconType: 'feather',
    iconColor: '#E67E22',
    badgeBg: '#FFF3E0',
    category: 'today',
  },
  {
    id: '15',
    title: 'Maintenance Due',
    subtitle: 'Belt replacement scheduled in 3 days',
    time: 'Today',
    iconName: 'briefcase',
    iconType: 'feather',
    iconColor: '#0288D1',
    badgeBg: '#E3F2FD',
    category: 'today',
  },

  // This Week
  {
    id: '16',
    title: 'Maintenance due',
    subtitle: 'Schedule system maintenance',
    time: 'Yesterday',
    iconName: 'settings',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'week',
  },
  {
    id: '17',
    title: 'System test passed',
    subtitle: 'Diagnostics Clear',
    time: 'Yesterday',
    iconName: 'shield',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'week',
  },
  {
    id: '18',
    title: 'Water Refilled',
    subtitle: 'Fresh water tank filled to 100%',
    time: 'Yesterday',
    iconName: 'check-circle',
    iconType: 'feather',
    iconColor: '#2ECC71',
    badgeBg: '#E8F5E9',
    category: 'week',
  },
  {
    id: '19',
    title: 'Solar Output Peak',
    subtitle: 'Peak generation reached 7.2 kW',
    time: '2 days ago',
    iconName: 'sun',
    iconType: 'feather',
    iconColor: '#F39C12',
    badgeBg: '#FFF3E0',
    category: 'week',
  },
  {
    id: '20',
    title: 'Weekly Energy Report',
    subtitle: 'Generated 45.2 kWh with ₹145 savings',
    time: '3 days ago',
    iconName: 'trending-up',
    iconType: 'feather',
    iconColor: '#27AE60',
    badgeBg: '#E1F5E1',
    category: 'week',
  },

  // Earlier
  {
    id: '21',
    title: 'Firmware Updated',
    subtitle: 'Inverter firmware updated to v2.4.1',
    time: 'Sep 12',
    iconName: 'shield',
    iconType: 'feather',
    iconColor: '#007AFF',
    badgeBg: '#DBE8F5',
    category: 'earlier',
  },
  {
    id: '22',
    title: 'Grid Tariff Change',
    subtitle: 'Summer peak tariff schedule active',
    time: 'Sep 08',
    iconName: 'power',
    iconType: 'feather',
    iconColor: '#E67E22',
    badgeBg: '#FFF3E0',
    category: 'earlier',
  },
  {
    id: '23',
    title: 'Monthly Inverter Check',
    subtitle: 'All DC/AC string voltages nominal',
    time: 'Sep 01',
    iconName: 'check-circle',
    iconType: 'feather',
    iconColor: '#27AE60',
    badgeBg: '#E8F5E9',
    category: 'earlier',
  },
];

type FilterType = 'today' | 'week' | 'earlier';

interface WalletScreenProps {
  onBack?: () => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onBack }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('today');

  const filteredNotifications = NOTIFICATIONS.filter((item) => {
    if (activeFilter === 'today') return item.category === 'today';
    if (activeFilter === 'week') return item.category === 'week';
    return item.category === 'earlier';
  });

  const renderIcon = (item: NotificationItemData) => {
    if (item.iconType === 'mci') {
      return (
        <MaterialCommunityIcons
          name={item.iconName as any}
          size={20}
          color={item.iconColor}
        />
      );
    }
    if (item.iconType === 'ionicons') {
      return (
        <Ionicons
          name={item.iconName as any}
          size={20}
          color={item.iconColor}
        />
      );
    }
    return (
      <Feather
        name={item.iconName as any}
        size={20}
        color={item.iconColor}
      />
    );
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
        {/* Header - Matches Figma Node 2065:2171 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Notifications & Alerts</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        {/* Tab Bar Filter - Matches Figma Node 2090:250 */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeFilter === 'today' && styles.tabItemActive,
              ]}
              onPress={() => setActiveFilter('today')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === 'today' && styles.tabTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeFilter === 'week' && styles.tabItemActive,
              ]}
              onPress={() => setActiveFilter('week')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === 'week' && styles.tabTextActive,
                ]}
              >
                This Week
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeFilter === 'earlier' && styles.tabItemActive,
              ]}
              onPress={() => setActiveFilter('earlier')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  activeFilter === 'earlier' && styles.tabTextActive,
                ]}
              >
                Earlier
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification Feed List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.notificationList}>
            {filteredNotifications.map((item) => (
              <View key={item.id} style={styles.notificationCard}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.badgeBg },
                  ]}
                >
                  {renderIcon(item)}
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>

                <Text style={styles.timestamp}>{item.time}</Text>
              </View>
            ))}
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
  tabBarContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabBar: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  tabItemActive: {
    backgroundColor: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9EA0',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 120, // space for floating bottom tab bar
  },
  notificationList: {
    gap: 8,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: 4,
    paddingTop: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9E9EA0',
    paddingTop: 2,
  },
});

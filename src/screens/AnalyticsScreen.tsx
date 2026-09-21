import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface GeneralSettingsScreenProps {
  onBack?: () => void;
}

export const AnalyticsScreen: React.FC<GeneralSettingsScreenProps> = ({ onBack }) => {
  const settingsItems = [
    {
      title: 'Wi-Fi',
      action: () => Alert.alert('Wi-Fi', 'Connected to: Home_Solar_5G (Signal: Excellent)'),
    },
    {
      title: 'Temperature',
      action: () => Alert.alert('Temperature', 'Inverter Internal Temp: 38.4°C (Normal)'),
    },
    {
      title: 'System Test/Diagnosis',
      action: () => Alert.alert('Diagnosis', 'All solar circuits, MPPT and battery relays healthy.'),
    },
    {
      title: 'Clean Tech Settings',
      action: () => Alert.alert('Clean Tech Settings', 'Solar panel robot cleaner AZ2400X configured.'),
    },
  ];

  return (
    <View style={styles.root}>
      {/* 100% Pixel-matched Figma Radial Background Image */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Fixed Header (Figma node 2107:442) */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack || (() => Alert.alert('Back', 'Navigating to Home'))}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>General Settings</Text>

          {/* Spacer for symmetry */}
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card 1: Device Info Card (Figma node 2107:694) */}
          <View style={styles.card}>
            {/* Device Name Row */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Device Name</Text>
              <Text style={styles.infoValue}>SolarMax 5000</Text>
            </View>

            <View style={styles.divider} />

            {/* Serial Number Row */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serial Number</Text>
              <Text style={styles.infoValue}>SM-2025-AX7R-4821</Text>
            </View>
          </View>

          {/* Card 2: Settings Menu Card (Figma node 2107:1004) */}
          <View style={styles.card}>
            {settingsItems.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuLabel}>{item.title}</Text>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {index < settingsItems.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
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
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header (Figma node 2107:442)
  header: {
    height: 65,
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1B20',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
    height: 48,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 160,
    gap: 24,
  },

  // Settings Cards (Figma node 2107:694 & 2107:1004)
  card: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },

  // Info Rows (Device Name / Serial Number)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1A1A1A',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },

  // Menu Rows
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1A1A1A',
  },

  divider: {
    height: 1,
    backgroundColor: '#EBEBF0',
    width: '100%',
  },
});

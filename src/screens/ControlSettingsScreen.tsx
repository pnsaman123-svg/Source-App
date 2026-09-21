import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface ControlSettingsScreenProps {
  onBack?: () => void;
  onNavigateToGeneralSettings?: () => void;
  onNavigateToInverterMode?: () => void;
  onNavigateToFirmware?: () => void;
  onNavigateToDeviceManagement?: () => void;
}

export const ControlSettingsScreen: React.FC<ControlSettingsScreenProps> = ({
  onBack,
  onNavigateToGeneralSettings,
  onNavigateToInverterMode,
  onNavigateToFirmware,
  onNavigateToDeviceManagement,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();

  return (
    <View style={styles.root}>
      {/* Background Gradient */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header - Matches Figma Node 2065:3319 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Control & Settings</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        {/* Content Container */}
        <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
          {/* Row 1 */}
          <View style={[styles.cardsRow, isSmallScreen && { gap: 10 }]}>
            {/* Card 1: General Settings */}
            <TouchableOpacity
              style={[styles.card, isSmallScreen && styles.cardSmall]}
              activeOpacity={0.8}
              onPress={onNavigateToGeneralSettings}
            >
              <View style={styles.iconContainer}>
                <Feather name="sliders" size={24} color="#1D1B20" />
              </View>
              <Text style={styles.cardTitle}>General{'\n'}Settings</Text>
            </TouchableOpacity>

            {/* Card 2: Inverter Mode */}
            <TouchableOpacity
              style={[styles.card, isSmallScreen && styles.cardSmall]}
              activeOpacity={0.8}
              onPress={onNavigateToInverterMode}
            >
              <View style={styles.iconContainer}>
                <Feather name="layers" size={24} color="#1D1B20" />
              </View>
              <Text style={styles.cardTitle}>Inverter{'\n'}Mode</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={[styles.cardsRow, isSmallScreen && { gap: 10 }]}>
            {/* Card 3: Firmware */}
            <TouchableOpacity
              style={[styles.card, isSmallScreen && styles.cardSmall]}
              activeOpacity={0.8}
              onPress={onNavigateToFirmware}
            >
              <View style={styles.iconContainer}>
                <Feather name="cpu" size={24} color="#1D1B20" />
              </View>
              <Text style={styles.cardTitle}>Firmware</Text>
            </TouchableOpacity>

            {/* Card 4: Device Management */}
            <TouchableOpacity
              style={[styles.card, isSmallScreen && styles.cardSmall]}
              activeOpacity={0.8}
              onPress={onNavigateToDeviceManagement}
            >
              <View style={styles.iconContainer}>
                <Feather name="smartphone" size={24} color="#1D1B20" />
              </View>
              <Text style={styles.cardTitle}>Device{'\n'}Management</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    height: 140,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardSmall: {
    padding: 12,
    height: 128,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1B20',
    lineHeight: 20,
  },
});

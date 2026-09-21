import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ControlSettingsScreen } from './src/screens/ControlSettingsScreen';
import { BatterySocScreen } from './src/screens/BatterySocScreen';
import { SourceMonitoringScreen } from './src/screens/SourceMonitoringScreen';
import { LoadConsumptionScreen } from './src/screens/LoadConsumptionScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { TabType } from './src/types/energy';
import { Colors } from './src/theme/colors';

type ServiceSubScreen = 'menu' | 'general' | 'inverter' | 'firmware' | 'device';
type HomeSubScreen = 'main' | 'batterySoc' | 'sourceMonitoring' | 'loadConsumption';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [serviceSubScreen, setServiceSubScreen] = useState<ServiceSubScreen>('menu');
  const [homeSubScreen, setHomeSubScreen] = useState<HomeSubScreen>('main');

  const handleOpenSettings = () => {
    setServiceSubScreen('menu');
    setActiveTab('service');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        if (homeSubScreen === 'batterySoc') {
          return (
            <BatterySocScreen
              onBack={() => setHomeSubScreen('main')}
              batterySoc={77}
              batteryTemp={33.5}
            />
          );
        }
        if (homeSubScreen === 'sourceMonitoring') {
          return (
            <SourceMonitoringScreen
              onBack={() => setHomeSubScreen('main')}
              solarKw={6.5}
              batterySoc={77}
              gridKw={-1}
              loadKw={4.5}
            />
          );
        }
        if (homeSubScreen === 'loadConsumption') {
          return (
            <LoadConsumptionScreen
              onBack={() => setHomeSubScreen('main')}
              loadConsumptionKw={4.57}
            />
          );
        }
        return (
          <HomeScreen
            onPressNotifications={() => setActiveTab('savings')}
            onPressSettings={handleOpenSettings}
            onPressBatterySoc={() => setHomeSubScreen('batterySoc')}
            onPressSourceMonitoring={() => setHomeSubScreen('sourceMonitoring')}
            onPressLoadConsumption={() => setHomeSubScreen('loadConsumption')}
          />
        );
      case 'savings':
        return <WalletScreen onBack={() => setActiveTab('home')} />;
      case 'service':
        if (serviceSubScreen === 'general') {
          return <AnalyticsScreen onBack={() => setServiceSubScreen('menu')} />;
        }
        return (
          <ControlSettingsScreen
            onBack={() => setActiveTab('home')}
            onNavigateToGeneralSettings={() => setServiceSubScreen('general')}
            onNavigateToInverterMode={() =>
              Alert.alert('Inverter Mode', 'Solar inverter mode is set to Auto-Hybrid.')
            }
            onNavigateToFirmware={() =>
              Alert.alert('Firmware & Software', 'Your inverter firmware is up to date (v2.4.1).')
            }
            onNavigateToDeviceManagement={() =>
              Alert.alert('Device Management', '1 Inverter, 1 Battery Pack, 1 Clean Tech Robot connected.')
            }
          />
        );
      case 'profile':
        return <ProfileScreen onBack={() => setActiveTab('home')} />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" translucent backgroundColor="transparent" />

        {/* Active Screen View */}
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* Floating Dark Bottom Navigation Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'home') {
              setHomeSubScreen('main');
            } else if (tab === 'service') {
              setServiceSubScreen('menu');
            }
            setActiveTab(tab);
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});

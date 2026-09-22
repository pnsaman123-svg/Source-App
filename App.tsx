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
import { EarningsScreen } from './src/screens/EarningsScreen';
import { DeviceManagementScreen } from './src/screens/DeviceManagementScreen';
import { StartupSplashScreen } from './src/screens/StartupSplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { ConfirmLocationScreen } from './src/screens/ConfirmLocationScreen';
import { BottomTabBar } from './src/components/BottomTabBar';
import { TabType } from './src/types/energy';
import { Colors } from './src/theme/colors';

type AuthStep = 'login' | 'location' | 'authenticated';
type ServiceSubScreen = 'menu' | 'general' | 'inverter' | 'firmware' | 'device';
type HomeSubScreen =
  | 'main'
  | 'batterySoc'
  | 'sourceMonitoring'
  | 'loadConsumption'
  | 'earnings'
  | 'notifications';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [serviceSubScreen, setServiceSubScreen] = useState<ServiceSubScreen>('menu');
  const [homeSubScreen, setHomeSubScreen] = useState<HomeSubScreen>('main');

  const handleOpenSettings = () => {
    setServiceSubScreen('menu');
    setActiveTab('service');
  };

  const renderActiveScreen = () => {
    // 1. Show Login Screen if on login step
    if (authStep === 'login') {
      return <LoginScreen onLoginSuccess={() => setAuthStep('location')} />;
    }

    // 2. Show Confirm Location Screen after sign in
    if (authStep === 'location') {
      return (
        <ConfirmLocationScreen
          onConfirm={() => setAuthStep('authenticated')}
          onBack={() => setAuthStep('login')}
        />
      );
    }

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
        if (homeSubScreen === 'earnings') {
          return (
            <EarningsScreen
              onBack={() => setHomeSubScreen('main')}
              netGridKwh={2.68}
              gridExportMwh={0.203}
              earningsInr={145}
              carbonTons={12.09}
              buyPrice={16.5}
              sellPrice={3.0}
            />
          );
        }
        if (homeSubScreen === 'notifications') {
          return <WalletScreen onBack={() => setHomeSubScreen('main')} />;
        }
        return (
          <HomeScreen
            onPressNotifications={() => setHomeSubScreen('notifications')}
            onPressSettings={handleOpenSettings}
            onPressBatterySoc={() => setHomeSubScreen('batterySoc')}
            onPressSourceMonitoring={() => setHomeSubScreen('sourceMonitoring')}
            onPressLoadConsumption={() => setHomeSubScreen('loadConsumption')}
            onPressEarnings={() => setHomeSubScreen('earnings')}
          />
        );
      case 'savings':
        return (
          <EarningsScreen
            onBack={() => setActiveTab('home')}
            netGridKwh={2.68}
            gridExportMwh={0.203}
            earningsInr={145}
            carbonTons={12.09}
            buyPrice={16.5}
            sellPrice={3.0}
          />
        );
      case 'service':
        if (serviceSubScreen === 'general') {
          return <AnalyticsScreen onBack={() => setServiceSubScreen('menu')} />;
        }
        if (serviceSubScreen === 'device') {
          return <DeviceManagementScreen onBack={() => setServiceSubScreen('menu')} />;
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
            onNavigateToDeviceManagement={() => setServiceSubScreen('device')}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            onBack={() => setActiveTab('home')}
            onLogOut={() => {
              setAuthStep('login');
              setActiveTab('home');
              setHomeSubScreen('main');
            }}
          />
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Active Screen View */}
        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        {/* Floating Dark Bottom Navigation Bar */}
        {authStep === 'authenticated' && !showSplash && (
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
        )}

        {/* Startup Splash Animation Overlay */}
        {showSplash && (
          <StartupSplashScreen onFinish={() => setShowSplash(false)} />
        )}
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

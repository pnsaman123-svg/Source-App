import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

interface WifiNetwork {
  id: string;
  ssid: string;
  isLocked: boolean;
  signalStrength: 'Strong' | 'Medium' | 'Weak';
}

interface WifiSetupScreenProps {
  onSelectNetwork: (ssid: string) => void;
  onBack?: () => void;
  onSkip?: () => void;
}

const DEFAULT_NETWORKS: WifiNetwork[] = [
  { id: '1', ssid: 'Home_WiFi', isLocked: true, signalStrength: 'Strong' },
  { id: '2', ssid: 'AMEC_Home', isLocked: true, signalStrength: 'Medium' },
  { id: '3', ssid: 'MyNetwork_5G', isLocked: false, signalStrength: 'Weak' },
  { id: '4', ssid: 'Solar_Gateway_AP', isLocked: true, signalStrength: 'Strong' },
];

export const WifiSetupScreen: React.FC<WifiSetupScreenProps> = ({
  onSelectNetwork,
  onBack,
  onSkip,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNetworkPress = (net: WifiNetwork) => {
    setSelectedNetwork(net);
    if (net.isLocked) {
      setPassword('');
      setShowPasswordModal(true);
    } else {
      // Connect directly
      onSelectNetwork(net.ssid);
    }
  };

  const handleConnect = () => {
    if (!selectedNetwork) return;
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowPasswordModal(false);
      onSelectNetwork(selectedNetwork.ssid);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        {onSkip && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Introduction */}
        <View style={styles.introSection}>
          <Text style={[styles.title, isSmallScreen && { fontSize: 26, lineHeight: 32 }]}>
            Connect to Wi-Fi
          </Text>
          <Text style={styles.subtitle}>
            Connect your inverter to your home Wi-Fi network to enable monitoring.
          </Text>
        </View>

        {/* Available Networks Section */}
        <View style={styles.listSection}>
          <Text style={styles.sectionHeader}>AVAILABLE NETWORKS</Text>

          <View style={styles.networksCard}>
            {DEFAULT_NETWORKS.map((network, index) => {
              const isLast = index === DEFAULT_NETWORKS.length - 1;
              return (
                <TouchableOpacity
                  key={network.id}
                  style={[styles.networkRow, !isLast && styles.networkRowBorder]}
                  onPress={() => handleNetworkPress(network)}
                  activeOpacity={0.7}
                >
                  <View style={styles.networkLeft}>
                    <View style={styles.wifiIconWrapper}>
                      <Ionicons name="wifi" size={20} color="#1A1A1A" />
                    </View>
                    <Text style={styles.ssidText}>{network.ssid}</Text>
                  </View>

                  <View style={styles.networkRight}>
                    {network.isLocked && (
                      <Ionicons name="lock-closed" size={16} color="#6B7280" style={styles.lockIcon} />
                    )}
                    <Text style={styles.strengthText}>{network.signalStrength}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Manual Add Network Hint */}
        <TouchableOpacity
          style={styles.addNetworkButton}
          onPress={() => {
            setSelectedNetwork({
              id: 'manual',
              ssid: 'Other Network',
              isLocked: true,
              signalStrength: 'Strong',
            });
            setShowPasswordModal(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={20} color="#1A1A1A" />
          <Text style={styles.addNetworkText}>Join other network...</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Enter Wi-Fi Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <Text style={styles.modalSubtitle}>
              Connect to <Text style={styles.boldSsid}>{selectedNetwork?.ssid}</Text>
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Wi-Fi Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPasswordModal(false)}
                activeOpacity={0.7}
                disabled={isConnecting}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalConnectButton, isConnecting && { opacity: 0.8 }]}
                onPress={handleConnect}
                activeOpacity={0.85}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalConnectText}>Connect</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8E8ED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 12,
    paddingBottom: 40,
  },
  introSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#747474',
    fontWeight: '400',
  },
  listSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.6,
    marginBottom: 12,
    paddingLeft: 4,
  },
  networksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
  },
  networkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  networkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  wifiIconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ssidText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  networkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockIcon: {
    marginRight: 2,
  },
  strengthText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  addNetworkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  addNetworkText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#747474',
    marginBottom: 20,
  },
  boldSsid: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  eyeIcon: {
    padding: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalConnectButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConnectText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

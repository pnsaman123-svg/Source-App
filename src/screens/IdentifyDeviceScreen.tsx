import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface IdentifyDeviceScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export const IdentifyDeviceScreen: React.FC<IdentifyDeviceScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const { isSmallScreen, horizontalPadding } = useResponsive();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'qr' | 'manual'>('qr');
  const [deviceId, setDeviceId] = useState<string>('SRC-INV-89240');
  const [isPairing, setIsPairing] = useState<boolean>(false);

  const handleScanQr = () => {
    setModalMode('qr');
    setModalVisible(true);
    // Simulate camera QR scanner discovery
    setTimeout(() => {
      setIsPairing(true);
      setTimeout(() => {
        setIsPairing(false);
        setModalVisible(false);
        onComplete();
      }, 900);
    }, 1200);
  };

  const handleManualId = () => {
    setModalMode('manual');
    setModalVisible(true);
  };

  const handleManualSubmit = () => {
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      setModalVisible(false);
      onComplete();
    }, 800);
  };

  return (
    <View style={styles.root}>
      {/* Upper Section: Dark Studio Inverter Hardware Display */}
      <Image
        source={require('../../assets/images/identify-device-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header Back Button */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom Sheet Card Matching Figma Node 2273:9742 */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle Indicator */}
        <View style={styles.dragHandle} />

        <View style={styles.contentContainer}>
          <Text style={[styles.title, isSmallScreen && { fontSize: 20 }]}>
            Identify your device
          </Text>

          <Text style={styles.subtitle}>
            Scan the QR code on your inverter or enter the device ID manually.
          </Text>

          {/* 2 Action Buttons Row */}
          <View style={styles.actionRow}>
            {/* Scan QR Code Card */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleScanQr}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Feather name="camera" size={24} color="#1A1A1A" />
              </View>
              <Text style={styles.actionLabel}>Scan QR Code</Text>
            </TouchableOpacity>

            {/* Enter Device ID Card */}
            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleManualId}
              activeOpacity={0.8}
            >
              <View style={styles.iconCircle}>
                <Feather name="edit-2" size={24} color="#1A1A1A" />
              </View>
              <Text style={styles.actionLabel}>Enter Device ID</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Interactive QR / Manual Entry Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {modalMode === 'qr' ? (
              <View style={styles.qrModalContent}>
                <View style={styles.qrFrame}>
                  {isPairing ? (
                    <View style={styles.pairingContainer}>
                      <ActivityIndicator size="large" color="#34C759" />
                      <Text style={styles.pairingText}>Connecting to Inverter...</Text>
                    </View>
                  ) : (
                    <View style={styles.scannerViewport}>
                      <Ionicons name="qr-code-outline" size={100} color="#1A1A1A" />
                      <View style={styles.scannerLaser} />
                      <Text style={styles.scannerStatus}>Align QR code within frame</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.manualModalContent}>
                <Text style={styles.modalTitle}>Enter Device ID</Text>
                <Text style={styles.modalSubtitle}>
                  Located on the serial barcode sticker of your SOURCE unit.
                </Text>

                <TextInput
                  style={styles.manualInput}
                  value={deviceId}
                  onChangeText={setDeviceId}
                  placeholder="e.g. SRC-INV-89240"
                  placeholderTextColor="#9E9EA0"
                  autoCapitalize="characters"
                />

                <TouchableOpacity
                  style={styles.modalSubmitButton}
                  onPress={handleManualSubmit}
                  activeOpacity={0.85}
                  disabled={isPairing}
                >
                  {isPairing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.modalSubmitText}>Connect Device</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalCancelLink}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelLinkText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  safeArea: {
    zIndex: 10,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 20,
  },
  contentContainer: {
    width: '100%',
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 21,
    color: '#737373',
    fontWeight: '400',
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  actionCard: {
    flex: 1,
    height: 104,
    backgroundColor: '#F5F5F7',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  iconCircle: {
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  qrModalContent: {
    width: '100%',
    alignItems: 'center',
  },
  qrFrame: {
    width: 220,
    height: 220,
    borderRadius: 20,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#1A1A1A',
  },
  scannerViewport: {
    alignItems: 'center',
  },
  scannerLaser: {
    width: 160,
    height: 2,
    backgroundColor: '#34C759',
    marginVertical: 10,
  },
  scannerStatus: {
    fontSize: 12,
    color: '#737373',
    fontWeight: '500',
  },
  pairingContainer: {
    alignItems: 'center',
  },
  pairingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCloseText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  manualModalContent: {
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#737373',
    textAlign: 'center',
    marginBottom: 20,
  },
  manualInput: {
    backgroundColor: '#F5F5F7',
    height: 56,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSubmitButton: {
    backgroundColor: '#1A1A1A',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalCancelLink: {
    alignSelf: 'center',
    padding: 6,
  },
  modalCancelLinkText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
  },
});

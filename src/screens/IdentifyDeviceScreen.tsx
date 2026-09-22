import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IdentifyDeviceScreenProps {
  onConfirm: () => void;
  onBack?: () => void;
}

export const IdentifyDeviceScreen: React.FC<IdentifyDeviceScreenProps> = ({
  onConfirm,
  onBack,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();
  const [showManualModal, setShowManualModal] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  const handleScanQR = () => {
    // Simulated quick scan
    Alert.alert(
      'QR Code Detected',
      'Successfully connected to SOURCE Inverter (LG AZ2400X).',
      [
        {
          text: 'Continue',
          onPress: onConfirm,
        },
      ]
    );
  };

  const handleManualSubmit = () => {
    if (!deviceId.trim()) {
      Alert.alert('Device ID Required', 'Please enter your SOURCE Inverter serial or device ID.');
      return;
    }
    setShowManualModal(false);
    Alert.alert(
      'Device Paired',
      `Successfully connected to Inverter (${deviceId.trim()}).`,
      [
        {
          text: 'Continue',
          onPress: onConfirm,
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* 3D Wall-Mounted Inverter Background Image */}
      <Image
        source={require('../../assets/images/inverter-identify-bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Header with Back Navigation */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}

          {/* Quick Skip to Home button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onConfirm}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer to push card to bottom */}
        <View style={styles.flexSpacer} />

        {/* Bottom Sheet Card Matching Figma Node 2287:8736 */}
        <View style={styles.cardContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header Typography */}
          <View style={styles.textGroup}>
            <Text style={[styles.title, isSmallScreen && { fontSize: 22, lineHeight: 28 }]}>
              Identify your device
            </Text>
            <Text style={[styles.subtitle, isSmallScreen && { fontSize: 13.5, lineHeight: 19 }]}>
              Scan the QR code on your inverter or enter the device ID manually.
            </Text>
          </View>

          {/* Action Options Row */}
          <View style={styles.optionsRow}>
            {/* Option 1: Scan QR Code */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={handleScanQR}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="camera" size={24} color="#1A1A1A" />
              </View>
              <Text style={styles.optionLabel}>Scan QR Code</Text>
            </TouchableOpacity>

            {/* Option 2: Enter Device ID */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setShowManualModal(true)}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="pencil" size={22} color="#1A1A1A" />
              </View>
              <Text style={styles.optionLabel}>Enter Device ID</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Manual Device ID Modal */}
      <Modal
        visible={showManualModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowManualModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Device ID</Text>
            <Text style={styles.modalSubtitle}>
              Find the 10-digit serial number on the bottom side of your inverter unit.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. SRC-8849-LG"
              placeholderTextColor="#9CA3AF"
              value={deviceId}
              onChangeText={setDeviceId}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowManualModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleManualSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
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
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flexSpacer: {
    flex: 1,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 100,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    marginBottom: 20,
  },
  textGroup: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#747474',
    fontWeight: '400',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ECECEF',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#747474',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#747474',
    lineHeight: 20,
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  submitButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

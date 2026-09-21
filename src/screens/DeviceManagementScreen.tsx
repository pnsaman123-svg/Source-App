import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Platform,
  Modal,
  TextInput,
  Animated,
  Easing,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface DeviceItem {
  id: string;
  name: string;
  iconName: string;
  iconType: 'feather' | 'ionicons' | 'mci';
  isEnabled: boolean;
  category: 'critical' | 'non-critical';
  room?: string;
}

interface PresetType {
  id: string;
  name: string;
  iconName: string;
  iconType: 'feather' | 'ionicons' | 'mci';
  defaultCategory: 'critical' | 'non-critical';
  description: string;
}

const PRESET_TYPES: PresetType[] = [
  {
    id: 'tv',
    name: 'Smart TV / Display',
    iconName: 'tv',
    iconType: 'feather',
    defaultCategory: 'critical',
    description: 'Living room entertainment & screens',
  },
  {
    id: 'ac',
    name: 'Air Conditioner',
    iconName: 'snow-outline',
    iconType: 'ionicons',
    defaultCategory: 'critical',
    description: 'Inverter AC & HVAC cooling',
  },
  {
    id: 'ev',
    name: 'EV Charger / Wallbox',
    iconName: 'zap',
    iconType: 'feather',
    defaultCategory: 'critical',
    description: 'Electric vehicle charging station',
  },
  {
    id: 'washing',
    name: 'Washing Machine',
    iconName: 'refresh-cw',
    iconType: 'feather',
    defaultCategory: 'critical',
    description: 'Smart laundry appliances',
  },
  {
    id: 'fridge',
    name: 'Refrigerator',
    iconName: 'fridge-outline',
    iconType: 'mci',
    defaultCategory: 'non-critical',
    description: 'Continuous cold storage',
  },
  {
    id: 'fan',
    name: 'Ceiling Fan',
    iconName: 'fan',
    iconType: 'mci',
    defaultCategory: 'non-critical',
    description: 'BLDC / Smart fans',
  },
  {
    id: 'heater',
    name: 'Water Heater / Geyser',
    iconName: 'water-boiler',
    iconType: 'mci',
    defaultCategory: 'non-critical',
    description: 'High wattage heating element',
  },
  {
    id: 'custom',
    name: 'Smart Socket / Plug',
    iconName: 'power',
    iconType: 'feather',
    defaultCategory: 'non-critical',
    description: 'Universal 16A energy monitor plug',
  },
];

const ROOM_OPTIONS = ['Living Room', 'Master Bed', 'Kitchen', 'Garage', 'Balcony'];

const INITIAL_DEVICES: DeviceItem[] = [
  // Critical Devices
  {
    id: '1',
    name: 'TV',
    iconName: 'tv',
    iconType: 'feather',
    isEnabled: true,
    category: 'critical',
    room: 'Living Room',
  },
  {
    id: '2',
    name: 'AC',
    iconName: 'snow-outline',
    iconType: 'ionicons',
    isEnabled: true,
    category: 'critical',
    room: 'Master Bed',
  },
  {
    id: '3',
    name: 'Washing Machine',
    iconName: 'refresh-cw',
    iconType: 'feather',
    isEnabled: false,
    category: 'critical',
    room: 'Utility',
  },
  {
    id: '4',
    name: 'EV Charger',
    iconName: 'zap',
    iconType: 'feather',
    isEnabled: false,
    category: 'critical',
    room: 'Garage',
  },
  // Non-Critical Devices
  {
    id: '5',
    name: 'Ceiling Fan',
    iconName: 'fan',
    iconType: 'mci',
    isEnabled: true,
    category: 'non-critical',
    room: 'Living Room',
  },
  {
    id: '6',
    name: 'Refrigerator',
    iconName: 'fridge-outline',
    iconType: 'mci',
    isEnabled: true,
    category: 'non-critical',
    room: 'Kitchen',
  },
  {
    id: '7',
    name: 'Wi-Fi Router',
    iconName: 'wifi',
    iconType: 'feather',
    isEnabled: true,
    category: 'non-critical',
    room: 'Living Room',
  },
  {
    id: '8',
    name: 'Water Heater',
    iconName: 'water-boiler',
    iconType: 'mci',
    isEnabled: false,
    category: 'non-critical',
    room: 'Master Bed',
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

  // Add Device Modal Flow States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'select' | 'configure' | 'pairing' | 'success'>('select');
  const [selectedPreset, setSelectedPreset] = useState<PresetType>(PRESET_TYPES[0]);
  const [deviceNameInput, setDeviceNameInput] = useState('');
  const [deviceCategoryInput, setDeviceCategoryInput] = useState<'critical' | 'non-critical'>('critical');
  const [selectedRoom, setSelectedRoom] = useState(ROOM_OPTIONS[0]);

  // Animation values for scanner & success
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const cardWidth = (contentWidth - 12) / 2;

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((dev) =>
        dev.id === id ? { ...dev, isEnabled: !dev.isEnabled } : dev
      )
    );
  };

  const openAddFlow = () => {
    setModalStep('select');
    setSelectedPreset(PRESET_TYPES[0]);
    setDeviceNameInput('');
    setDeviceCategoryInput(activeTab);
    setSelectedRoom(ROOM_OPTIONS[0]);
    setIsAddModalOpen(true);
  };

  const handleSelectPreset = (preset: PresetType) => {
    setSelectedPreset(preset);
    setDeviceNameInput(preset.name.split(' / ')[0]);
    setDeviceCategoryInput(preset.defaultCategory);
    setModalStep('configure');
  };

  const startPairingFlow = () => {
    setModalStep('pairing');

    // Pulse animation for radar scanning
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 700,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Auto-progress to success after simulated Bluetooth/Wi-Fi pairing
    setTimeout(() => {
      setModalStep('success');
    }, 1800);
  };

  const finalizeAddDevice = () => {
    const newDevice: DeviceItem = {
      id: Date.now().toString(),
      name: deviceNameInput.trim() || selectedPreset.name,
      iconName: selectedPreset.iconName,
      iconType: selectedPreset.iconType,
      isEnabled: true,
      category: deviceCategoryInput,
      room: selectedRoom,
    };

    setDevices((prev) => [newDevice, ...prev]);
    setActiveTab(deviceCategoryInput);
    setIsAddModalOpen(false);
  };

  const currentDevices = devices.filter((d) => d.category === activeTab);

  const renderDeviceIcon = (
    iconName: string,
    iconType: 'feather' | 'ionicons' | 'mci',
    size = 24,
    color = '#1D1B20'
  ) => {
    if (iconType === 'ionicons') {
      return <Ionicons name={iconName as any} size={size} color={color} />;
    }
    if (iconType === 'mci') {
      return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
    }
    return <Feather name={iconName as any} size={size} color={color} />;
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
                    {renderDeviceIcon(item.iconName, item.iconType)}
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

                {/* Bottom Row: Device Name & Room Badge */}
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
                  {item.room && (
                    <Text style={styles.deviceRoomText} numberOfLines={1}>
                      {item.room}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Add Device CTA Button - Matches Figma Node 2119:307 */}
          <View style={styles.addCtaContainer}>
            <TouchableOpacity
              style={styles.addCtaButton}
              activeOpacity={0.8}
              onPress={openAddFlow}
            >
              <Text style={styles.addCtaText}>Add +</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* =========================================================================
          ADD DEVICE BOTTOM SHEET MODAL (Modern SOURCE Design Language)
         ========================================================================= */}
      <Modal
        visible={isAddModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAddModalOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <TouchableOpacity
            style={styles.modalDismissOverlay}
            activeOpacity={1}
            onPress={() => setIsAddModalOpen(false)}
          />

          <View style={styles.modalSheet}>
            {/* Sheet Drag Indicator */}
            <View style={styles.dragIndicator} />

            {/* Step 1: Select Preset Appliance Type */}
            {modalStep === 'select' && (
              <View style={styles.modalStepContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add New Device</Text>
                  <Text style={styles.modalSubtitle}>
                    Select an appliance to pair with your SOURCE micro-grid
                  </Text>
                </View>

                <ScrollView
                  style={styles.presetScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.presetGrid}
                >
                  {PRESET_TYPES.map((preset) => (
                    <TouchableOpacity
                      key={preset.id}
                      style={styles.presetCard}
                      activeOpacity={0.7}
                      onPress={() => handleSelectPreset(preset)}
                    >
                      <View style={styles.presetIconBox}>
                        {renderDeviceIcon(preset.iconName, preset.iconType, 22, '#007AFE')}
                      </View>
                      <View style={styles.presetTextWrapper}>
                        <Text style={styles.presetTitle} numberOfLines={1}>
                          {preset.name}
                        </Text>
                        <Text style={styles.presetDesc} numberOfLines={1}>
                          {preset.description}
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={18} color="#9E9EA0" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Step 2: Configure Details & Priority */}
            {modalStep === 'configure' && (
              <View style={styles.modalStepContainer}>
                {/* Top Nav Row */}
                <View style={styles.modalHeaderWithBack}>
                  <TouchableOpacity
                    onPress={() => setModalStep('select')}
                    style={styles.modalBackButton}
                  >
                    <Feather name="chevron-left" size={20} color="#1A1A1A" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Configure Device</Text>
                  <View style={{ width: 32 }} />
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.configureForm}
                >
                  {/* Selected Preset Preview */}
                  <View style={styles.selectedPresetPreview}>
                    <View style={styles.presetIconBoxLarge}>
                      {renderDeviceIcon(
                        selectedPreset.iconName,
                        selectedPreset.iconType,
                        28,
                        '#007AFE'
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.presetTypeLabel}>DEVICE TYPE</Text>
                      <Text style={styles.presetTypeName}>{selectedPreset.name}</Text>
                    </View>
                  </View>

                  {/* Device Name Input */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Device Custom Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. Master Bedroom AC"
                      placeholderTextColor="#9E9EA0"
                      value={deviceNameInput}
                      onChangeText={setDeviceNameInput}
                      autoFocus={true}
                    />
                  </View>

                  {/* Critical vs Non-Critical Priority */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Energy Backup Priority</Text>
                    <View style={styles.prioritySelector}>
                      <TouchableOpacity
                        style={[
                          styles.priorityCard,
                          deviceCategoryInput === 'critical' && styles.priorityCardActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setDeviceCategoryInput('critical')}
                      >
                        <View style={styles.priorityHeaderRow}>
                          <View
                            style={[
                              styles.priorityDot,
                              { backgroundColor: '#007AFE' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.priorityCardTitle,
                              deviceCategoryInput === 'critical' &&
                                styles.priorityCardTitleActive,
                            ]}
                          >
                            Critical
                          </Text>
                        </View>
                        <Text style={styles.priorityCardDesc}>
                          Runs continuously on solar & battery backup during outages
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.priorityCard,
                          deviceCategoryInput === 'non-critical' &&
                            styles.priorityCardActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setDeviceCategoryInput('non-critical')}
                      >
                        <View style={styles.priorityHeaderRow}>
                          <View
                            style={[
                              styles.priorityDot,
                              { backgroundColor: '#10B981' },
                            ]}
                          />
                          <Text
                            style={[
                              styles.priorityCardTitle,
                              deviceCategoryInput === 'non-critical' &&
                                styles.priorityCardTitleActive,
                            ]}
                          >
                            Non-Critical
                          </Text>
                        </View>
                        <Text style={styles.priorityCardDesc}>
                          Smart eco-shedding during peak tariffs & low battery
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Room Location Selector */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Assigned Room</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.roomChipsScroll}
                    >
                      {ROOM_OPTIONS.map((room) => (
                        <TouchableOpacity
                          key={room}
                          style={[
                            styles.roomChip,
                            selectedRoom === room && styles.roomChipActive,
                          ]}
                          onPress={() => setSelectedRoom(room)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.roomChipText,
                              selectedRoom === room && styles.roomChipTextActive,
                            ]}
                          >
                            {room}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Action CTA */}
                  <TouchableOpacity
                    style={styles.primaryActionButton}
                    activeOpacity={0.8}
                    onPress={startPairingFlow}
                  >
                    <Text style={styles.primaryActionText}>Pair with Micro-Grid</Text>
                    <Feather name="arrow-right" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}

            {/* Step 3: Radar Pairing Scan */}
            {modalStep === 'pairing' && (
              <View style={styles.pairingContainer}>
                <View style={styles.radarWrapper}>
                  <Animated.View
                    style={[
                      styles.pulseRing,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                  <View style={styles.radarCenterCircle}>
                    <Feather name="wifi" size={32} color="#007AFE" />
                  </View>
                </View>

                <Text style={styles.pairingTitle}>Scanning for Smart Plug...</Text>
                <Text style={styles.pairingSubtitle}>
                  Ensure your device is in pairing mode and nearby
                </Text>
              </View>
            )}

            {/* Step 4: Pairing Success */}
            {modalStep === 'success' && (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Feather name="check" size={36} color="#FFFFFF" />
                </View>

                <Text style={styles.successTitle}>Device Connected!</Text>
                <Text style={styles.successSubtitle}>
                  {deviceNameInput || selectedPreset.name} has been synchronized with your
                  intelligent home energy system.
                </Text>

                {/* Summary Card */}
                <View style={styles.successSummaryCard}>
                  <View style={styles.successSummaryRow}>
                    <Text style={styles.summaryLabel}>Priority</Text>
                    <Text style={styles.summaryValue}>
                      {deviceCategoryInput === 'critical' ? 'Critical Load' : 'Eco Non-Critical'}
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.successSummaryRow}>
                    <Text style={styles.summaryLabel}>Room</Text>
                    <Text style={styles.summaryValue}>{selectedRoom}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.primaryActionButton}
                  activeOpacity={0.8}
                  onPress={finalizeAddDevice}
                >
                  <Text style={styles.primaryActionText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    marginTop: 20,
    gap: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
  },
  deviceNameSmall: {
    fontSize: 14,
  },
  deviceRoomText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#8E8E93',
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

  // ================= MODAL BOTTOM SHEET STYLES =================
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalDismissOverlay: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalStepContainer: {
    gap: 16,
  },
  modalHeader: {
    gap: 4,
    marginBottom: 8,
  },
  modalHeaderWithBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },

  // Presets List
  presetScroll: {
    maxHeight: 380,
  },
  presetGrid: {
    gap: 10,
    paddingBottom: 16,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    gap: 12,
  },
  presetIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTextWrapper: {
    flex: 1,
    gap: 2,
  },
  presetTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  presetDesc: {
    fontSize: 12,
    color: '#8E8E93',
  },

  // Configure Form
  configureForm: {
    gap: 18,
    paddingBottom: 20,
  },
  selectedPresetPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  presetIconBoxLarge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetTypeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  presetTypeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  textInput: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },

  // Priority Selector Cards
  prioritySelector: {
    gap: 10,
  },
  priorityCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 4,
  },
  priorityCardActive: {
    borderColor: '#007AFE',
    backgroundColor: '#F0F7FF',
  },
  priorityHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  priorityCardTitleActive: {
    color: '#007AFE',
    fontWeight: '700',
  },
  priorityCardDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 16,
  },

  // Room Chips
  roomChipsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  roomChip: {
    backgroundColor: '#F5F5F7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  roomChipActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  roomChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555555',
  },
  roomChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Primary Action Button
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Pairing Scanner
  pairingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    gap: 16,
  },
  radarWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 122, 254, 0.15)',
  },
  radarCenterCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  pairingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  pairingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 260,
  },

  // Success Screen
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 14,
  },
  successIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 290,
  },
  successSummaryCard: {
    width: '100%',
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
    gap: 10,
  },
  successSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  summaryDivider: {
    height: 0.5,
    backgroundColor: '#E5E5EA',
  },
});

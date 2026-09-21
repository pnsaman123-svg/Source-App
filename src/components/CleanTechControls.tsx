import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export const CleanTechControls: React.FC = () => {
  const [isOn, setIsOn] = useState(true);
  const [activeMode, setActiveMode] = useState<'quick' | 'standard' | 'deep' | 'auto' | 'schedule' | 'settings'>('standard');
  const [cleaningActive, setCleaningActive] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);

  const transitionAnim = useRef(new Animated.Value(0)).current;

  const switchToManual = () => {
    setIsManualMode(true);
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const switchToModes = () => {
    Animated.timing(transitionAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsManualMode(false);
    });
  };

  const handleStartCleaning = () => {
    setCleaningActive(!cleaningActive);
    Alert.alert(
      cleaningActive ? 'Cleaning Stopped' : 'Cleaning Started',
      cleaningActive ? 'Solar robot cleaner paused.' : 'Clean Tech LG AZ2400X is running in Standard Mode.'
    );
  };

  const handleAction = (name: string) => {
    Alert.alert(name, `${name} command sent to Clean Tech robot.`);
  };

  const modesOpacity = transitionAnim.interpolate({
    inputRange: [0, 0.4],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const modesTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
    extrapolate: 'clamp',
  });

  const manualOpacity = transitionAnim.interpolate({
    inputRange: [0.3, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const manualTranslateY = transitionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        {/* ================= VIEW 1: AUTOMATED CLEAN MODES ================= */}
        {!isManualMode ? (
          <Animated.View
            style={[
              styles.contentView,
              {
                opacity: modesOpacity,
                transform: [{ translateY: modesTranslateY }],
              },
            ]}
          >
            {/* Top Header: Device Info & On/Off Toggle */}
            <View style={styles.deviceHeaderRow}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>Clean Tech</Text>
                <Text style={styles.deviceModel}>LG AZ2400X</Text>
              </View>

              {/* Toggle Switch */}
              <TouchableOpacity
                onPress={() => setIsOn(!isOn)}
                activeOpacity={0.85}
                style={styles.toggleWrapper}
              >
                <LinearGradient
                  colors={
                    isOn
                      ? ['rgba(217, 229, 255, 0.70)', 'rgba(229, 237, 255, 0.40)', 'rgba(235, 235, 242, 0.10)', 'rgba(232, 232, 237, 0.00)']
                      : ['#E5E5EA', '#E5E5EA']
                  }
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.toggleBackground, !isOn && styles.toggleBackgroundOff]}
                >
                  {isOn ? (
                    <>
                      <Text style={styles.toggleText}>On</Text>
                      <View style={styles.toggleThumb}>
                        <Ionicons
                          name="power"
                          size={16}
                          color="#2E2E33"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.toggleThumb}>
                        <Ionicons
                          name="power"
                          size={16}
                          color="#8E8E93"
                        />
                      </View>
                      <Text style={[styles.toggleText, styles.toggleTextOff]}>Off</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Row 1: Quick, Standard, Deep (66px x 66px Buttons) */}
            <View style={styles.modesRow}>
              {/* Quick Clean */}
              <TouchableOpacity
                style={styles.modeItem}
                onPress={() => setActiveMode('quick')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeCircle, activeMode === 'quick' && styles.modeCircleActive]}>
                  <Ionicons
                    name="flash"
                    size={25}
                    color={activeMode === 'quick' ? '#1D1B20' : '#48484A'}
                  />
                </View>
                <Text style={[styles.modeLabel, activeMode === 'quick' && styles.modeLabelActive]}>
                  Quick
                </Text>
              </TouchableOpacity>

              {/* Standard Clean (Active) */}
              <TouchableOpacity
                style={styles.modeItem}
                onPress={() => setActiveMode('standard')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeCircle, activeMode === 'standard' && styles.modeCircleActive]}>
                  <Ionicons
                    name="sparkles"
                    size={25}
                    color={activeMode === 'standard' ? '#1D1B20' : '#48484A'}
                  />
                </View>
                <Text style={[styles.modeLabel, activeMode === 'standard' && styles.modeLabelActive]}>
                  Standard
                </Text>
              </TouchableOpacity>

              {/* Deep Scrub */}
              <TouchableOpacity
                style={styles.modeItem}
                onPress={() => setActiveMode('deep')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeCircle, activeMode === 'deep' && styles.modeCircleActive]}>
                  <MaterialCommunityIcons
                    name="broom"
                    size={26}
                    color={activeMode === 'deep' ? '#1D1B20' : '#48484A'}
                  />
                </View>
                <Text style={[styles.modeLabel, activeMode === 'deep' && styles.modeLabelActive]}>
                  Deep
                </Text>
              </TouchableOpacity>
            </View>

            {/* Row 2: Auto, Schedule, Settings (66px x 66px Buttons) */}
            <View style={styles.modesRow}>
              {/* Auto */}
              <TouchableOpacity
                style={styles.modeItem}
                onPress={() => setActiveMode('auto')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeCircle, activeMode === 'auto' && styles.modeCircleActive]}>
                  <Text style={[styles.autoText, activeMode === 'auto' && styles.autoTextActive]}>
                    A
                  </Text>
                </View>
                <Text style={[styles.modeLabel, activeMode === 'auto' && styles.modeLabelActive]}>
                  Auto
                </Text>
              </TouchableOpacity>

              {/* Schedule */}
              <TouchableOpacity
                style={styles.modeItem}
                onPress={() => setActiveMode('schedule')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeCircle, activeMode === 'schedule' && styles.modeCircleActive]}>
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={activeMode === 'schedule' ? '#1D1B20' : '#48484A'}
                  />
                </View>
                <Text style={[styles.modeLabel, activeMode === 'schedule' && styles.modeLabelActive]}>
                  Schedule
                </Text>
              </TouchableOpacity>

              {/* Settings / Rotate */}
              <TouchableOpacity
                style={styles.modeItem}
                onPress={() => setActiveMode('settings')}
                activeOpacity={0.7}
              >
                <View style={[styles.modeCircle, activeMode === 'settings' && styles.modeCircleActive]}>
                  <Feather
                    name="rotate-cw"
                    size={23}
                    color={activeMode === 'settings' ? '#1D1B20' : '#48484A'}
                  />
                </View>
                <Text style={[styles.modeLabel, activeMode === 'settings' && styles.modeLabelActive]}>
                  Settings
                </Text>
              </TouchableOpacity>
            </View>

            {/* Swipe to Start Button (66px Height) */}
            <TouchableOpacity
              style={styles.swipeTrackWrapper}
              onPress={handleStartCleaning}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['rgba(245, 245, 250, 0.5)', 'rgba(237, 237, 245, 0.5)', 'rgba(224, 224, 235, 0.5)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.swipeTrack}
              >
                <View style={styles.swipeThumb}>
                  <Ionicons
                    name={cleaningActive ? "pause" : "chevron-forward"}
                    size={24}
                    color="#1D1B20"
                  />
                </View>
                <Text style={styles.swipeTrackText}>
                  {cleaningActive ? 'Tap to Pause Cleaning' : 'Swipe to Start Cleaning'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          /* ================= VIEW 2: OVERLAY MANUAL CONTROLS ================= */
          <Animated.View
            style={[
              styles.manualContentView,
              {
                opacity: manualOpacity,
                transform: [{ translateY: manualTranslateY }],
              },
            ]}
          >
            {/* Header: Left-aligned Title + On/Off Toggle (Identical to Modes View) */}
            <View style={styles.deviceHeaderRow}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>Clean Tech</Text>
                <Text style={styles.deviceModel}>LG AZ2400X</Text>
              </View>

              {/* Toggle Switch (Identical to Modes Card) */}
              <TouchableOpacity
                onPress={() => setIsOn(!isOn)}
                activeOpacity={0.85}
                style={styles.toggleWrapper}
              >
                <LinearGradient
                  colors={
                    isOn
                      ? ['rgba(217, 229, 255, 0.70)', 'rgba(229, 237, 255, 0.40)', 'rgba(235, 235, 242, 0.10)', 'rgba(232, 232, 237, 0.00)']
                      : ['#E5E5EA', '#E5E5EA']
                  }
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.toggleBackground, !isOn && styles.toggleBackgroundOff]}
                >
                  {isOn ? (
                    <>
                      <Text style={styles.toggleText}>On</Text>
                      <View style={styles.toggleThumb}>
                        <Ionicons
                          name="power"
                          size={16}
                          color="#2E2E33"
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.toggleThumb}>
                        <Ionicons
                          name="power"
                          size={16}
                          color="#8E8E93"
                        />
                      </View>
                      <Text style={[styles.toggleText, styles.toggleTextOff]}>Off</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Manual Controls Body: 2x2 Action Matrix + Dock Capsule (Expanded to Fill Height) */}
            <View style={styles.manualBodyRow}>
              {/* Left 2x2 Grid (Enlarged 76px Buttons) */}
              <View style={styles.actionGridContainer}>
                {/* Row 1: Reverse & Forward */}
                <View style={styles.actionGridRow}>
                  {/* Reverse */}
                  <View style={styles.actionItem}>
                    <TouchableOpacity
                      style={styles.actionCircle}
                      onPress={() => handleAction('Reverse')}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="caret-back" size={28} color="#595961" />
                    </TouchableOpacity>
                    <Text style={styles.actionLabel}>Reverse</Text>
                  </View>

                  {/* Forward */}
                  <View style={styles.actionItem}>
                    <TouchableOpacity
                      style={styles.actionCircle}
                      onPress={() => handleAction('Forward')}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="caret-forward" size={28} color="#595961" />
                    </TouchableOpacity>
                    <Text style={styles.actionLabel}>Forward</Text>
                  </View>
                </View>

                {/* Row 2: Water Spray & Soap Spray */}
                <View style={styles.actionGridRow}>
                  {/* Water Spray */}
                  <View style={styles.actionItem}>
                    <TouchableOpacity
                      style={styles.actionCircle}
                      onPress={() => handleAction('Water Spray')}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="water-outline" size={30} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.actionLabel}>Water Spray</Text>
                  </View>

                  {/* Soap Spray */}
                  <View style={styles.actionItem}>
                    <TouchableOpacity
                      style={styles.actionCircle}
                      onPress={() => handleAction('Soap Spray')}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="circle-multiple-outline" size={30} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.actionLabel}>Soap Spray</Text>
                  </View>
                </View>
              </View>

              {/* Right Vertical Dock Capsule (Enlarged to Fill Matching Card Height) */}
              <LinearGradient
                colors={['rgba(245, 245, 250, 0.5)', 'rgba(237, 237, 245, 0.5)', 'rgba(224, 224, 235, 0.5)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.dockCapsule}
              >
                {/* Dock Up Button (76px x 76px) */}
                <TouchableOpacity
                  style={styles.dockButton}
                  onPress={() => handleAction('Dock Up')}
                  activeOpacity={0.7}
                >
                  <Feather name="chevron-up" size={32} color="#1D1B20" />
                </TouchableOpacity>

                {/* Center Label */}
                <Text style={styles.dockLabel}>Dock</Text>

                {/* Dock Down Button (76px x 76px) */}
                <TouchableOpacity
                  style={styles.dockButton}
                  onPress={() => handleAction('Dock Down')}
                  activeOpacity={0.7}
                >
                  <Feather name="chevron-down" size={32} color="#1D1B20" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Button Outside and below the card */}
      {!isManualMode ? (
        <TouchableOpacity
          style={styles.manualEntryButton}
          onPress={switchToManual}
          activeOpacity={0.8}
        >
          <Text style={styles.manualEntryText}>Manual & Advanced Remote</Text>
          <Feather name="arrow-right" size={18} color="#1D1B20" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.manualEntryButton}
          onPress={switchToModes}
          activeOpacity={0.8}
        >
          <Text style={styles.manualEntryText}>Clean Modes</Text>
          <Feather name="arrow-right" size={18} color="#1D1B20" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  // Main Card Container with Fixed Morphing Bounds
  mainCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    minHeight: 388,
    justifyContent: 'center',
  },
  contentView: {
    width: '100%',
    gap: 16,
  },
  manualContentView: {
    width: '100%',
    minHeight: 348,
    justifyContent: 'flex-start',
    gap: 20,
  },

  // Device Info & Toggle Header
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  deviceInfo: {
    justifyContent: 'center',
    gap: 2,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  deviceModel: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Toggle Switch
  toggleWrapper: {
    width: 84,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  toggleBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#EBEBF1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    borderRadius: 18,
  },
  toggleBackgroundOff: {
    backgroundColor: '#E5E5EA',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1B20',
    width: 44,
    textAlign: 'center',
  },
  toggleTextOff: {
    color: '#8E8E93',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // 3-item Grid Rows (66px Button Width)
  modesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  modeItem: {
    alignItems: 'center',
    width: 76,
    gap: 6,
  },
  modeCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#F0F0F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeCircleActive: {
    backgroundColor: '#E5ECFF',
    borderWidth: 1.5,
    borderColor: '#0076FF',
  },
  modeLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
    textAlign: 'center',
  },
  modeLabelActive: {
    fontWeight: '600',
    color: '#1D1B20',
  },
  autoText: {
    fontSize: 26,
    fontWeight: '400',
    color: '#111827',
  },
  autoTextActive: {
    fontWeight: '600',
    color: '#0076FF',
  },

  // Swipe to Start Track
  swipeTrackWrapper: {
    width: '100%',
    height: 66,
    borderRadius: 33,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  swipeTrack: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  swipeThumb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  swipeTrackText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1D1B20',
    textAlign: 'center',
    marginRight: 48,
  },

  // Manual Mode Entry Pill (Outside Card)
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F7',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    marginTop: 14,
  },
  manualEntryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1B20',
  },

  // Manual Body Row (Expands vertically to match 388px Modes Card Height with extra top spacing)
  manualBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 8,
    paddingBottom: 4,
  },
  actionGridContainer: {
    width: 206,
    height: 270,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 86,
    gap: 8,
  },
  actionCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.25,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  actionLabel: {
    fontSize: 12.5,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Dock Capsule (Matched to 76px Button Width and 270px Total Height)
  dockCapsule: {
    width: 88,
    height: 270,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  dockButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.25,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  dockLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabType } from '../types/energy';
import { useResponsive } from '../utils/responsive';

interface BottomTabBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

interface TabDef {
  key: TabType;
  label: string;
  icon: (color: string) => React.ReactNode;
}

const TABS: TabDef[] = [
  {
    key: 'home',
    label: 'Home',
    icon: (color) => <Ionicons name="home" size={22} color={color} />,
  },
  {
    key: 'savings',
    label: 'Savings',
    icon: (color) => <Ionicons name="wallet-outline" size={24} color={color} />,
  },
  {
    key: 'service',
    label: 'Service',
    icon: (color) => <MaterialCommunityIcons name="toolbox-outline" size={24} color={color} />,
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (color) => <Feather name="user" size={22} color={color} />,
  },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const insets = useSafeAreaInsets();
  const { isSmallScreen, isLargeScreen, horizontalPadding } = useResponsive();
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});

  const slideAnimX = useRef(new Animated.Value(0)).current;
  const slideAnimWidth = useRef(new Animated.Value(0)).current;
  const isInitialized = useRef(false);

  // Animated values for tab label opacity/scale
  const labelAnims = useRef<{ [key: string]: Animated.Value }>({
    home: new Animated.Value(activeTab === 'home' ? 1 : 0),
    savings: new Animated.Value(activeTab === 'savings' ? 1 : 0),
    service: new Animated.Value(activeTab === 'service' ? 1 : 0),
    profile: new Animated.Value(activeTab === 'profile' ? 1 : 0),
  }).current;

  const handleTabLayout = (key: TabType, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => {
      const next = { ...prev, [key]: { x, width } };
      return next;
    });
  };

  useEffect(() => {
    const layout = tabLayouts[activeTab];
    if (layout) {
      if (!isInitialized.current) {
        slideAnimX.setValue(layout.x);
        slideAnimWidth.setValue(layout.width);
        isInitialized.current = true;
      } else {
        Animated.parallel([
          Animated.spring(slideAnimX, {
            toValue: layout.x,
            damping: 20,
            stiffness: 220,
            mass: 0.8,
            useNativeDriver: false,
          }),
          Animated.spring(slideAnimWidth, {
            toValue: layout.width,
            damping: 20,
            stiffness: 220,
            mass: 0.8,
            useNativeDriver: false,
          }),
        ]).start();
      }
    }

    // Animate label visibilities
    TABS.forEach((tab) => {
      Animated.timing(labelAnims[tab.key], {
        toValue: tab.key === activeTab ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab, tabLayouts]);

  return (
    <View
      style={[
        styles.floatingWrapper,
        {
          left: isSmallScreen ? 14 : horizontalPadding,
          right: isSmallScreen ? 14 : horizontalPadding,
          bottom: Math.max(insets.bottom + 10, 24),
        },
      ]}
    >
      <View
        style={[
          styles.container,
          isSmallScreen && { paddingHorizontal: 6, height: 72 },
        ]}
      >
        {/* Animated Sliding Pill Highlight */}
        {tabLayouts[activeTab] && (
          <Animated.View
            style={[
              styles.slidingPill,
              isSmallScreen && { height: 54 },
              {
                left: slideAnimX,
                width: slideAnimWidth,
              },
            ]}
          />
        )}

        {/* Tab Buttons */}
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab;
          const labelOpacity = labelAnims[tab.key];
          const labelScale = labelAnims[tab.key].interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          });

          return (
            <TouchableOpacity
              key={tab.key}
              onLayout={(e) => handleTabLayout(tab.key, e)}
              style={[
                styles.tabItem,
                isSmallScreen && { height: 54 },
                isActive
                  ? isSmallScreen
                    ? styles.activeItemPaddingSmall
                    : styles.activeItemPadding
                  : isSmallScreen
                  ? styles.inactiveItemPaddingSmall
                  : styles.inactiveItemPadding,
              ]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.8}
            >
              {tab.icon(isActive ? '#FFFFFF' : '#8E8E93')}

              {isActive && (
                <Animated.View
                  style={[
                    styles.labelWrapper,
                    {
                      opacity: labelOpacity,
                      transform: [{ scale: labelScale }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.activeTabText,
                      isSmallScreen && { fontSize: 13 },
                    ]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </Animated.View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
    maxWidth: 520,
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#18191B',
    borderRadius: 39,
    height: 78,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  slidingPill: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    backgroundColor: '#35373B',
    borderRadius: 29,
    height: 58,
    zIndex: 1,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: 29,
    zIndex: 2,
  },
  activeItemPadding: {
    paddingHorizontal: 20,
    gap: 8,
  },
  activeItemPaddingSmall: {
    paddingHorizontal: 12,
    gap: 6,
  },
  inactiveItemPadding: {
    paddingHorizontal: 16,
  },
  inactiveItemPaddingSmall: {
    paddingHorizontal: 10,
  },
  labelWrapper: {
    marginLeft: 2,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

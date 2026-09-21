import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface HeaderProps {
  userName?: string;
  onPressNotifications?: () => void;
  onPressSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Anay',
  onPressNotifications,
  onPressSettings,
}) => {
  const { horizontalPadding, isSmallScreen } = useResponsive();

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text
          style={[styles.userNameText, isSmallScreen && { fontSize: 20 }]}
          numberOfLines={1}
        >
          {userName}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressNotifications}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPressSettings}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 10,
  },
  textContainer: {
    gap: 2,
  },
  welcomeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  userNameText: {
    fontSize: 22,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

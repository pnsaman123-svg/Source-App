import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface ProfileScreenProps {
  onBack?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const menuItems = [
    {
      title: 'Manage profile',
      action: () => Alert.alert('Manage Profile', 'Edit name, email and phone number.'),
    },
    {
      title: 'App preference',
      action: () => Alert.alert('App Preference', 'Dark mode, theme and push notifications.'),
    },
    {
      title: 'Security & Account',
      action: () => Alert.alert('Security & Account', 'Two-factor auth and active sessions.'),
    },
    {
      title: 'Change password',
      action: () => Alert.alert('Change Password', 'Update your password.'),
    },
    {
      title: 'Log out',
      action: () =>
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive' },
        ]),
    },
    {
      title: 'Help & Support',
      action: () => Alert.alert('Help & Support', 'Contact 24/7 energy support.'),
    },
  ];

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All energy telemetry and solar device linking will be removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' },
      ]
    );
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
        {/* Fixed Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack || (() => Alert.alert('Back', 'Navigating to Home'))}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          {/* Spacer to balance back button */}
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header: 120px Avatar + Edit Badge + Info */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={64} color="#C4C4CE" />
              </View>

              {/* Blue Edit Badge */}
              <TouchableOpacity
                style={styles.editBadge}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Edit Photo', 'Upload or change profile photo.')}
              >
                <Feather name="edit-2" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>Anay</Text>
              <Text style={styles.userEmail}>anay@gmail.com</Text>
            </View>
          </View>

          {/* Settings Menu Card */}
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.menuRow}
                  onPress={item.action}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuLabel}>{item.title}</Text>
                  <Feather name="chevron-right" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                {index < menuItems.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>

          {/* Delete Account Outline Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header (Figma node 2065:2469)
  header: {
    height: 65,
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
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
    height: 48,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 160,
    gap: 24,
  },

  // Profile Header (Figma node 2065:2476)
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0076FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#F5F5F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },

  // Settings Menu Card (Figma node 2065:2485)
  menuCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 4,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBEBF0',
    width: '100%',
  },

  // Delete Account Button (Figma node 2065:2521)
  deleteButton: {
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E53333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E53333',
  },
});

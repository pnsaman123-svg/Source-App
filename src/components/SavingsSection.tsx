import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/responsive';

interface SavingsSectionProps {
  weeklyEarnings?: number;
  co2Savings?: number;
  onPressEarnings?: () => void;
  onPressCo2?: () => void;
}

export const SavingsSection: React.FC<SavingsSectionProps> = ({
  weeklyEarnings = 145,
  co2Savings = 12.09,
  onPressEarnings,
  onPressCo2,
}) => {
  const { isSmallScreen, horizontalPadding } = useResponsive();

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      <Text style={styles.sectionTitle}>Savings</Text>

      <View style={[styles.cardsRow, isSmallScreen && { gap: 10 }]}>
        {/* Card 1: Weekly Earnings */}
        <TouchableOpacity
          style={[styles.card, isSmallScreen && styles.cardSmall]}
          activeOpacity={0.8}
          onPress={onPressEarnings}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader} numberOfLines={1}>
              Weekly Earnings
            </Text>
          </View>
          <View style={styles.cardBottomRow}>
            <Text
              style={[styles.cardValue, isSmallScreen && styles.cardValueSmall]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              ₹{weeklyEarnings}
            </Text>
            <Ionicons
              name="wallet-outline"
              size={isSmallScreen ? 24 : 28}
              color="#F59E0B"
            />
          </View>
        </TouchableOpacity>

        {/* Card 2: CO2 Savings */}
        <TouchableOpacity
          style={[styles.card, isSmallScreen && styles.cardSmall]}
          activeOpacity={0.8}
          onPress={onPressCo2}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader} numberOfLines={1}>
              CO2 Savings
            </Text>
          </View>
          <View style={styles.cardBottomRow}>
            <Text
              style={[styles.cardValue, isSmallScreen && styles.cardValueSmall]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {co2Savings} Tons
            </Text>
            <Ionicons
              name="leaf-outline"
              size={isSmallScreen ? 24 : 28}
              color="#10B981"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  card: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'space-between',
    minHeight: 104,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  cardSmall: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    minHeight: 96,
  },
  cardHeaderRow: {
    marginBottom: 8,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#555555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  cardValueSmall: {
    fontSize: 18,
  },
});

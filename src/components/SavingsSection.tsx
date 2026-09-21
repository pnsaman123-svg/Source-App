import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Savings</Text>

      <View style={styles.cardsRow}>
        {/* Card 1: Weekly Earnings */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={onPressEarnings}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader}>Weekly Earnings</Text>
          </View>
          <View style={styles.cardBottomRow}>
            <Text style={styles.cardValue}>₹{weeklyEarnings}</Text>
            <Ionicons
              name="wallet-outline"
              size={28}
              color="#F59E0B"
            />
          </View>
        </TouchableOpacity>

        {/* Card 2: CO2 Savings */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={onPressCo2}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader}>CO2 Savings</Text>
          </View>
          <View style={styles.cardBottomRow}>
            <Text style={styles.cardValue}>{co2Savings} Tons</Text>
            <Ionicons
              name="leaf-outline"
              size={28}
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'space-between',
    minHeight: 104,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
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
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
});

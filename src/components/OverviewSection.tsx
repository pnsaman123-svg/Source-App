import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useResponsive } from '../utils/responsive';

interface OverviewSectionProps {
  batterySoc?: number;
  batteryStatus?: string;
  sourceKwh?: number;
  sourceStatus?: string;
  loadKw?: number;
  loadStatus?: string;
  onPressCard?: (card: 'battery' | 'source' | 'load') => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  batterySoc = 77,
  batteryStatus = 'Good',
  sourceKwh = 6.5,
  sourceStatus = 'Optimal',
  loadKw = 4.57,
  loadStatus = 'Moderate',
  onPressCard,
}) => {
  const { isSmallScreen, horizontalPadding } = useResponsive();

  return (
    <View style={[styles.container, { paddingHorizontal: horizontalPadding }]}>
      <Text style={styles.sectionTitle}>Overview</Text>

      {/* Top 2 Cards: Battery SOC & Source Monitoring */}
      <View style={[styles.topRow, isSmallScreen && { gap: 10, marginBottom: 10 }]}>
        {/* Battery SOC Card */}
        <TouchableOpacity
          style={[styles.halfCard, isSmallScreen && styles.halfCardSmall]}
          activeOpacity={0.8}
          onPress={() => onPressCard?.('battery')}
        >
          <Text style={styles.cardLabel} numberOfLines={1}>
            Battery SOC
          </Text>
          <Text
            style={[styles.cardValue, isSmallScreen && styles.cardValueSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {batterySoc}%
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(batterySoc, 100)}%`, backgroundColor: '#0088FF' },
              ]}
            />
          </View>

          {/* Status Label */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#0088FF' }]} />
            <Text style={styles.statusText} numberOfLines={1}>
              {batteryStatus}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Source Monitoring Card */}
        <TouchableOpacity
          style={[styles.halfCard, isSmallScreen && styles.halfCardSmall]}
          activeOpacity={0.8}
          onPress={() => onPressCard?.('source')}
        >
          <Text style={styles.cardLabel} numberOfLines={1}>
            Source Monitoring
          </Text>
          <Text
            style={[styles.cardValue, isSmallScreen && styles.cardValueSmall]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {sourceKwh} kWh
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: '55%', backgroundColor: '#10B981' },
              ]}
            />
          </View>

          {/* Status Label */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statusText} numberOfLines={1}>
              {sourceStatus}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Card: Load Consumption */}
      <TouchableOpacity
        style={[styles.fullCard, isSmallScreen && styles.fullCardSmall]}
        activeOpacity={0.8}
        onPress={() => onPressCard?.('load')}
      >
        <Text style={styles.cardLabel} numberOfLines={1}>
          Load Consumption
        </Text>
        <Text
          style={[styles.cardValue, isSmallScreen && styles.cardValueSmall]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {loadKw} kW
        </Text>

        {/* Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: '30%', backgroundColor: '#F59E0B' },
            ]}
          />
        </View>

        {/* Status Label */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.statusText} numberOfLines={1}>
            {loadStatus}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  halfCard: {
    flex: 1,
    height: 156,
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    padding: 18,
    justifyContent: 'space-between',
  },
  halfCardSmall: {
    padding: 12,
    height: 144,
  },
  fullCard: {
    height: 156,
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    padding: 18,
    justifyContent: 'space-between',
  },
  fullCardSmall: {
    padding: 14,
    height: 144,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555555',
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  cardValueSmall: {
    fontSize: 22,
  },
  progressBarTrack: {
    width: '100%',
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
    overflow: 'hidden',
    marginVertical: 2,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});

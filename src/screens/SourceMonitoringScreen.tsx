import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface SourceMonitoringScreenProps {
  onBack?: () => void;
  solarKw?: number;
  batterySoc?: number;
  gridKw?: number | string;
  loadKw?: number;
}

export const SourceMonitoringScreen: React.FC<SourceMonitoringScreenProps> = ({
  onBack,
  solarKw = 6.5,
  batterySoc = 77,
  gridKw = -1,
  loadKw = 4.5,
}) => {
  const { width, horizontalPadding, isSmallScreen } = useResponsive();
  const diagramWidth = Math.min(width - horizontalPadding * 2, 480);
  const [lastRefreshed, setLastRefreshed] = useState('Mon, Jun 9 • 10:42 AM');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLastRefreshed(`${dateStr} • ${timeStr}`);
      setRefreshing(false);
    }, 400);
  };

  return (
    <View style={styles.root}>
      {/* Figma Radial Background Image */}
      <Image
        source={require('../../assets/images/bg-gradient.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header - Matches Figma Node 2065:317 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Source Monitoring</Text>

          {/* Symmetrical placeholder */}
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Timestamp & Refresh Row - Matches Figma Node 2071:978 */}
          <View style={styles.timestampRow}>
            <Text style={styles.timestampText}>{lastRefreshed}</Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              activeOpacity={0.7}
            >
              <Feather
                name="refresh-cw"
                size={16}
                color={refreshing ? '#007AFF' : '#1A1A1A'}
              />
            </TouchableOpacity>
          </View>

          {/* Large Detailed Power Flow Diagram - Matches Figma Node 2065:704 */}
          <View style={[styles.diagramWrapper, { width: diagramWidth }]}>
            {/* Top Flow Connecting Tracks (Figma Node 2065:705) */}
            <View style={styles.topTracksContainer} pointerEvents="none">
              {/* Left Track (Solar -> Inverter) */}
              <View style={styles.trackTopLeft} />
              {/* Active Blue Flow Pulse (Solar) */}
              <View style={styles.pulseTopLeft} />

              {/* Right Track (Battery <-> Inverter) */}
              <View style={styles.trackTopRight} />
              {/* Active Blue Flow Pulse (Battery) */}
              <View style={styles.pulseTopRight} />
            </View>

            {/* Bottom Flow Connecting Tracks (Figma Node 2065:708) */}
            <View style={styles.bottomTracksContainer} pointerEvents="none">
              {/* Left Track (Grid -> Inverter) */}
              <View style={styles.trackBottomLeft} />

              {/* Right Track (Load <- Inverter) */}
              <View style={styles.trackBottomRight} />
              {/* Active Blue Flow Pulse (Load) */}
              <View style={styles.pulseBottomRight} />
              <View style={styles.pulseBottomRightVertical} />
            </View>

            {/* Central 3D Hybrid Inverter Device (Figma Node 2065:726) */}
            <View style={styles.inverterWrapper}>
              <Image
                source={require('../../assets/images/inverter.png')}
                style={styles.inverterImage}
                resizeMode="contain"
              />
            </View>

            {/* Top Left Node: Solar (Figma Node 2065:711) */}
            <View style={[styles.nodeContainer, styles.nodeTopLeft]}>
              <View style={[styles.nodeIconCircle, styles.solarShadow]}>
                <Feather name="sun" size={30} color="#F5A624" />
              </View>
              <Text style={styles.nodeLabel} numberOfLines={1}>Solar</Text>
              <Text style={styles.nodeValue} numberOfLines={1}>{solarKw} kW</Text>
            </View>

            {/* Top Right Node: Battery (Figma Node 2065:718) */}
            <View style={[styles.nodeContainer, styles.nodeTopRight]}>
              <View style={[styles.nodeIconCircle, styles.batteryShadow]}>
                <Ionicons name="battery-charging" size={30} color="#2FAD29" />
              </View>
              <Text style={styles.nodeLabel} numberOfLines={1}>Battery</Text>
              <Text style={styles.nodeValue} numberOfLines={1}>{batterySoc}%</Text>
            </View>

            {/* Bottom Left Node: Grid (Figma Node 2065:727) */}
            <View style={[styles.nodeContainer, styles.nodeBottomLeft]}>
              <View style={[styles.nodeIconCircle, styles.gridShadow]}>
                <MaterialCommunityIcons name="transmission-tower" size={30} color="#7977DA" />
              </View>
              <Text style={styles.nodeLabel} numberOfLines={1}>Grid</Text>
              <Text style={styles.nodeValue} numberOfLines={1}>{gridKw} kW</Text>
            </View>

            {/* Bottom Right Node: Load (Figma Node 2065:734) */}
            <View style={[styles.nodeContainer, styles.nodeBottomRight]}>
              <View style={[styles.nodeIconCircle, styles.loadShadow]}>
                <MaterialCommunityIcons name="home-lightning-bolt-outline" size={30} color="#0076FF" />
              </View>
              <Text style={styles.nodeLabel} numberOfLines={1}>Load</Text>
              <Text style={styles.nodeValue} numberOfLines={1}>{loadKw} kW</Text>
            </View>
          </View>

          {/* System Status Pill Badge - Matches Figma Node 2071:982 */}
          <View style={styles.statusBadgeContainer}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Power Flow: Active</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    letterSpacing: 0.32,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timestampText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Diagram Layout
  diagramWrapper: {
    height: 434,
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Central Inverter Unit (w: 132, h: 192)
  inverterWrapper: {
    position: 'absolute',
    top: 129,
    left: '50%',
    marginLeft: -66,
    width: 132,
    height: 192,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5.5 },
    shadowOpacity: 0.25,
    shadowRadius: 13.7,
    elevation: 6,
  },
  inverterImage: {
    width: '100%',
    height: '100%',
  },

  // Top Tracks (w: 230, h: 114)
  topTracksContainer: {
    position: 'absolute',
    top: 40,
    left: '50%',
    marginLeft: -125,
    width: 230,
    height: 114,
    zIndex: 5,
  },
  trackTopLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 102,
    height: 114,
    borderTopWidth: 3.4,
    borderRightWidth: 3.4,
    borderColor: '#DEDEDE',
    borderTopRightRadius: 11,
  },
  pulseTopLeft: {
    position: 'absolute',
    left: 45,
    top: 0,
    width: 34,
    height: 3.4,
    backgroundColor: '#1C82FE',
    borderRadius: 1.7,
  },
  trackTopRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 82,
    height: 114,
    borderTopWidth: 3.4,
    borderLeftWidth: 3.4,
    borderColor: '#DEDEDE',
    borderTopLeftRadius: 11,
  },
  pulseTopRight: {
    position: 'absolute',
    right: 59,
    top: 0,
    width: 23,
    height: 3.4,
    backgroundColor: '#1C82FE',
    borderRadius: 1.7,
  },

  // Bottom Tracks (w: 230, h: 114)
  bottomTracksContainer: {
    position: 'absolute',
    top: 248,
    left: '50%',
    marginLeft: -125,
    width: 230,
    height: 114,
    zIndex: 5,
  },
  trackBottomLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 102,
    height: 114,
    borderBottomWidth: 3.4,
    borderRightWidth: 3.4,
    borderColor: '#DEDEDE',
    borderBottomRightRadius: 11,
  },
  trackBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 82,
    height: 114,
    borderBottomWidth: 3.4,
    borderLeftWidth: 3.4,
    borderColor: '#DEDEDE',
    borderBottomLeftRadius: 11,
  },
  pulseBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 35.8,
    height: 3.4,
    backgroundColor: '#1C82FE',
    borderRadius: 1.7,
  },
  pulseBottomRightVertical: {
    position: 'absolute',
    right: 80.3,
    bottom: 31.5,
    width: 3.4,
    height: 33,
    backgroundColor: '#1C82FE',
    borderRadius: 1.7,
  },

  // Telemetry Nodes (Top: 10px, Bottom: 331px)
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 110,
    zIndex: 15,
  },
  nodeTopLeft: {
    top: 10,
    left: 7,
  },
  nodeTopRight: {
    top: 10,
    right: 7,
  },
  nodeBottomLeft: {
    top: 331,
    left: 7,
  },
  nodeBottomRight: {
    top: 331,
    right: 7,
  },
  nodeIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  solarShadow: {
    shadowColor: 'rgba(219,195,40,0.5)',
    shadowOffset: { width: 2.2, height: 2.2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  batteryShadow: {
    shadowColor: 'rgba(16,157,39,0.5)',
    shadowOffset: { width: 0, height: 2.2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  gridShadow: {
    shadowColor: 'rgba(121,119,218,0.45)',
    shadowOffset: { width: 0, height: 2.2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  loadShadow: {
    shadowColor: 'rgba(0,118,255,0.45)',
    shadowOffset: { width: 0, height: 2.2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  nodeLabel: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
    textAlign: 'center',
  },
  nodeValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 1,
  },

  // Status Badge
  statusBadgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F0FF',
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0076FF',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0076FF',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DIAGRAM_WIDTH = SCREEN_WIDTH - 32;

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
          contentContainerStyle={styles.scrollContent}
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

          {/* Power Flow Diagram Container - Matches Figma Node 2071:982 */}
          <View style={styles.diagramCard}>
            {/* Top Flow Connecting Tracks */}
            <View style={styles.topTracksContainer} pointerEvents="none">
              <View style={styles.trackTopLeft} />
              <View style={styles.pulseTopLeft} />

              <View style={styles.trackTopRight} />
              <View style={styles.pulseTopRight} />
            </View>

            {/* Bottom Flow Connecting Tracks */}
            <View style={styles.bottomTracksContainer} pointerEvents="none">
              <View style={styles.trackBottomLeft} />

              <View style={styles.trackBottomRight} />
              <View style={styles.pulseBottomRight} />
              <View style={styles.pulseBottomRightVertical} />
            </View>

            {/* Central 3D Inverter */}
            <View style={styles.inverterWrapper}>
              <Image
                source={require('../../assets/images/inverter.png')}
                style={styles.inverterImage}
                resizeMode="contain"
              />
            </View>

            {/* Top-Left: Solar Node */}
            <TouchableOpacity
              style={[styles.nodeContainer, styles.nodeTopLeft]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Solar Source', `${solarKw} kW generated currently`)}
            >
              <View style={[styles.nodeIconCircle, styles.solarShadow]}>
                <Feather name="sun" size={28} color="#F5A624" />
              </View>
              <Text style={styles.nodeLabel}>Solar</Text>
              <Text style={styles.nodeValue}>{solarKw} kW</Text>
            </TouchableOpacity>

            {/* Top-Right: Battery Node */}
            <TouchableOpacity
              style={[styles.nodeContainer, styles.nodeTopRight]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Battery Storage', `${batterySoc}% capacity remaining`)}
            >
              <View style={[styles.nodeIconCircle, styles.batteryShadow]}>
                <Ionicons name="battery-charging" size={28} color="#2FAD29" />
              </View>
              <Text style={styles.nodeLabel}>Battery</Text>
              <Text style={styles.nodeValue}>{batterySoc}%</Text>
            </TouchableOpacity>

            {/* Bottom-Left: Grid Node */}
            <TouchableOpacity
              style={[styles.nodeContainer, styles.nodeBottomLeft]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Grid Connection', `${gridKw} kW flow (Standby)`)}
            >
              <View style={[styles.nodeIconCircle, styles.gridShadow]}>
                <MaterialCommunityIcons name="transmission-tower" size={28} color="#7977DA" />
              </View>
              <Text style={styles.nodeLabel}>Grid</Text>
              <Text style={styles.nodeValue}>{gridKw} kW</Text>
            </TouchableOpacity>

            {/* Bottom-Right: Load Node */}
            <TouchableOpacity
              style={[styles.nodeContainer, styles.nodeBottomRight]}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Home Load', `${loadKw} kW current consumption`)}
            >
              <View style={[styles.nodeIconCircle, styles.loadShadow]}>
                <MaterialCommunityIcons name="home-lightning-bolt-outline" size={28} color="#0076FF" />
              </View>
              <Text style={styles.nodeLabel}>Load</Text>
              <Text style={styles.nodeValue}>{loadKw} kW</Text>
            </TouchableOpacity>
          </View>

          {/* Standby Status Badge - Matches Figma Node 2065:1506 */}
          <View style={styles.statusBadgeContainer}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Standby</Text>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  timestampText: {
    fontSize: 12,
    color: '#9E9EA0',
    fontWeight: '400',
  },
  refreshButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 1,
  },
  diagramCard: {
    width: DIAGRAM_WIDTH,
    height: 434,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Central Inverter
  inverterWrapper: {
    position: 'absolute',
    top: 130,
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

  // Top Tracks
  topTracksContainer: {
    position: 'absolute',
    top: 40,
    left: '50%',
    marginLeft: -110,
    width: 220,
    height: 110,
    zIndex: 5,
  },
  trackTopLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 95,
    height: 110,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#DEDEDE',
    borderTopRightRadius: 10,
  },
  pulseTopLeft: {
    position: 'absolute',
    left: 45,
    top: 0,
    width: 30,
    height: 2.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },
  trackTopRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 80,
    height: 110,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: '#DEDEDE',
    borderTopLeftRadius: 10,
  },
  pulseTopRight: {
    position: 'absolute',
    right: 55,
    top: 0,
    width: 22,
    height: 2.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },

  // Bottom Tracks
  bottomTracksContainer: {
    position: 'absolute',
    top: 250,
    left: '50%',
    marginLeft: -110,
    width: 220,
    height: 110,
    zIndex: 5,
  },
  trackBottomLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 95,
    height: 110,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#DEDEDE',
    borderBottomRightRadius: 10,
  },
  trackBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 80,
    height: 110,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: '#DEDEDE',
    borderBottomLeftRadius: 10,
  },
  pulseBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 2.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },
  pulseBottomRightVertical: {
    position: 'absolute',
    right: 78.5,
    bottom: 28,
    width: 2.5,
    height: 30,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },

  // Nodes
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

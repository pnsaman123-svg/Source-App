import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - 48; // 24px left + 24px right padding
const HERO_HEIGHT = 321; // Figma Node 2312:1656 exact height

interface PowerFlowDiagramProps {
  solarKw?: number;
  batterySoc?: number;
  gridKw?: number | string;
  loadKw?: number;
  onSelectMetric?: (metric: 'solar' | 'grid' | 'battery' | 'load') => void;
}

export const PowerFlowDiagram: React.FC<PowerFlowDiagramProps> = ({
  solarKw = 6.5,
  batterySoc = 77,
  gridKw = -1,
  loadKw = 4.5,
  onSelectMetric,
}) => {
  return (
    <View style={styles.container}>
      {/* 1. Top Flow Connecting Tracks (Figma Node 2312:1657) */}
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

      {/* 2. Bottom Flow Connecting Tracks (Figma Node 2312:1660) */}
      <View style={styles.bottomTracksContainer} pointerEvents="none">
        {/* Left Track (Grid -> Inverter) */}
        <View style={styles.trackBottomLeft} />

        {/* Right Track (Load <- Inverter) */}
        <View style={styles.trackBottomRight} />
        {/* Active Blue Flow Pulse (Load) */}
        <View style={styles.pulseBottomRight} />
        <View style={styles.pulseBottomRightVertical} />
      </View>

      {/* 3. Central 3D Hybrid Inverter Device (Figma Node 2312:1678) */}
      <View style={styles.inverterWrapper}>
        <Image
          source={require('../../assets/images/inverter.png')}
          style={styles.inverterImage}
          resizeMode="contain"
        />
      </View>

      {/* 4. Top Left Node: Solar (Figma Node 2312:1663) */}
      <TouchableOpacity
        style={[styles.nodeContainer, styles.nodeTopLeft]}
        onPress={() => onSelectMetric?.('solar')}
        activeOpacity={0.8}
      >
        <View style={[styles.nodeIconCircle, styles.solarShadow]}>
          <Feather name="sun" size={22} color="#F5A624" />
        </View>
        <Text style={styles.nodeLabel}>Solar</Text>
        <Text style={styles.nodeValue}>{solarKw} kW</Text>
      </TouchableOpacity>

      {/* 5. Top Right Node: Battery (Figma Node 2312:1670) */}
      <TouchableOpacity
        style={[styles.nodeContainer, styles.nodeTopRight]}
        onPress={() => onSelectMetric?.('battery')}
        activeOpacity={0.8}
      >
        <View style={[styles.nodeIconCircle, styles.batteryShadow]}>
          <Ionicons name="battery-charging" size={22} color="#2FAD29" />
        </View>
        <Text style={styles.nodeLabel}>Battery</Text>
        <Text style={styles.nodeValue}>{batterySoc}%</Text>
      </TouchableOpacity>

      {/* 6. Bottom Left Node: Grid (Figma Node 2312:1679) */}
      <TouchableOpacity
        style={[styles.nodeContainer, styles.nodeBottomLeft]}
        onPress={() => onSelectMetric?.('grid')}
        activeOpacity={0.8}
      >
        <View style={[styles.nodeIconCircle, styles.gridShadow]}>
          <MaterialCommunityIcons name="transmission-tower" size={22} color="#7977DA" />
        </View>
        <Text style={styles.nodeLabel}>Grid</Text>
        <Text style={styles.nodeValue}>{gridKw} kW</Text>
      </TouchableOpacity>

      {/* 7. Bottom Right Node: Load (Figma Node 2312:1686) */}
      <TouchableOpacity
        style={[styles.nodeContainer, styles.nodeBottomRight]}
        onPress={() => onSelectMetric?.('load')}
        activeOpacity={0.8}
      >
        <View style={[styles.nodeIconCircle, styles.loadShadow]}>
          <MaterialCommunityIcons name="home-lightning-bolt-outline" size={22} color="#0076FF" />
        </View>
        <Text style={styles.nodeLabel}>Load</Text>
        <Text style={styles.nodeValue}>{loadKw}kW</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Central 3D Inverter Unit (Node 2312:1678: top 95.41px, w 97.72px, h 142.01px)
  inverterWrapper: {
    position: 'absolute',
    top: 95.4,
    left: '50%',
    marginLeft: -48.8,
    width: 97.7,
    height: 142,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4.057 },
    shadowOpacity: 0.25,
    shadowRadius: 10.144,
    elevation: 6,
  },
  inverterImage: {
    width: '100%',
    height: '100%',
  },

  // Top Tracks (Figma Node 2312:1657: w 170.5px, h 84.9px)
  topTracksContainer: {
    position: 'absolute',
    top: 29.5,
    left: '50%',
    marginLeft: -93,
    width: 170.5,
    height: 84.9,
    zIndex: 5,
  },
  trackTopLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 76,
    height: 84.9,
    borderTopWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#DEDEDE',
    borderTopRightRadius: 8,
  },
  pulseTopLeft: {
    position: 'absolute',
    left: 33.5,
    top: 0,
    width: 25,
    height: 2.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },
  trackTopRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 61,
    height: 84.9,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: '#DEDEDE',
    borderTopLeftRadius: 8,
  },
  pulseTopRight: {
    position: 'absolute',
    right: 44,
    top: 0,
    width: 17,
    height: 2.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },

  // Bottom Tracks (Figma Node 2312:1660: w 170.5px, h 84.8px)
  bottomTracksContainer: {
    position: 'absolute',
    top: 183.4,
    left: '50%',
    marginLeft: -93,
    width: 170.5,
    height: 84.8,
    zIndex: 5,
  },
  trackBottomLeft: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 76,
    height: 84.8,
    borderBottomWidth: 2.5,
    borderRightWidth: 2.5,
    borderColor: '#DEDEDE',
    borderBottomRightRadius: 8,
  },
  trackBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 61,
    height: 84.8,
    borderBottomWidth: 2.5,
    borderLeftWidth: 2.5,
    borderColor: '#DEDEDE',
    borderBottomLeftRadius: 8,
  },
  pulseBottomRight: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26.5,
    height: 2.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },
  pulseBottomRightVertical: {
    position: 'absolute',
    right: 59.75,
    bottom: 23.3,
    width: 2.5,
    height: 24.5,
    backgroundColor: '#1C82FE',
    borderRadius: 1.25,
  },

  // Telemetry Nodes (Nodes 2312:1663, 2312:1670, 2312:1679, 2312:1686)
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: 81.4,
    zIndex: 15,
  },
  nodeTopLeft: {
    top: 6,
    left: 10,
  },
  nodeTopRight: {
    top: 6,
    right: 10,
  },
  nodeBottomLeft: {
    top: 244.8,
    left: 10,
  },
  nodeBottomRight: {
    top: 244.8,
    right: 10,
  },
  nodeIconCircle: {
    width: 44.4,
    height: 44.4,
    borderRadius: 22.2,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  solarShadow: {
    shadowColor: 'rgba(219,195,40,0.4)',
    shadowOffset: { width: 1.6, height: 1.6 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 2,
  },
  batteryShadow: {
    shadowColor: 'rgba(16,157,39,0.4)',
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 2,
  },
  gridShadow: {
    shadowColor: 'rgba(121,119,218,0.4)',
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 2,
  },
  loadShadow: {
    shadowColor: 'rgba(0,118,255,0.4)',
    shadowOffset: { width: 0, height: 1.6 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 2,
  },
  nodeLabel: {
    fontSize: 9.6,
    color: '#555555',
    fontWeight: '500',
    textAlign: 'center',
  },
  nodeValue: {
    fontSize: 11.8,
    color: '#333333',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 0.74,
  },
});

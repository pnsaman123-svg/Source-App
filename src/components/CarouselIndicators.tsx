import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

interface CarouselIndicatorsProps {
  activeIndex: number;
  total?: number;
  onSelectIndex: (index: number) => void;
}

export const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  activeIndex,
  total = 3,
  onSelectIndex,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => onSelectIndex(idx)}
          activeOpacity={0.8}
          style={[
            styles.dot,
            activeIndex === idx ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  inactiveDot: {
    width: 12,
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#6B7280',
  },
});

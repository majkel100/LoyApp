import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Switch } from 'react-native';
import { useTheme } from '@/theme';

import PromotionCard, { PromotionItem } from '@/components/molecules/PromotionCard';

interface PromotionListProps {
  promotions: PromotionItem[];
  isLoading?: boolean;
  userPoints?: string;
}

const PromotionList = ({ promotions, isLoading = false, userPoints = '0' }: PromotionListProps) => {
  const { fonts, gutters, colors, variant } = useTheme();
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const isDarkMode = variant === 'dark';
  const textNameColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const switchTrackColor = { false: isDarkMode ? '#373945' : '#E5E5E5', true: isDarkMode ? '#A6A4F0' : colors.purple500 };
  const switchThumbColor = isDarkMode ? '#FFFFFF' : '#FFFFFF';

  if (isLoading) {
    return (
      <View style={[gutters.padding_16]}>
        <Text style={[fonts.size_16]}>Ładowanie promocji...</Text>
      </View>
    );
  }

  if (!promotions || promotions.length === 0) {
    return (
      <View style={[gutters.padding_16]}>
        <Text style={[fonts.size_16]}>Brak dostępnych promocji</Text>
      </View>
    );
  }

  // Filtrowanie promocji jeśli włączony jest filtr
  const userPointsNumber = parseInt(userPoints, 10) || 0;
  const filteredPromotions = showOnlyAvailable 
    ? promotions.filter(promotion => userPointsNumber >= (promotion.requireRedeemedPoints || 0))
    : promotions;

  return (
    <View style={[styles.container, gutters.padding_16]}>
      <Text style={[fonts.size_24, fonts.bold, gutters.marginBottom_16]}>
        <Text style={{ color: isDarkMode ? colors.purple500 : colors.purple500 }}>Twoje</Text>
        <Text style={{ color: textNameColor }}> promocje</Text>
      </Text>
      
      <View style={[styles.filterContainer, gutters.marginBottom_24]}>
        <Text style={[fonts.size_16, { color: textNameColor }]}>
          Pokaż tylko dostępne
        </Text>
        <Switch
          trackColor={switchTrackColor}
          thumbColor={switchThumbColor}
          ios_backgroundColor={switchTrackColor.false}
          onValueChange={() => setShowOnlyAvailable(prev => !prev)}
          value={showOnlyAvailable}
        />
      </View>
      
      {filteredPromotions.map((promotion) => (
        <PromotionCard 
          key={promotion.uuid} 
          promotion={promotion} 
          userPoints={userPoints}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default PromotionList; 
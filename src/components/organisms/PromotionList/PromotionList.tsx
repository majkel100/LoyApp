import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

import PromotionCard, { PromotionItem } from '@/components/molecules/PromotionCard';

interface PromotionListProps {
  promotions: PromotionItem[];
  isLoading?: boolean;
  userPoints?: string;
}

const PromotionList = ({ promotions, isLoading = false, userPoints = '0' }: PromotionListProps) => {
  const { fonts, gutters, colors, variant } = useTheme();

  const isDarkMode = variant === 'dark';
  const textNameColor = isDarkMode ? '#FFFFFF' : colors.gray800;

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

  return (
    <View style={[styles.container, gutters.padding_16]}>
      <Text style={[fonts.size_24, fonts.bold, gutters.marginBottom_24, { color: textNameColor }]}>
        Dostępne promocje
      </Text>
      {promotions.map((promotion) => (
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
});

export default PromotionList; 
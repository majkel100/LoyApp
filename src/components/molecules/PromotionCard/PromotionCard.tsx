import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme';

// Interfejs dla danych promocji
export interface PromotionItem {
  uuid: string;
  name?: string;
  code: string;
  requireRedeemedPoints: number;
  images?: Array<{
    url: string;
    type: string;
  }>;
  headline?: string;
  descriptionText?: string;
}

interface PromotionCardProps {
  promotion: PromotionItem;
  userPoints?: string;
}

const PromotionCard = ({ promotion, userPoints = '0' }: PromotionCardProps) => {
  const { colors, fonts, gutters, layout, variant } = useTheme();

  // Pobierz URL obrazu z obrazów typu 'thumbnail'
  const imageUrl = promotion.images?.find(img => img.type === 'thumbnail')?.url;
  
  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  const textNameColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const textHeadlineColor = isDarkMode ? '#E0E0E0' : colors.gray400;
  const textPointsColor = isDarkMode ? '#A6A4F0' : colors.purple500;
  const cardBackgroundColor = isDarkMode ? '#252732' : colors.gray50;
  const contentBackgroundColor = isDarkMode ? '#1B1A23' : '#FFFFFF';
  
  // Kolory dla paska postępu
  const progressBarBackgroundColor = isDarkMode ? '#373945' : '#E5E5E5';
  const progressBarFilledColor = isDarkMode ? '#A6A4F0' : colors.purple500;
  
  // Obliczanie postępu
  const userPointsNumber = parseInt(userPoints, 10) || 0;
  const requiredPoints = promotion.requireRedeemedPoints || 0;
  let progressPercentage = (userPointsNumber / requiredPoints) * 100;
  
  // Ograniczamy postęp do maksymalnie 100%
  progressPercentage = Math.min(progressPercentage, 100);
  
  // Status postępu
  const isComplete = userPointsNumber >= requiredPoints;
  const pointsLeft = Math.max(requiredPoints - userPointsNumber, 0);
  const progressStatusText = isComplete 
    ? 'Masz wystarczającą liczbę punktów!' 
    : `Brakuje Ci jeszcze ${pointsLeft} punktów`;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cardBackgroundColor },
        gutters.marginBottom_16,
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.gray100 }]} />
      )}
      <View 
        style={[
          styles.contentContainer,
          { backgroundColor: contentBackgroundColor },
          gutters.padding_16
        ]}
      >
        <Text style={[fonts.size_16, fonts.bold, { color: textNameColor }]}>
          {promotion.name || 'Bez nazwy'}
        </Text>
        <View style={[layout.row, layout.itemsCenter, gutters.marginTop_16]}>
          <View style={[styles.pointsContainer, { backgroundColor: isDarkMode ? '#44427D' : '#E1E1EF' }]}>
            <Text style={[fonts.size_16, fonts.bold, { color: textPointsColor }]}>
              {promotion.requireRedeemedPoints} punktów
            </Text>
          </View>
        </View>
        
        {/* Pasek postępu */}
        <View style={[styles.progressBarContainer, gutters.marginTop_16]}>
          <View style={[
            styles.progressBarBackground,
            { backgroundColor: progressBarBackgroundColor }
          ]}>
            <View 
              style={[
                styles.progressBarFilled,
                { 
                  backgroundColor: progressBarFilledColor,
                  width: `${progressPercentage}%`
                }
              ]}
            />
          </View>
          <Text 
            style={[
              fonts.size_12, 
              gutters.marginTop_12, 
              { color: isComplete ? progressBarFilledColor : textHeadlineColor }
            ]}
          >
            {progressStatusText}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    height: 150,
    width: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 150,
    width: '100%',
  },
  contentContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  pointsContainer: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    borderRadius: 4,
  }
});

export default PromotionCard; 
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useTheme } from '@/theme';
import { QRCodeDrawer } from '@/components/molecules';

// Interfejs dla danych promocji
export interface PromotionItem {
  uuid: string;
  name?: string;
  code: string;
  requireRedeemedPoints: number;
  status?: string;
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
  clientID?: string;
  onRedeem?: (promotionId: string) => void;
  onRefresh?: () => void;
  email?: string;
}

const PromotionCard = ({ promotion, userPoints = '0', clientID, onRedeem, onRefresh, email }: PromotionCardProps) => {
  const { colors, fonts, gutters, layout, variant } = useTheme();
  const [qrDrawerVisible, setQrDrawerVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Pobierz URL obrazu z obrazów typu 'thumbnail'
  const imageUrl = promotion.images?.find(img => img.type === 'thumbnail')?.url;
  
  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  const textNameColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const textHeadlineColor = isDarkMode ? '#E0E0E0' : colors.gray400;
  const textPointsColor = isDarkMode ? '#A6A4F0' : colors.purple500;
  const cardBackgroundColor = isDarkMode ? '#252732' : colors.gray50;
  const contentBackgroundColor = isDarkMode ? '#1B1A23' : '#FFFFFF';
  const skeletonBaseColor = isDarkMode ? '#373945' : '#E5E5E5';
  
  // Kolory dla paska postępu
  const progressBarBackgroundColor = isDarkMode ? '#373945' : '#E5E5E5';
  const progressBarFilledColor = isDarkMode ? '#A6A4F0' : colors.purple500;
  
  // Obliczanie postępu
  const userPointsNumber = parseInt(userPoints, 10) || 0;
  const requiredPoints = promotion.requireRedeemedPoints || 0;
  let progressPercentage = (userPointsNumber / requiredPoints) * 100;
  
  // Ograniczamy postęp do maksymalnie 100%
  progressPercentage = Math.min(progressPercentage, 100);
  
  // Status promocji i postępu
  const isActive = promotion.status === 'ACTIVE';
  const isComplete = isActive || userPointsNumber >= requiredPoints;
  const pointsLeft = Math.max(requiredPoints - userPointsNumber, 0);
  const progressStatusText = isActive 
    ? 'Promocja aktywna' 
    : isComplete 
      ? 'Masz wystarczającą liczbę punktów!' 
      : `Brakuje Ci jeszcze ${pointsLeft} punktów`;

  const handleRedeem = () => {
    if (isComplete) {
      setQrDrawerVisible(true);
      if (onRedeem) {
        onRedeem(promotion.uuid);
      }
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View
        style={[
          styles.container,
          { backgroundColor: cardBackgroundColor },
          gutters.marginBottom_16,
        ]}
      >
        {imageUrl ? (
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View style={[styles.imagePlaceholder, { backgroundColor: skeletonBaseColor }]} />
            )}
            <Animated.View style={{ opacity: fadeAnim, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.image} 
                onLoad={handleImageLoad}
                resizeMethod="resize"
              />
            </Animated.View>
          </View>
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
          <View style={[layout.row, layout.itemsCenter, layout.justifyBetween, gutters.marginTop_16]}>
            <View style={[styles.pointsContainer, { backgroundColor: isDarkMode ? '#44427D' : '#E1E1EF' }]}>
              <Text style={[fonts.size_16, fonts.bold, { color: textPointsColor }]}>
                {promotion.requireRedeemedPoints} punktów
              </Text>
            </View>
            
            {isComplete && (
              <TouchableOpacity 
                style={[
                  styles.buttonContainer, 
                  { backgroundColor: progressBarFilledColor }
                ]} 
                onPress={handleRedeem}
              >
                <Text style={[fonts.size_16, fonts.bold, { color: '#FFFFFF' }]}>
                  Wykorzystaj
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Pasek postępu - nie pokazujemy dla aktywnych promocji */}
          {!isActive && (
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
          )}
        </View>
      </View>

      <QRCodeDrawer 
        isVisible={qrDrawerVisible}
        onClose={() => setQrDrawerVisible(false)}
        promotionId={promotion.uuid}
        clientID={clientID}
        onRefresh={onRefresh}
        status={promotion.status}
        promotionName={promotion.name}
        requiredPoints={promotion.requireRedeemedPoints}
        promotionCode={promotion.code}
        email={email}
      />
    </>
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
  imageContainer: {
    height: 150,
    width: '100%',
    position: 'relative',
  },
  image: {
    height: '100%',
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
  },
  buttonContainer: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
});

export default PromotionCard; 
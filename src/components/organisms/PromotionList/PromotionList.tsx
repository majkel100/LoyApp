import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Switch, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme';

import PromotionCard, { PromotionItem } from '@/components/molecules/PromotionCard';

interface PromotionListProps {
  promotions: PromotionItem[];
  isLoading?: boolean;
  userPoints?: string;
  clientID?: string;
  onRefresh?: () => void;
  email?: string;
}

// Szacowana wysokość całego ekranu (minus inne elementy UI)
const SCREEN_HEIGHT = Dimensions.get('window').height * 0.7;

const PromotionList = ({ promotions, isLoading = false, userPoints = '0', clientID, onRefresh, email }: PromotionListProps) => {
  const { fonts, gutters, colors, variant } = useTheme();
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  // Inicjalizacja animacji dla efektu ładowania
  const [pulseAnim] = useState(new Animated.Value(0));
  const [visiblePromotions, setVisiblePromotions] = useState<PromotionItem[]>([]);
  const prevPromotionsRef = useRef<PromotionItem[]>([]);
  // Animacja przejścia dla płynnej zmiany
  const [fadeAnim] = useState(new Animated.Value(1));

  const isDarkMode = variant === 'dark';
  const textNameColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const switchTrackColor = { false: isDarkMode ? '#373945' : '#E5E5E5', true: isDarkMode ? '#A6A4F0' : colors.purple500 };
  const switchThumbColor = isDarkMode ? '#FFFFFF' : '#FFFFFF';
  const loadingBaseColor = isDarkMode ? '#373945' : '#E5E5E5';
  const loadingHighlightColor = isDarkMode ? '#4A4C5C' : '#F5F5F5';

  // Uruchomienie animacji pulsowania
  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(0);
    }
  }, [isLoading, pulseAnim]);

  // Interpolacja koloru tła ładowania
  const loadingBgColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [loadingBaseColor, loadingHighlightColor],
  });

  useEffect(() => {
    // Zachowaj poprzednie dane podczas ładowania
    if (!isLoading && promotions && promotions.length > 0) {
      // Jeśli dane się zmieniły, wykonaj animację przejścia
      if (JSON.stringify(visiblePromotions) !== JSON.stringify(promotions)) {
        // Najpierw ukryj aktualny widok
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          // Aktualizuj dane
          prevPromotionsRef.current = promotions;
          setVisiblePromotions(promotions);
          
          // Pokaż nowy widok
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Jeśli dane się nie zmieniły, po prostu je zapisz
        prevPromotionsRef.current = promotions;
        setVisiblePromotions(promotions);
      }
    } else if (isLoading && prevPromotionsRef.current.length > 0) {
      // Podczas ładowania pokazuj poprzednie dane aby uniknąć migotania
      setVisiblePromotions(prevPromotionsRef.current);
    }
  }, [isLoading, promotions]);

  // Funkcja obsługująca odświeżanie
  const handleRefresh = () => {
    if (onRefresh && !isLoading) {
      onRefresh();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, gutters.padding_16]}>
        <View style={styles.loadingHeader}>
          <Animated.View 
            style={[
              styles.loadingTitle, 
              { backgroundColor: loadingBgColor }
            ]} 
          />
          <Animated.View 
            style={[
              styles.loadingSwitch, 
              { backgroundColor: loadingBgColor }
            ]} 
          />
        </View>
        
        {[...Array(10)].map((_, index) => (
          <Animated.View 
            key={index}
            style={[
              styles.loadingCard, 
              { backgroundColor: loadingBgColor }
            ]} 
          />
        ))}
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
    ? visiblePromotions.filter(promotion => userPointsNumber >= (promotion.requireRedeemedPoints || 0))
    : visiblePromotions;

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
      
      <Animated.View style={{ opacity: fadeAnim }}>
        {filteredPromotions.map((promotion) => (
          <PromotionCard 
            key={promotion.uuid} 
            promotion={promotion} 
            userPoints={userPoints}
            clientID={clientID}
            onRefresh={onRefresh}
            email={email}
          />
        ))}
      </Animated.View>
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
  loadingContainer: {
    width: '100%',
    height: 2000,
  },
  loadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingTitle: {
    width: '40%',
    height: 50,
    borderRadius: 8,
  },
  loadingSwitch: {
    width: '40%',
    height: 50,
    borderRadius: 12,
  },
  loadingCard: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default PromotionList; 
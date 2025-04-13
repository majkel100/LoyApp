import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme';

export interface CustomerData {
  points: string;
  firstName: string;
}

interface CustomerCardProps {
  customerData?: CustomerData;
  isLoading?: boolean;
  onRefresh?: () => void;
}

// Stała wysokość komponentu
const CARD_HEIGHT = 95;

const CustomerCard = ({ customerData, isLoading = false, onRefresh }: CustomerCardProps) => {
  const { colors, fonts, gutters, layout, variant } = useTheme();
  // Inicjalizacja animacji dla efektu ładowania
  const [pulseAnim] = useState(new Animated.Value(0));
  const [displayData, setDisplayData] = useState<CustomerData | undefined>(customerData);
  const prevDataRef = useRef<CustomerData | undefined>(undefined);
  // Animacja płynnego przejścia
  const [fadeAnim] = useState(new Animated.Value(1));

  // Efekt do obsługi zachowania danych podczas ładowania
  useEffect(() => {
    if (!isLoading && customerData) {
      // Jeśli dane się zmieniły, wykonaj animację przejścia
      if (JSON.stringify(displayData) !== JSON.stringify(customerData)) {
        // Najpierw ukryj aktualny widok
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          // Aktualizuj dane
          prevDataRef.current = customerData;
          setDisplayData(customerData);
          
          // Pokaż nowy widok
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }).start();
        });
      } else {
        // Jeśli dane się nie zmieniły, po prostu je zapisz
        prevDataRef.current = customerData;
        setDisplayData(customerData);
      }
    } else if (isLoading && prevDataRef.current) {
      // Podczas ładowania używaj poprzednich danych, aby uniknąć migotania
      setDisplayData(prevDataRef.current);
    }
  }, [isLoading, customerData]);

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

  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  const textNameColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const textPointsColor = isDarkMode ? '#A6A4F0' : colors.purple500;
  const loadingBaseColor = isDarkMode ? '#373945' : '#E5E5E5';
  const loadingHighlightColor = isDarkMode ? '#4A4C5C' : '#F5F5F5';
  const pointsBackgroundColor = isDarkMode ? '#44427D' : '#E1E1EF';

  // Interpolacja koloru tła ładowania
  const loadingBgColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [loadingBaseColor, loadingHighlightColor],
  });

  // Nazwa użytkownika lub domyślnie "Hej!"
  const greeting = displayData?.firstName ? `Hej ${displayData.firstName}!` : 'Hej!';
  const points = displayData?.points || '0';

  // Funkcja obsługująca dotknięcie karty punktów
  const handleRefresh = () => {
    if (onRefresh && !isLoading) {
      onRefresh();
    }
  };

  return (
    <View
      style={[
        styles.container,
        gutters.marginBottom_16,
        gutters.marginLeft_16,
        gutters.marginRight_24
      ]}
    >
      {!displayData || (isLoading && !prevDataRef.current) ? (
        <View style={[styles.loadingContainer, { height: CARD_HEIGHT }]}>
          <Animated.View 
            style={[
              styles.loadingGreeting, 
              { backgroundColor: loadingBgColor }
            ]} 
          />
          <Animated.View 
            style={[
              styles.loadingPoints, 
              { backgroundColor: loadingBgColor }
            ]} 
          />
        </View>
      ) : (
        <Animated.View 
          style={[
            styles.contentWrapper, 
            { height: CARD_HEIGHT, opacity: fadeAnim }
          ]}
        >
          <Text 
            style={[fonts.size_24, fonts.bold, { color: textNameColor }, styles.greetingText]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {displayData?.firstName ? (
              <>
                <Text style={{ color: textPointsColor }}>Hej,</Text>
                <Text> {displayData.firstName}!</Text>
              </>
            ) : (
              <>
                <Text style={{ color: textPointsColor }}>Hej</Text>
                <Text>!</Text>
              </>
            )}
          </Text>
          <TouchableOpacity 
            style={[styles.pointsContainer, { backgroundColor: pointsBackgroundColor }]}
            onPress={handleRefresh}
            disabled={isLoading || !onRefresh}
          >
            <Text 
              style={[fonts.size_16, fonts.bold, { color: textPointsColor }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {points} punktów
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  contentWrapper: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'center',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    minWidth: '40%',
    maxWidth: '60%',
  },
  greetingText: {
    maxWidth: '45%',
    marginRight: 8,
    flexShrink: 1
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  loadingGreeting: {
    width: '40%',
    height: 40,
    borderRadius: 8,
  },
  loadingPoints: {
    width: '40%',
    height: 45,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }
});

export default CustomerCard; 
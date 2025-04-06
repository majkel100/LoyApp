import React from 'react';
import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { useTheme } from '@/theme';

export interface CustomerData {
  points: string;
  firstName: string;
}

interface CustomerCardProps {
  customerData?: CustomerData;
  isLoading?: boolean;
}

// Stała wysokość komponentu
const CARD_HEIGHT = 95;

const CustomerCard = ({ customerData, isLoading = false }: CustomerCardProps) => {
  const { colors, fonts, gutters, layout, variant } = useTheme();
  // Inicjalizacja animacji dla efektu ładowania
  const [pulseAnim] = React.useState(new Animated.Value(0));

  // Uruchomienie animacji pulsowania
  React.useEffect(() => {
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
  const greeting = customerData?.firstName ? `Hej ${customerData.firstName}!` : 'Hej!';
  const points = customerData?.points || '0';

  return (
    <View
      style={[
        styles.container,
        gutters.marginBottom_16,
        gutters.marginLeft_16,
        gutters.marginRight_24
      ]}
    >
      {isLoading ? (
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
        <View style={[styles.contentWrapper, { height: CARD_HEIGHT }]}>
          <Text 
            style={[fonts.size_24, fonts.bold, { color: textNameColor }, styles.greetingText]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {greeting}
          </Text>
          <View style={[styles.pointsContainer, { backgroundColor: pointsBackgroundColor }]}>
            <Text 
              style={[fonts.size_16, fonts.bold, { color: textPointsColor }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {points} punktów
            </Text>
          </View>
        </View>
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
    height: 28,
    borderRadius: 8,
  },
  loadingPoints: {
    width: '35%',
    height: 45,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }
});

export default CustomerCard; 
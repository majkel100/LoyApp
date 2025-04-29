import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { useTheme } from '@/theme';
import { CarouselItemDisplay } from '@/services/synerise';
import CarouselDrawer from '../CarouselDrawer/CarouselDrawer';

interface CarouselProps {
  items: CarouselItemDisplay[];
  isLoading: boolean;
  onRefresh?: () => void;
}

const { width } = Dimensions.get('window');

const Carousel: React.FC<CarouselProps> = ({ items, isLoading, onRefresh }) => {
  const { colors, fonts, gutters, variant } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CarouselItemDisplay | undefined>(undefined);
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  const cardBackground = isDarkMode ? '#252732' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const dotActiveColor = colors.purple500;
  const dotInactiveColor = isDarkMode ? '#444444' : '#DDDDDD';
  
  // Automatyczna zmiana slajdów
  useEffect(() => {
    if (items.length > 1) {
      startAutoScroll();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [items]);
  
  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 5000); // Zmiana co 5 sekund
  };
  
  const handleScroll = (event: any) => {
    // Zatrzymaj automatyczne przewijanie podczas ręcznego przewijania
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
    
    // Rozpocznij ponownie automatyczne przewijanie po zakończeniu ręcznego
    startAutoScroll();
  };
  
  const handleCardPress = (item: CarouselItemDisplay) => {
    setSelectedItem(item);
    setShowDrawer(true);
    
    // Zatrzymaj automatyczne przewijanie gdy szuflada jest otwarta
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  const handleCloseDrawer = () => {
    setShowDrawer(false);
    // Wznów automatyczne przewijanie po zamknięciu szuflady
    startAutoScroll();
  };
  
  // Renderowanie wskaźników (kropek)
  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {items.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? dotActiveColor : dotInactiveColor,
                width: index === activeIndex ? 20 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };
  
  // Renderowanie karty karuzeli
  const renderCard = ({ item }: { item: CarouselItemDisplay }) => {
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: cardBackground,
              width: width - 48, // Uwzględnienie marginesów
            },
          ]}
          onPress={() => handleCardPress(item)}
          activeOpacity={0.9}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={[gutters.padding_16]}>
            <Text
              style={[fonts.size_16, fonts.bold, { color: textColor }]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.purple500} />
      </View>
    );
  }
  
  if (items.length === 0) {
    return null;
  }
  
  return (
    <View style={styles.carouselWrapper}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={items}
          renderItem={renderCard}
          keyExtractor={(item, index) => `carousel-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          snapToInterval={width - 32} // Uwzględnienie marginesów
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 12 }} // Dopasowanie do paddingHorizontal w cardContainer
        />
        {items.length > 1 && renderDots()}
        
        <CarouselDrawer
          isVisible={showDrawer}
          onClose={handleCloseDrawer}
          item={selectedItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    marginVertical: 16,
  },
  container: {
  },
  cardContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loadingContainer: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Carousel; 
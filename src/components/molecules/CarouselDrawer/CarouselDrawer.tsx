import React, { useEffect, useRef } from 'react';
import { 
  Animated, 
  Dimensions, 
  Image,
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View 
} from 'react-native';
import { useTheme } from '@/theme';
import { CarouselItemDisplay } from '@/services/synerise';

interface CarouselDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  item?: CarouselItemDisplay;
}

const CarouselDrawer: React.FC<CarouselDrawerProps> = ({ 
  isVisible, 
  onClose,
  item
}) => {
  const { colors, fonts, gutters, variant } = useTheme();
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const { height } = Dimensions.get('window');
  
  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  
  // Kolory dla dark theme z lepszym kontrastem
  const backgroundColor = isDarkMode ? '#1B1A23' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const secondaryTextColor = isDarkMode ? '#AAAAAA' : colors.gray200;
  const closeButtonColor = isDarkMode ? colors.purple500 : colors.purple500;
  const closeButtonTextColor = '#FFFFFF';
  const handleColor = isDarkMode ? '#44427D' : '#CCCCCC';
  const overlayColor = 'rgba(0, 0, 0, 0.7)';
  
  useEffect(() => {
    if (isVisible) {
      Animated.timing(drawerAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);
  
  const translateY = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const handleCloseDrawer = () => {
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };
  
  if (!isVisible || !item) return null;

  return (
    <Modal transparent visible={isVisible} animationType="none" onRequestClose={handleCloseDrawer}>
      <TouchableWithoutFeedback onPress={handleCloseDrawer}>
        <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.drawer,
                {
                  backgroundColor,
                  transform: [{ translateY }],
                },
              ]}
            >
              <View style={[styles.handle, { backgroundColor: handleColor }]} />
              <View style={[gutters.padding_24]}>
                {item.image && (
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: item.image }} 
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}
                
                <Text style={[fonts.size_24, fonts.bold, { color: textColor }, gutters.marginTop_16]}>
                  {item.title}
                </Text>
                
                <Text style={[
                  fonts.size_16, 
                  { color: secondaryTextColor, lineHeight: 24 }, 
                  gutters.marginTop_16,
                  gutters.marginBottom_24
                ]}>
                  {item.description}
                </Text>
                
                <TouchableOpacity 
                  onPress={handleCloseDrawer}
                  style={[
                    styles.closeButton,
                    { backgroundColor: closeButtonColor },
                    gutters.marginTop_16
                  ]}
                >
                  <Text style={[fonts.size_16, fonts.bold, { color: closeButtonTextColor, textAlign: 'center' }]}>
                    Zamknij
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    maxHeight: '80%',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default CarouselDrawer; 
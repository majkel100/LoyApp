import React, { useEffect, useRef } from 'react';
import { 
  Animated, 
  Dimensions, 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View 
} from 'react-native';
import { useTheme } from '@/theme';
import QRCode from 'react-native-qrcode-svg';

interface QRCodeDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  promotionId?: string;
}

const QRCodeDrawer: React.FC<QRCodeDrawerProps> = ({ 
  isVisible, 
  onClose, 
  promotionId 
}) => {
  const { colors, fonts, gutters, variant } = useTheme();
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const { height } = Dimensions.get('window');
  
  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  
  // Kolory dla dark theme z lepszym kontrastem
  const backgroundColor = isDarkMode ? '#1B1A23' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : colors.gray800;
  const qrBackgroundColor = isDarkMode ? '#252732' : colors.gray50;
  const qrContainerBorder = isDarkMode ? '#44427D' : 'transparent';
  const qrColor = isDarkMode ? '#000000' : colors.gray800;
  const qrBackground = '#FFFFFF';
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
  }, [isVisible, promotionId]);
  
  const translateY = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });
  
  if (!isVisible) return null;
  
  return (
    <Modal transparent visible={isVisible} animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
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
                <Text style={[fonts.size_24, fonts.bold, { color: textColor, textAlign: 'center' }, gutters.marginBottom_16]}>
                  Twój kod QR
                </Text>
                
                <View style={[
                  styles.qrContainer, 
                  { 
                    backgroundColor: qrBackgroundColor,
                    borderColor: qrContainerBorder,
                    borderWidth: isDarkMode ? 1 : 0
                  }
                ]}>
                  <View style={[
                    styles.qrCode,
                    { 
                      backgroundColor: qrBackground,
                      borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      borderWidth: 1
                    }
                  ]}>
                    <QRCode
                      value={promotionId || ''}
                      size={200}
                      color={qrColor}
                      backgroundColor={qrBackground}
                    />
                  </View>
                  <Text style={[fonts.size_12, { color: textColor, marginTop: 20 }]}>
                    Kod promocji: {promotionId?.substring(0, 8)}
                  </Text>
                </View>
                
                <Text style={[
                  fonts.size_12, 
                  gutters.marginTop_24, 
                  gutters.marginBottom_24,
                  { color: textColor, textAlign: 'center' }
                ]}>
                  Pokaż ten kod pracownikowi aby zrealizować promocję
                </Text>
                
                <TouchableOpacity 
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    { backgroundColor: closeButtonColor }
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
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    aspectRatio: 1,
    maxWidth: '100%',
  },
  qrCode: {
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
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

export default QRCodeDrawer; 
import React, { useEffect, useRef, useState } from 'react';
import { 
  Animated, 
  Dimensions, 
  Modal, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View,
  ActivityIndicator 
} from 'react-native';
import { Buffer } from 'buffer';
import { useTheme } from '@/theme';
import QRCode from 'react-native-qrcode-svg';
import { activatePromotionByUUID, deactivatePromotionByUUID } from '@/services/synerise';

interface QRCodeDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  promotionId?: string;
  clientID?: string;
  onRefresh?: () => void;
  status?: 'ACTIVE' | 'ASSIGNED' | string;
  promotionName?: string;
  requiredPoints?: number;
  promotionCode?: string;
  email?: string;
}

const QRCodeDrawer: React.FC<QRCodeDrawerProps> = ({ 
  isVisible, 
  onClose, 
  promotionId,
  clientID,
  onRefresh,
  status = '',
  promotionName = '',
  requiredPoints = 0,
  promotionCode = '',
  email = ''
}) => {
  const { colors, fonts, gutters, variant } = useTheme();
  const drawerAnimation = useRef(new Animated.Value(0)).current;
  const { height } = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const [showQRCode, setShowQRCode] = useState(status === 'ACTIVE');
  const [shouldRefreshOnClose, setShouldRefreshOnClose] = useState(false);
  
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
  const cancelButtonColor = isDarkMode ? '#44427D' : colors.gray100;
  const closeButtonTextColor = '#FFFFFF';
  const handleColor = isDarkMode ? '#44427D' : '#CCCCCC';
  const overlayColor = 'rgba(0, 0, 0, 0.7)';
  const successColor = isDarkMode ? '#4CAF50' : '#4CAF50';
  const errorColor = isDarkMode ? '#F44336' : '#F44336';
  
  // Tworzenie wartości kodu QR jako obiekt JSON enkodowany do base64
  const getQRValue = () => {
    const qrData = {
      type: "promotion",
      promotionName: promotionName,
      promotionCode: promotionCode,
      clientId: clientID || '',
      email: email
    };
    console.log(qrData);
    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  };
  
  useEffect(() => {
    if (isVisible) {
      setShowQRCode(status === 'ACTIVE');
      setMessage(null);
      setShouldRefreshOnClose(false);
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
  }, [isVisible, status, promotionId]);
  
  const translateY = drawerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const handleCloseDrawer = () => {
    // Najpierw animujemy zamknięcie, a dopiero później odświeżamy dane
    Animated.timing(drawerAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Po zakończeniu animacji wywołujemy onClose
      onClose();
      
      // A następnie, jeśli potrzeba, odświeżamy dane
      if (shouldRefreshOnClose && onRefresh) {
        // Małe opóźnienie, aby UI zdążyło się zamknąć przed odświeżeniem
        setTimeout(() => {
          onRefresh();
        }, 100);
      }
    });
  };

  const handleActivatePromotion = async () => {
    if (!promotionId) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      await activatePromotionByUUID(promotionId);
      setShowQRCode(true);
      setShouldRefreshOnClose(true);
    } catch (error) {
      console.error('Błąd podczas aktywacji promocji:', error);
      setMessage({
        text: 'Ups, coś poszło nie tak',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivatePromotion = async () => {
    if (!promotionId) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      await deactivatePromotionByUUID(promotionId);
      setMessage({
        text: 'Promocja deaktywowana',
        type: 'success'
      });
      setShowQRCode(false);
      setShouldRefreshOnClose(true);
    } catch (error) {
      console.error('Błąd podczas deaktywacji promocji:', error);
      setMessage({
        text: 'Ups, coś poszło nie tak',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isVisible) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDarkMode ? colors.purple500 : colors.purple500} />
          <Text style={[fonts.size_16, { color: textColor, marginTop: 16 }]}>
            Proszę czekać...
          </Text>
        </View>
      );
    }

    if (message && !showQRCode) {
      return (
        <View style={styles.messageContainer}>
          <Text style={[
            fonts.size_16, 
            fonts.bold, 
            { 
              color: message.type === 'success' ? successColor : errorColor,
              textAlign: 'center'
            }
          ]}>
            {message.text}
          </Text>
        </View>
      );
    }

    if (status === 'ASSIGNED' && !showQRCode) {
      return (
        <View style={styles.assignedContainer}>
          <Text style={[fonts.size_16, fonts.bold, { color: textColor, textAlign: 'center' }]}>
            {promotionName}
          </Text>
          <Text style={[fonts.size_16, { color: textColor, marginTop: 8, textAlign: 'center' }]}>
            {requiredPoints} punktów
          </Text>
          
          <View style={gutters.marginTop_24}>
            <Text style={[fonts.size_16, { color: textColor, textAlign: 'center', marginBottom: 24 }]}>
              Czy chcesz aktywować promocję? Aktywacja promocji pobierze punkty z konta.
            </Text>
            
            <TouchableOpacity 
              onPress={handleActivatePromotion}
              style={[
                styles.actionButton,
                { backgroundColor: closeButtonColor }
              ]}
            >
              <Text style={[fonts.size_16, fonts.bold, { color: closeButtonTextColor, textAlign: 'center' }]}>
                Aktywuj promocję
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Dla statusu ACTIVE lub po aktywacji
    return (
      <>
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
              value={getQRValue()}
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
          gutters.marginBottom_16,
          { color: textColor, textAlign: 'center' }
        ]}>
          Pokaż ten kod pracownikowi aby zrealizować promocję
        </Text>
        
        {status === 'ACTIVE' && (
          <TouchableOpacity 
            onPress={handleDeactivatePromotion}
            style={[
              styles.secondaryButton,
              { backgroundColor: cancelButtonColor }
            ]}
          >
            <Text style={[fonts.size_16, fonts.bold, { color: closeButtonTextColor, textAlign: 'center' }]}>
              Rozmyśliłem się
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };
  
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
                {renderContent()}
                
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
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButton: {
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    paddingHorizontal: 16,
  },
  assignedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});

export default QRCodeDrawer; 
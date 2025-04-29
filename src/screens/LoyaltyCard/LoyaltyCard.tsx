import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { useTheme } from '@/theme';
import { getDocument } from '@/services/synerise';
import QRCode from 'react-native-qrcode-svg';
import { Buffer } from 'buffer';

function LoyaltyCard() {
  const { fonts, gutters, colors, layout, variant } = useTheme();
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pobieranie danych karty lojalnościowej
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        setIsLoading(true);
        
        // Pobierz dane klienta
        const documentCustomerData = await getDocument('customer-data');
        if (documentCustomerData && documentCustomerData.content) {
          const firstName = documentCustomerData.content.firstName || null;
          const userClientId = documentCustomerData.content.clientId || null;
          const userEmail = documentCustomerData.content.email || null;
          
          setCustomerName(firstName);
          setClientId(userClientId);
          setEmail(userEmail);
          
          // Tworzenie obiektu danych dla kodu QR
          if (userClientId && userEmail) {
            const qrObject = {
              type: "entry",
              clientId: userClientId,
              email: userEmail
            };
            
            // Enkodowanie obiektu do base64
            const qrJsonString = JSON.stringify(qrObject);
            const qrBase64 = Buffer.from(qrJsonString).toString('base64');
            setQrCodeData(qrBase64);
            console.log(qrBase64);
          }
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych lojalnościowych:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyData();
  }, []);

  // Dostosuj kolory w zależności od motywu
  const isDarkMode = variant === 'dark';
  const clientIdBackgroundColor = isDarkMode ? colors.purple500 : colors.purple100;
  const clientIdTextColor = isDarkMode ? colors.gray50 : colors.purple500;

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={[styles.container, gutters.paddingHorizontal_32]}>
          <Text style={[fonts.size_32, fonts.bold, styles.title, fonts.gray800]}>
            Twoja karta lojalnościowa
          </Text>
          
          <View style={[styles.cardContainer, { backgroundColor: colors.purple100 }]}>
            {isLoading ? (
              <View style={[styles.loadingContainer, layout.justifyCenter, layout.itemsCenter]}>
                <ActivityIndicator size="large" color={colors.purple500} />
                <Text style={[fonts.size_16, styles.loadingText, fonts.gray200]}>
                  Ładowanie karty...
                </Text>
              </View>
            ) : (
              <>
                <Text style={[fonts.size_16, fonts.bold, fonts.gray800]}>
                  {customerName ? `${customerName}` : 'Użytkownik'}
                </Text>
                
                <View style={[styles.qrContainer, { 
                  backgroundColor: '#fff',
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }]}>
                  {qrCodeData ? (
                    <QRCode
                      value={qrCodeData}
                      size={200}
                      backgroundColor="white"
                      color="black"
                    />
                  ) : (
                    <Text style={[styles.qrText, fonts.gray200]}>
                      Nie można wygenerować kodu QR
                    </Text>
                  )}
                </View>
                
                {clientId && (
                  <View style={[styles.clientIdContainer, { backgroundColor: clientIdBackgroundColor }]}>
                    <Text style={[fonts.size_16, styles.clientIdLabel, { color: clientIdTextColor }]}>
                      Twój identyfikator
                    </Text>
                    <Text style={[fonts.size_16, fonts.bold, styles.clientIdText, { color: clientIdTextColor }]}>
                      {clientId}
                    </Text>
                  </View>
                )}
                
                <Text style={[fonts.size_16, styles.infoText, fonts.gray200]}>
                  Pokaż ten kod przy kasie, aby zbierać i wykorzystywać punkty
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  cardContainer: {
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  qrContainer: {
    width: 240,
    height: 240,
    margin: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  qrText: {
    textAlign: 'center',
  },
  clientIdContainer: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: '90%',
    alignItems: 'center',
  },
  clientIdText: {
    textAlign: 'center',
  },
  clientIdLabel: {
    marginBottom: 4,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 24,
    minHeight: 300,
  },
  loadingText: {
    marginTop: 12,
  }
});

export default LoyaltyCard; 
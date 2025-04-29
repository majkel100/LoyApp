import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';
import { useI18n } from '@/hooks';
import { CustomerCard, Carousel } from '@/components/molecules';
import { CustomerData } from '@/components/molecules/CustomerCard';
import { SafeScreen } from '@/components/templates';
import { PromotionList } from '@/components/organisms';
import { PromotionItem } from '@/components/molecules/PromotionCard';
import { getAllPromotions, getDocument, generateScreenView, CarouselItemDisplay } from '@/services/synerise';
import { AssetByVariant, IconByVariant, Skeleton } from '@/components/atoms';

function Home() {
  const { t } = useTranslation();
  const { toggleLanguage } = useI18n();
  const {
    gutters,
    fonts,
    colors,
    components,
    layout,
    changeTheme,
    variant,
  } = useTheme();

  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | undefined>(undefined);
  const [clientID, setClientID] = useState<string | undefined>(undefined);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  const [refreshInProgress, setRefreshInProgress] = useState(false);
  const [carouselItems, setCarouselItems] = useState<CarouselItemDisplay[]>([]);
  const [isLoadingCarousel, setIsLoadingCarousel] = useState(false);

  // Pobieranie promocji przy montowaniu komponentu
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Funkcja do pobierania promocji
  const fetchPromotions = async () => {
    try {
      setIsLoadingPromotions(true);
      
      // Dodanie sztucznego opóźnienia do testów
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await getAllPromotions();

      if (response && response.items) {
        setPromotions(response.items);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania promocji:', error);
    } finally {
      setIsLoadingPromotions(false);
    }
  };

  // Funkcja do pobierania danych klienta
  const fetchCustomerData = async () => {
    try {
      setIsLoadingCustomerData(true);
      
      const documentFirstname = await getDocument('customer-data');
      const documentPoints = await getDocument('loyalty-points');
      const { firstName, clientId, email } = documentFirstname.content;
      const { points } = documentPoints.content;

      if (firstName || points) {
        setCustomerData({
          firstName: firstName || '',
          points: points || '0',
          email: email || ''
        });
      }
      
      if (clientId) {
        setClientID(clientId);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych klienta:', error);
    } finally {
      setIsLoadingCustomerData(false);
    }
  };

  // Funkcja do pobierania danych karuzeli
  const fetchCarouselData = async () => {
    try {
      setIsLoadingCarousel(true);
      
      const response = await generateScreenView('carousel');
      console.log('Odpowiedź z karuzeli:', JSON.stringify(response));
      
      if (response && response.data && response.data.collection) {
        // Konwertujemy strukturę elementów karuzeli na format oczekiwany przez komponent
        const items = response.data.collection.map(item => ({
          title: item.content.title,
          description: item.content.description,
          image: item.content.image
        }));
        setCarouselItems(items);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych karuzeli:', error);
      setCarouselItems([]); // Zapewnij pusty stan w przypadku błędu
    } finally {
      setIsLoadingCarousel(false);
    }
  };

  // Pobieranie danych przy montowaniu komponentu
  useEffect(() => {
    fetchCustomerData();
    fetchCarouselData();
  }, []);

  const onChangeTheme = () => {
    changeTheme(variant === 'default' ? 'dark' : 'default');
  };

  // Funkcja do odświeżania wszystkich danych
  const handleRefreshData = () => {
    if (refreshInProgress) return;

    setRefreshInProgress(true);
    fetchCustomerData();
    fetchPromotions().finally(() => {
      setRefreshInProgress(false);
    });
  };

  return (
    <SafeScreen>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Karta z danymi klienta */}
        <View style={[gutters.marginTop_24]}>
          <CustomerCard
            customerData={customerData}
            isLoading={isLoadingCustomerData}
            onRefresh={handleRefreshData}
          />
        </View>

        {/* Karuzela */}
        <View style={[gutters.marginTop_16]}>
          <Carousel
            items={carouselItems}
            isLoading={isLoadingCarousel}
            onRefresh={handleRefreshData}
          />
        </View>

        {/* Lista promocji */}
        <View style={[gutters.marginTop_24]}>
          <PromotionList
            promotions={promotions}
            isLoading={isLoadingPromotions}
            userPoints={customerData?.points}
            clientID={clientID}
            onRefresh={handleRefreshData}
            email={customerData?.email}
          />
        </View>

        <View style={[gutters.paddingHorizontal_32, gutters.marginTop_40]}>
          <View style={[gutters.marginTop_40]}>
            <Text style={[fonts.size_40, fonts.gray800, fonts.bold]}>
              Ekran główny
            </Text>
            <Text
              style={[fonts.size_16, fonts.gray200, gutters.marginBottom_40]}
            >
              Witaj w aplikacji lojalnościowej
            </Text>
          </View>

          <View
            style={[
              layout.row,
              layout.justifyBetween,
              layout.fullWidth,
              gutters.marginTop_16,
              gutters.marginBottom_32,
            ]}
          >
            <Skeleton
              height={64}
              loading={false}
              style={{ borderRadius: components.buttonCircle.borderRadius }}
              width={64}
            >
              <TouchableOpacity
                onPress={() => {}}
                style={[components.buttonCircle, gutters.marginBottom_16]}
                testID="fetch-user-button"
              >
                <IconByVariant path={'send'} stroke={colors.purple500} />
              </TouchableOpacity>
            </Skeleton>

            <TouchableOpacity
              onPress={onChangeTheme}
              style={[components.buttonCircle, gutters.marginBottom_16]}
              testID="change-theme-button"
            >
              <IconByVariant path={'theme'} stroke={colors.purple500} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleLanguage}
              style={[components.buttonCircle, gutters.marginBottom_16]}
              testID="change-language-button"
            >
              <IconByVariant path={'language'} stroke={colors.purple500} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

export default Home; 
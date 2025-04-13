import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/theme';
import { useI18n, useUser } from '@/hooks';
import { getAllPromotions, PromotionsResponse, getDocument } from '@/services/synerise';
import { PromotionItem } from '@/components/molecules/PromotionCard';
import { CustomerCard } from '@/components/molecules';
import { CustomerData } from '@/components/molecules/CustomerCard';

import { AssetByVariant, IconByVariant, Skeleton } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';
import { PromotionList } from '@/components/organisms';

function Example() {
  const { t } = useTranslation();
  const { useFetchOneQuery } = useUser();
  const { toggleLanguage } = useI18n();

  const {
    backgrounds,
    changeTheme,
    colors,
    components,
    fonts,
    gutters,
    layout,
    variant,
  } = useTheme();

  const [currentId, setCurrentId] = useState(-1);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | undefined>(undefined);
  const [clientID, setClientID] = useState<string | undefined>(undefined);
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);
  const [refreshInProgress, setRefreshInProgress] = useState(false);
  const prevPromotionsRef = useRef<PromotionItem[]>([]);
  const prevCustomerDataRef = useRef<CustomerData | undefined>(undefined);

  const fetchOneUserQuery = useFetchOneQuery(currentId);

  useEffect(() => {
    if (fetchOneUserQuery.isSuccess) {
      Alert.alert(
        t('screen_example.hello_user', { name: fetchOneUserQuery.data.name }),
      );
    }
  }, [fetchOneUserQuery.isSuccess, fetchOneUserQuery.data, t]);

  // Pobieranie promocji przy montowaniu komponentu
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Funkcja do pobierania promocji
  const fetchPromotions = async () => {
    try {
      setIsLoadingPromotions(true);
      
      // Zachowaj poprzednie dane podczas ładowania nowych
      if (promotions.length > 0) {
        prevPromotionsRef.current = promotions;
      }
      
      // Dodanie sztucznego opóźnienia do testów
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await getAllPromotions();

      if (response && response.items) {
        setPromotions(response.items);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania promocji:', error);
      // W przypadku błędu, przywróć poprzednie dane
      if (prevPromotionsRef.current.length > 0) {
        setPromotions(prevPromotionsRef.current);
      }
    } finally {
      setIsLoadingPromotions(false);
    }
  };

  // Funkcja do pobierania danych klienta
  const fetchCustomerData = async () => {
    try {
      setIsLoadingCustomerData(true);
      
      // Zachowaj poprzednie dane podczas ładowania nowych
      if (customerData) {
        prevCustomerDataRef.current = customerData;
      }
      
      const documentFirstname = await getDocument('customer-data');
      const documentPoints = await getDocument('loyalty-points');
      const { firstName, clientId } = documentFirstname.content;
      const { points } = documentPoints.content;

      if (firstName || points) {
        setCustomerData({
          firstName: firstName || '',
          points: points || '0'
        });
      }
      
      // Ustaw clientID
      if (clientId) {
        setClientID(clientId);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania danych klienta:', error);
      // W przypadku błędu, przywróć poprzednie dane
      if (prevCustomerDataRef.current) {
        setCustomerData(prevCustomerDataRef.current);
      }
    } finally {
        setIsLoadingCustomerData(false);
    }
  };

  // Pobieranie dokumentu customer-data przy montowaniu komponentu
  useEffect(() => {
    fetchCustomerData();
  }, []);

  const onChangeTheme = () => {
    changeTheme(variant === 'default' ? 'dark' : 'default');
  };

  // Funkcja do odświeżania danych klienta i promocji
  const handleRefreshCustomerData = () => {
    if (refreshInProgress) return; // Zapobiegaj wielokrotnym odświeżeniom

    setRefreshInProgress(true);
    fetchCustomerData();
    fetchPromotions().finally(() => {
      setRefreshInProgress(false);
    });
  };

  return (
    <SafeScreen
      isError={fetchOneUserQuery.isError}
      onResetError={fetchOneUserQuery.refetch}
    >
      <ScrollView>
        {/* Karta z danymi klienta */}
        <View style={[gutters.marginTop_24]}>
          <CustomerCard
            customerData={customerData}
            isLoading={isLoadingCustomerData}
            onRefresh={handleRefreshCustomerData}
          />
        </View>

        {/* Przycisk do testowego odświeżania danych klienta */}
        <View style={[gutters.marginHorizontal_16, gutters.marginTop_16]}>
          <TouchableOpacity
            onPress={handleRefreshCustomerData}
            style={[
              {
                backgroundColor: colors.purple500,
                padding: 12,
                borderRadius: 8
              },
              layout.justifyCenter,
              layout.itemsCenter,
            ]}
            disabled={isLoadingCustomerData}
            testID="refresh-customer-data-button"
          >
            <Text style={[fonts.size_16, fonts.bold, { color: '#FFFFFF' }]}>
              Odśwież dane klienta (test)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista promocji */}
        <View style={[gutters.marginTop_24]}>
          <PromotionList
            promotions={promotions}
            isLoading={isLoadingPromotions}
            userPoints={customerData?.points}
            clientID={clientID}
            onRefresh={handleRefreshCustomerData}
          />
        </View>

        <View style={[gutters.paddingHorizontal_32, gutters.marginTop_40]}>
          <View style={[gutters.marginTop_40]}>
            <Text style={[fonts.size_40, fonts.gray800, fonts.bold]}>
              {t('screen_example.title')}
            </Text>
            <Text
              style={[fonts.size_16, fonts.gray200, gutters.marginBottom_40]}
            >
              {t('screen_example.description')}
            </Text>
          </View>

          <View
            style={[
              layout.row,
              layout.justifyBetween,
              layout.fullWidth,
              gutters.marginTop_16,
            ]}
          >
            <Skeleton
              height={64}
              loading={fetchOneUserQuery.isLoading}
              style={{ borderRadius: components.buttonCircle.borderRadius }}
              width={64}
            >
              <TouchableOpacity
                onPress={() => setCurrentId(Math.ceil(Math.random() * 9 + 1))}
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

export default Example;

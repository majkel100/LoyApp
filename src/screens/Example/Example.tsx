import { useEffect, useState } from 'react';
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
  const [isLoadingCustomerData, setIsLoadingCustomerData] = useState(false);

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
    const fetchPromotions = async () => {
      try {
        setIsLoadingPromotions(true);
        const response = await getAllPromotions();
        console.log('Pobrane promocje:', JSON.stringify(response, null, 2));

        if (response && response.items) {
          setPromotions(response.items);
        }
      } catch (error) {
        console.error('Błąd podczas pobierania promocji:', error);
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    fetchPromotions();
  }, []);

  // Pobieranie dokumentu customer-data przy montowaniu komponentu
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoadingCustomerData(true);
        const document = await getDocument('customer-data');
        console.log('Document:', JSON.stringify(document, null, 2));

        const { firstName, points } = document.content;
        console.log(`firstName=${firstName}, points=${points}`);
        setCustomerData({ firstName, points });

        if (firstName || points) {
          setCustomerData({
            firstName: firstName || '',
            points: points || '0'
          });
        }

      } catch (error) {
        console.error('Błąd podczas pobierania danych klienta:', error);
      } finally {
        setIsLoadingCustomerData(false);
      }
    };

    fetchCustomerData();
  }, []);

  const onChangeTheme = () => {
    changeTheme(variant === 'default' ? 'dark' : 'default');
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
          />
        </View>

        {/* Lista promocji */}
        <View style={[gutters.marginTop_24]}>
          <PromotionList
            promotions={promotions}
            isLoading={isLoadingPromotions}
            userPoints={customerData?.points}
          />
        </View>

        <View
          style={[
            layout.justifyCenter,
            layout.itemsCenter,
            gutters.marginTop_40,
          ]}
        >
          <View
            style={[layout.relative, backgrounds.limeGreen, components.circle250]}
          />

          <View style={[layout.absolute, gutters.paddingTop_80]}>
            <AssetByVariant
              path={'ampa'}
              resizeMode={'contain'}
              style={{ height: 300, width: 300 }}
            />
          </View>
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

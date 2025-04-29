import type { RootScreenProps } from '@/navigation/types';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { AssetByVariant } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';
import { initSyneriseWithCallback, isSignedIn } from '@/services/synerise';
import { initFcmAndRegisterWithSynerise } from '@/services/fcm';

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const { fonts, gutters, layout } = useTheme();
  const { t } = useTranslation();

  const { isError, isFetching, isSuccess, data } = useQuery({
    queryFn: async () => {
      // Inicjalizacja Synerise i FCM podczas uruchamiania aplikacji
      await initSyneriseWithCallback(async () => {
        // Po pełnej inicjalizacji Synerise, zainicjalizuj FCM
        await initFcmAndRegisterWithSynerise();
      });
      
      // Sprawdzenie, czy użytkownik jest zalogowany
      const userIsSignedIn = isSignedIn();
      return userIsSignedIn;
    },
    queryKey: ['startup'],
  });

  useEffect(() => {
    if (isSuccess) {
      // Jeśli użytkownik jest zalogowany, przenieś go do głównego ekranu
      // W przeciwnym razie przenieś go do ekranu logowania
      const targetScreen = data ? Paths.Main : Paths.Login;
      
      navigation.reset({
        index: 0,
        routes: [{ name: targetScreen }],
      });
    }
  }, [isSuccess, navigation, data]);

  return (
    <SafeScreen>
      <View
        style={[
          layout.flex_1,
          layout.col,
          layout.itemsCenter,
          layout.justifyCenter,
        ]}
      >
        <AssetByVariant
          path={'ampa'}
          resizeMode={'contain'}
          style={{ height: 300, width: 300 }}
        />
        {isFetching && (
          <ActivityIndicator size="large" style={[gutters.marginVertical_24]} />
        )}
        {isError && (
          <Text style={[fonts.size_16, fonts.red500]}>{t('common_error')}</Text>
        )}
      </View>
    </SafeScreen>
  );
}

export default Startup;

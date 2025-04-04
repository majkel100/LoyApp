import 'react-native-gesture-handler';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MMKV } from 'react-native-mmkv';
import { isSyneriseAlreadyInitialized } from '@/services/synerise';

import { ThemeProvider } from '@/theme';
import ApplicationNavigator from '@/navigation/Application';

import '@/translations';
import { useEffect, useState } from 'react';
export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

export const storage = new MMKV();

// Nie inicjalizujemy Synerise tutaj - to zostanie zrobione w komponencie Startup
// Ale sprawdzamy czy było już zainicjalizowane (np. przez powiadomienie)
if (isSyneriseAlreadyInitialized()) {
  console.log('Synerise już zainicjalizowane przy starcie aplikacji');
}

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Oznaczamy, że aplikacja jest zainicjalizowana
    setIsInitialized(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider storage={storage}>
          <ApplicationNavigator />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;

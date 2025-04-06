import { Synerise } from 'react-native-synerise-sdk';
import { Platform } from 'react-native';
import { PromotionItem } from '@/components/molecules/PromotionCard';

// Flaga do śledzenia stanu inicjalizacji Synerise
let isSyneriseInitialized = false;

// Stałe Synerise
const SYNERISE_API_KEY = '6d3d6a1d-64bb-44d0-8048-b12eafc63426';
const DEBUG_MODE = true;

// Typ odpowiedzi z promocji
export interface PromotionsResponse {
  items: PromotionItem[];
}

/**
 * Sprawdza, czy Synerise jest już zainicjalizowany
 */
export const isSyneriseAlreadyInitialized = () => {
  return isSyneriseInitialized;
};

/**
 * Inicjalizuje Synerise SDK
 * @returns Promise rozwiązywana po inicjalizacji
 */
export const initSyneriseSDK = () => {
  // Jeśli Synerise jest już zainicjalizowany, nie inicjalizuj ponownie
  if (isSyneriseInitialized) {
    console.log('Synerise już zainicjalizowany, pomijam ponowną inicjalizację');
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    try {
      // Przygotowanie inicjalizacji Synerise z dodatkowymi parametrami dla powiadomień
      const initializer = Synerise.Initializer()
        .withApiKey(SYNERISE_API_KEY)
        .withDebugModeEnabled(DEBUG_MODE)
        .withCrashHandlingEnabled(true);
      
      // Dodatkowa konfiguracja dla iOS/Android dla powiadomień
      if (Platform.OS === 'ios') {
        // Na iOS można dodać dodatkowe konfiguracje, jeśli będą potrzebne
      }

      // Inicjalizacja z rozszerzoną konfiguracją
      initializer.init();
      
      // Oznacz Synerise jako zainicjalizowany
      isSyneriseInitialized = true;
      console.log('Synerise został pomyślnie zainicjalizowany');
      resolve();
    } catch (error) {
      console.error('Błąd podczas inicjalizacji Synerise:', error);
      resolve(); // Rozwiązujemy obietnicę mimo błędu, aby aplikacja mogła działać dalej
    }
  });
};

/**
 * Inicjalizuje Synerise i wykonuje funkcję po jego pełnej gotowości
 * @param callback Funkcja do wykonania po inicjalizacji
 */
export const initSyneriseWithCallback = (callback?: () => void) => {
  // Jeśli Synerise jest już zainicjalizowany, wykonaj callback od razu
  if (isSyneriseInitialized) {
    console.log('Synerise już zainicjalizowany, wykonuję callback');
    if (callback) callback();
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    // Inicjalizuj Synerise
    initSyneriseSDK().then(() => {
      // Dodatkowe sprawdzenie, czy Synerise jest gotowy
      Synerise.onReady(() => {
        console.log('Synerise jest w pełni gotowy');
        if (callback) callback();
        resolve();
      });
    });
  });
};

/**
 * Obsługuje powiadomienie Synerise
 * @param pushData Dane powiadomienia
 * @returns Promise 
 */
export const handleSynerisePushNotification = async (pushData: any) => {
  if (!pushData) {
    console.warn('Brak danych powiadomienia do obsługi');
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    try {
      // Jeśli Synerise nie jest zainicjalizowany, inicjalizuj go najpierw
      if (!isSyneriseInitialized) {
        console.log('Inicjalizuję Synerise przed obsługą powiadomienia');
        
        initSyneriseWithCallback(() => {
          try {
            if (Synerise && Synerise.Notifications) {
              Synerise.Notifications.handleNotification(pushData, null);
              console.log('Powiadomienie Synerise obsłużone po inicjalizacji');
              resolve();
            } else {
              console.error('Moduł Notifications niedostępny po inicjalizacji');
              reject(new Error('Moduł Notifications niedostępny'));
            }
          } catch (innerError) {
            console.error('Błąd podczas obsługi powiadomienia po inicjalizacji:', innerError);
            reject(innerError);
          }
        });
      } else {
        // Synerise już zainicjalizowany, obsłuż powiadomienie bezpośrednio
        Synerise.Notifications.handleNotification(pushData, null);
        console.log('Powiadomienie Synerise obsłużone bezpośrednio');
        resolve();
      }
    } catch (error) {
      console.error('Błąd podczas obsługi powiadomienia Synerise:', error);
      reject(error);
    }
  });
};

/**
 * Pobiera wszystkie promocje dostępne w Synerise
 * @returns Promise z odpowiedzią zawierającą promocje
 */
export const getAllPromotions = (): Promise<PromotionsResponse> => {
  return new Promise((resolve, reject) => {
    // Jeśli Synerise nie jest zainicjalizowany, inicjalizuj go najpierw
    if (!isSyneriseInitialized) {
      console.log('Inicjalizuję Synerise przed pobraniem promocji');
      
      initSyneriseWithCallback(() => {
        try {
          if (Synerise && Synerise.Promotions) {
            Synerise.Promotions.getAllPromotions(
              (promotionResponse) => {
                console.log('Promocje pobrane pomyślnie');
                resolve(promotionResponse as unknown as PromotionsResponse);
              },
              (error) => {
                console.error('Błąd podczas pobierania promocji:', error);
                reject(error);
              }
            );
          } else {
            console.error('Moduł Promotions niedostępny po inicjalizacji');
            reject(new Error('Moduł Promotions niedostępny'));
          }
        } catch (innerError) {
          console.error('Błąd podczas pobierania promocji po inicjalizacji:', innerError);
          reject(innerError);
        }
      });
    } else {
      // Synerise już zainicjalizowany, pobierz promocje bezpośrednio
      Synerise.Promotions.getAllPromotions(
        (promotionResponse) => {
          console.log('Promocje pobrane pomyślnie');
          resolve(promotionResponse as unknown as PromotionsResponse);
        },
        (error) => {
          console.error('Błąd podczas pobierania promocji:', error);
          reject(error);
        }
      );
    }
  });
};

/**
 * Pobiera dokument z Synerise na podstawie jego slug
 * @param slugName Nazwa slug dokumentu
 * @returns Promise z odpowiedzią zawierającą dokument
 */
export const getDocument = (slugName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
      Synerise.Content.generateDocument(
        slugName,
        (document) => {
          console.log(document);
          if (Platform.OS === 'ios') {
            resolve(document);
          } else {
            resolve(document.content);
          }
        },
        (error) => {
          console.error(`Błąd podczas pobierania dokumentu ${slugName}:`, error);
          reject(error);
        }
      );
    
  });
};

// Eksport domyślny wszystkich funkcji
export default {
  isSyneriseAlreadyInitialized,
  initSyneriseSDK,
  initSyneriseWithCallback,
  handleSynerisePushNotification,
  getAllPromotions,
  getDocument
}; 
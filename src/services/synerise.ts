import { Synerise } from 'react-native-synerise-sdk';
import { Platform } from 'react-native';
import { PromotionItem } from '@/components/molecules/PromotionCard';
import { ClientAccountRegisterContext } from 'react-native-synerise-sdk/lib/classes/models/Client/ClientAccountRegisterContext';

// Flaga do śledzenia stanu inicjalizacji Synerise
let isSyneriseInitialized = false;

// Stałe Synerise
const SYNERISE_API_KEY = '6d3d6a1d-64bb-44d0-8048-b12eafc63426';
const DEBUG_MODE = true;

// Typ odpowiedzi z promocji
export interface PromotionsResponse {
  items: PromotionItem[];
}

// Typ dla elementu karuzeli wyświetlanego w komponencie
export interface CarouselItemDisplay {
  title: string;
  description: string;
  image: string;
}

// Typ dla elementu karuzeli ze screenView
export interface CarouselItem {
  schema: string;
  content: {
    title: string;
    description: string;
    image: string;
  };
  slug: string;
  uuid: string;
}

// Typ dla odpowiedzi ze screenView
export interface ScreenViewResponse {
  identifier: string;
  name: string;
  hash: string;
  path: string;
  priority: number;
  audience: {
    targetType: string;
  };
  data: {
    collection: CarouselItem[];
  };
  createdAt: string;
  updatedAt: string;
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
 * Sprawdza, czy użytkownik jest zalogowany
 * @returns Boolean wskazujący, czy użytkownik jest zalogowany
 */
export const isSignedIn = (): boolean => {
  return Synerise.Client.isSignedIn();
};

/**
 * Rejestruje nowego użytkownika w systemie
 * @param email Email użytkownika
 * @param password Hasło użytkownika
 * @param firstName Imię użytkownika
 * @param referralCode Kod polecający
 * @returns Promise rozwiązywana po rejestracji
 */
export const registerAccount = (
  email: string,
  password: string,
  firstName: string,
  referralCode: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Używamy zaimportowanej klasy ClientAccountRegisterContext
      const context = new ClientAccountRegisterContext(email, password);
      
      // Dodajemy stały numer telefonu
      context.phone = '500500500';
      
      // Dodajemy opcjonalne pola
      if (firstName) {
        context.firstName = firstName;
      }
      
      // Dodajemy atrybuty jako obiekt, jeśli kod polecający został podany
      if (referralCode) {
        context.attributes = { referralCode };
      }
      // Wywołanie API Synerise
      Synerise.Client.registerAccount(
        context,
        () => {
          resolve();
        },
        (error: any) => {
          // Szczegółowe logowanie błędu
          console.error('Błąd podczas rejestracji użytkownika:', error);
          
          reject(error);
        }
      );
    } catch (error) {
      console.error('Nieoczekiwany błąd podczas przygotowania rejestracji:', error);
      reject(error);
    }
  });
};

/**
 * Loguje użytkownika do systemu
 * @param email Email użytkownika
 * @param password Hasło użytkownika
 * @returns Promise rozwiązywana po zalogowaniu
 */
export const signIn = (email: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Synerise.Client.signIn(
      email,
      password,
      () => {
        resolve();
      },
      (error: any) => {
        console.error('Błąd podczas logowania użytkownika:', error);
        reject(error);
      }
    );
  });
};

/**
 * Wylogowuje użytkownika z systemu
 * @returns Promise rozwiązywana po wylogowaniu
 */
export const signOut = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      Synerise.Client.signOut();
      console.log('Użytkownik został pomyślnie wylogowany');
      resolve();
    } catch (error) {
      console.error('Błąd podczas wylogowywania użytkownika:', error);
      reject(error);
    }
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
    
      // Synerise już zainicjalizowany, pobierz promocje bezpośrednio
      Synerise.Promotions.getAllPromotions(
        (promotionResponse) => {
          resolve(promotionResponse as unknown as PromotionsResponse);
        },
        (error) => {
          console.error('Błąd podczas pobierania promocji:', error);
          reject(error);
        }
      );
    }
  );
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
          // console.log(document);
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

/**
 * Pobiera promocję z Synerise na podstawie UUID
 * @param uuid UUID promocji
 * @returns Promise z odpowiedzią zawierającą promocję
 */
export const getPromotionByUUID = (uuid: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    Synerise.Promotions.getPromotionByUUID(
      uuid,
      (promotion) => {
        resolve(promotion);
      },
      (error) => {
        console.error(`Błąd podczas pobierania promocji o UUID ${uuid}:`, error);
        reject(error);
      }
    );
  });
};

/**
 * Aktywuje promocję w Synerise na podstawie UUID
 * @param uuid UUID promocji
 * @returns Promise rozwiązywana po aktywacji promocji
 */
export const activatePromotionByUUID = (uuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Synerise.Promotions.activatePromotionByUUID(
      uuid,
      () => {
        console.log(`Promocja o UUID ${uuid} została aktywowana`);
        resolve();
      },
      (error) => {
        console.error(`Błąd podczas aktywacji promocji o UUID ${uuid}:`, error);
        reject(error);
      }
    );
  });
};

/**
 * Deaktywuje promocję w Synerise na podstawie UUID
 * @param uuid UUID promocji
 * @returns Promise rozwiązywana po deaktywacji promocji
 */
export const deactivatePromotionByUUID = (uuid: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Synerise.Promotions.deactivatePromotionByUUID(
      uuid,
      () => {
        console.log(`Promocja o UUID ${uuid} została deaktywowana`);
        resolve();
      },
      (error) => {
        console.error(`Błąd podczas deaktywacji promocji o UUID ${uuid}:`, error);
        reject(error);
      }
    );
  });
};

/**
 * Generuje screenView z Synerise na podstawie jego slug
 * @param feedSlug Nazwa feedSlug
 * @returns Promise z odpowiedzią zawierającą screenView
 */
export const generateScreenView = (feedSlug: string): Promise<ScreenViewResponse> => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Rozpoczynam pobieranie screenView dla sluga: ${feedSlug}`);
      
      Synerise.Content.generateScreenView(
        feedSlug,
        (screenView) => {
          console.log('Otrzymano odpowiedź screenView:', JSON.stringify(screenView));
          resolve(screenView as unknown as ScreenViewResponse);
        },
        (error) => {
          console.error(`Błąd podczas pobierania screenView ${feedSlug}:`, error);
          reject(error);
        }
      );
    } catch (error) {
      console.error('Nieoczekiwany błąd podczas generowania screenView:', error);
      reject(error);
    }
  });
};

// Eksport domyślny wszystkich funkcji
export default {
  isSyneriseAlreadyInitialized,
  initSyneriseSDK,
  initSyneriseWithCallback,
  handleSynerisePushNotification,
  getAllPromotions,
  getDocument,
  getPromotionByUUID,
  activatePromotionByUUID,
  deactivatePromotionByUUID,
  isSignedIn,
  registerAccount,
  signIn,
  signOut,
  generateScreenView
}; 
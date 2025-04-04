import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import { Synerise } from 'react-native-synerise-sdk';
import { 
  isSyneriseAlreadyInitialized, 
  initSyneriseWithCallback, 
  handleSynerisePushNotification 
} from './synerise';

// Obsługa wiadomości w tle - przekazanie do Synerise SDK
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Otrzymano wiadomość w tle:', remoteMessage);
  console.log('Dane wiadomości:', JSON.stringify(remoteMessage.data));
  
  // Przekazanie danych do Synerise SDK
  if (remoteMessage.data) {
    await handleSynerisePushNotification(remoteMessage.data);
  }
});

// Nasłuchiwanie wiadomości w czasie aktywności aplikacji
messaging().onMessage(async remoteMessage => {
  console.log('Otrzymano wiadomość podczas działania aplikacji:', remoteMessage);
  console.log('Dane wiadomości (foreground):', JSON.stringify(remoteMessage.data));
  
  // Przekazanie danych do Synerise SDK
  if (remoteMessage.data) {
    await handleSynerisePushNotification(remoteMessage.data);
  }
});

// Obsługa kliknięcia w powiadomienie, gdy aplikacja była w tle
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('Powiadomienie otworzyło aplikację z tła:', remoteMessage);
  // Przekazanie danych do Synerise SDK
  if (remoteMessage.data) {
    handleSynerisePushNotification(remoteMessage.data);
  }
});

// Sprawdzenie czy aplikacja została otwarta poprzez powiadomienie
messaging().getInitialNotification().then(remoteMessage => {
  if (remoteMessage) {
    console.log('Aplikacja została uruchomiona przez powiadomienie:', remoteMessage);
    // Przekazanie danych do Synerise SDK
    if (remoteMessage.data) {
      handleSynerisePushNotification(remoteMessage.data);
    }
  }
});

/**
 * Prosi użytkownika o uprawnienia do powiadomień
 */
async function requestUserPermission() {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } catch (error) {
      console.error('Błąd podczas prośby o uprawnienia:', error);
    }
  } else if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
    if (!enabled) {
      console.log('Użytkownik nie zezwolił na powiadomienia');
    }
  }
}

/**
 * Konfiguruje nasłuchiwanie zdarzeń powiadomień w Synerise
 */
export function setupSyneriseNotifications() {
  Synerise.Notifications.setListener({
    onRegistrationToken: function(token) {
      registerTokenWithSynerise(token);
    },
    onRegistrationRequired: function() {
      getFcmToken()
        .then(token => {
          if (token) {
            registerTokenWithSynerise(token);
          }
        })
        .catch(error => {
          console.error('Błąd podczas pobierania tokena FCM dla Synerise:', error);
        });
    },
    onNotification: function(notification) {
      console.log('Otrzymano powiadomienie z Synerise:', notification);
      // Dodana obsługa powiadomień z Synerise
      if (notification && typeof notification === 'object' && 'content' in notification) {
        console.log('Zawartość powiadomienia Synerise:', notification.content);
      }
    }
  });
}

// Obsługa odświeżenia tokena FCM
messaging().onTokenRefresh(token => {
  console.log('Token FCM został odświeżony:', token);
  // Rejestracja tokena w Synerise
  registerTokenWithSynerise(token);
});

/**
 * Rejestruje token FCM w Synerise
 * @param token Token FCM do zarejestrowania
 * @param mobilePushAgreement Zgoda na powiadomienia
 */
export function registerTokenWithSynerise(token: string, mobilePushAgreement = true) {
  // Upewnij się, że Synerise jest zainicjalizowany przed rejestracją tokena
  if (!isSyneriseAlreadyInitialized()) {
    console.log('Inicjalizuję Synerise przed rejestracją tokena');
    initSyneriseWithCallback(() => {
      Synerise.Notifications.registerForNotifications(token, mobilePushAgreement, function() {
        console.log('Token FCM został pomyślnie zarejestrowany w Synerise');
      }, function(error) {
        console.error('Błąd podczas rejestracji tokena FCM w Synerise:', error);
      });
    });
  } else {
    Synerise.Notifications.registerForNotifications(token, mobilePushAgreement, function() {
      console.log('Token FCM został pomyślnie zarejestrowany w Synerise');
    }, function(error) {
      console.error('Błąd podczas rejestracji tokena FCM w Synerise:', error);
    });
  }
}

/**
 * Pobiera token FCM
 * @returns Promise z tokenem FCM lub null
 */
export async function getFcmToken() {
  try {
    await requestUserPermission();
    
    // Rejestracja urządzenia dla wiadomości zdalnych na iOS
    if (Platform.OS === 'ios') {
      const isRegistered = await messaging().isDeviceRegisteredForRemoteMessages;
      if (!isRegistered) {
        await messaging().registerDeviceForRemoteMessages();
        console.log('Urządzenie iOS zarejestrowane dla powiadomień push');
      }
    }
    
    // Sprawdź, czy token już istnieje
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } else {
      console.log('Nie udało się uzyskać tokena FCM');
      return null;
    }
  } catch (error) {
    console.error('Błąd podczas pobierania tokena FCM:', error);
    return null;
  }
}

/**
 * Inicjalizuje FCM i integruje z Synerise
 */
export async function initFcmAndRegisterWithSynerise() {
  try {
    const token = await getFcmToken();
    if (token) {
      // Zarejestruj token w Synerise
      registerTokenWithSynerise(token);
    }
    
    // Skonfiguruj nasłuchiwanie zdarzeń Synerise
    setupSyneriseNotifications();
    return Promise.resolve();
  } catch (error) {
    console.error('Błąd podczas inicjalizacji FCM:', error);
    return Promise.reject(error);
  }
}

export default {
  getFcmToken,
  setupSyneriseNotifications,
  registerTokenWithSynerise,
  initFcmAndRegisterWithSynerise,
}; 
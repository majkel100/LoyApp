
import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';


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

  // Pobieranie tokena FCM
  export async function getFcmToken() {
    try {
      await requestUserPermission();
      
      // Sprawdź, czy token już istnieje
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
      } else {
        console.log('Nie udało się uzyskać tokena FCM');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania tokena FCM:', error);
    }
  }

  export default {
    getFcmToken,
  }; 
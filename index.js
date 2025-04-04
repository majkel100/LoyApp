import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import messaging from '@react-native-firebase/messaging';
import { handleSynerisePushNotification } from './src/services/synerise';

// Zdefiniowanie funkcji headlessTask
const headlessTask = async (remoteMessage) => {
  console.log('Uruchomiono zadanie Headless dla powiadomień w index.js:', remoteMessage);
  
  // Jeśli mamy dane powiadomienia, przekazujemy je do Synerise SDK
  if (remoteMessage && remoteMessage.data) {
    try {
      // Użycie zaimportowanej funkcji do obsługi powiadomień
      await handleSynerisePushNotification(remoteMessage.data);
    } catch (error) {
      console.error('Błąd podczas obsługi powiadomienia Synerise w trybie Headless w index.js:', error);
    }
  }
  
  return Promise.resolve();
};

// Rejestracja headless task dla obsługi powiadomień w tle - musi być w głównym pliku index.js
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => headlessTask);

if (__DEV__) {
  import('@/reactotron.config');
}

AppRegistry.registerComponent(appName, () => App);

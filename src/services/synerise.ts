import { Synerise } from 'react-native-synerise-sdk';

export const initSynerise = () => {
  Synerise.Initializer()
    .withApiKey('6d3d6a1d-64bb-44d0-8048-b12eafc63426')
    .withDebugModeEnabled(false)
    .withCrashHandlingEnabled(true)
    .init();
};

export default {
  initSynerise,
}; 
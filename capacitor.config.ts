import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'myApp',
  webDir: 'www',
  plugins: {
    Camera: {
      permissions: {
        android: ['camera', 'write'],
      },
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      sound: 'default',
      iconColor: '#488aff',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;

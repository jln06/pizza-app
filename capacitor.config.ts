import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jeanluc.pizzaassistant',
  appName: 'Pizza Assistant',
  webDir: 'www',
  backgroundColor: '#f3f2f2',
  android: {
    backgroundColor: '#f3f2f2'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_pizza',
      iconColor: '#ec3013'
    }
  }
};

export default config;

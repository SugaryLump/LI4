// Este ficheiro define a configuração para o Expo
// Tudo o que está configurado aqui é apenas para o frontend
import { ExpoConfig, ConfigContext } from '@expo/config'
import { address } from 'ip'

export default ({}: ConfigContext): ExpoConfig => ({
  name: "FunTracker",
  slug: "funtracker",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./app/assets/icon.png",
  entryPoint: "./app/App.tsx",
  splash: {
    image: "./app/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./app/assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF"
    },
    config: {
      googleMaps: {
        apiKey: "AIzaSyDNgTAqcBYFw6C4Cv4EBr0qu1AsLNgLRx0"
      }
    },
    package: "com.funtracker.app"
  },
  web: {
    favicon: "./app/assets/favicon.png"
  },
  extra: {
    // serverUrl: 'http://' + address() + ":3000"
    serverUrl: 'https://funtracker.pta2002.com'
  },
})

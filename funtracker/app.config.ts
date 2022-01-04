// Este ficheiro define a configuração para o Expo
// Tudo o que está configurado aqui é apenas para o frontend
import { ExpoConfig, ConfigContext } from '@expo/config'
import { address } from 'ip'

export default ({}: ConfigContext): ExpoConfig => ({
  name: "LI4 Grupo 3",
  slug: "li4-grupo3",
  version: "0.1.0",
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
    }
  },
  web: {
    favicon: "./app/assets/favicon.png"
  },
  extra: {
    serverUrl: 'http://' + address() + ":3000"
  }
})
import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ThemeProvider } from 'react-native-elements'
import * as constants from './lib/constants'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginMenu } from './Screens/Login'
import { SignupMenu } from './Screens/Signup'
import { getJwt } from './storage'
import { EstabelecimentosMenu } from './Screens/Estabelecimentos'
import { FiltrosMenu } from './Screens/Filtros'
import { EstabelecimentoMenu } from './Screens/Estabelecimento'
import { AvaliarMenu } from './Screens/Avaliar'
import { MenuProvider } from 'react-native-popup-menu'


const Stack = createNativeStackNavigator();

export default function App (): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    getJwt().then(r => {
      if (r) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={constants.appTheme}>
        <MenuProvider>
          <NavigationContainer>
            <Stack.Navigator 
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#f6f7f8',
                },
                headerTitleStyle: {
                  fontSize: 24,
                },
              }}>


              <Stack.Screen
                name='Login'
                component={LoginMenu}
                options={{
                  title: 'Login',
                }}
              />
              <Stack.Screen
                name='Signup'
                component={SignupMenu}
                options={{
                  title: 'Sign up',
                }}
              />
              <Stack.Screen
                name='Estabelecimentos'
                component={EstabelecimentosMenu}
                initialParams={{
                  bar:false,
                  disco:false,
                  aberto:false,
                  ordem:0,
                  nome:null,
                  searched:false,
                }}
              />
              <Stack.Screen
                name='Filtros'
                component={FiltrosMenu}
                initialParams={{
                  bar:false,
                  disco:false,
                  aberto:false,
                  ordem:0
                }}
              />
              <Stack.Screen
                name='Estabelecimento'
                component={EstabelecimentoMenu}
              />
              <Stack.Screen
                name='Avaliar'
                component={AvaliarMenu}
              />

            </Stack.Navigator>
          </NavigationContainer>
        </MenuProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

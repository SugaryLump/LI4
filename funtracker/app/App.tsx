import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { ThemeProvider } from 'react-native-elements'
import * as constants from './lib/constants'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginMenu } from './Screens/Login'
import { SignupMenu } from './Screens/Signup'
import { EstabelecimentosMenu } from './Screens/Estabelecimentos'
import { FiltrosMenu } from './Screens/Filtros'
import { EstabelecimentoMenu } from './Screens/Estabelecimento'

const Stack = createNativeStackNavigator();

export default function App (): JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={constants.appTheme}>
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
              options={{
                title: 'Estabelecimentos'
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
              options={{title:' '}}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

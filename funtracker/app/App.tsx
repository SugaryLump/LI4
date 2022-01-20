import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { ThemeProvider } from 'react-native-elements'
import * as constants from './lib/constants'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginMenu } from './Screens/Login'

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
                fontSize: 35,
              },
            }}>


            <Stack.Screen
              name='Login'
              component={LoginMenu}
              options={{
                title: 'Login Menu',
              }}
            />
            
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

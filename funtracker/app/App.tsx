import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'react-native-elements'
import * as constants from './lib/constants'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginMenu } from './Screens/Login'
import { SignupMenu } from './Screens/Signup'
import MainDrawerNavigator from './Screens/MainDrawer'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { getJwt } from './storage'

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
              name='MainDrawer'
              component={MainDrawerNavigator}
            />

          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

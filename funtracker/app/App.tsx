import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { Reducer, useEffect, useState } from 'react'
import { ThemeProvider } from 'react-native-elements'
import * as constants from './lib/constants'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginMenu } from './Screens/Login'
import { SignupMenu } from './Screens/Signup'
import { getJwt, setJwt, AuthContext, AuthContextT } from './auth'
import { EstabelecimentosMenu } from './Screens/Estabelecimentos'
import { FiltrosMenu } from './Screens/Filtros'
import { EstabelecimentoMenu } from './Screens/Estabelecimento'
import { AvaliarMenu } from './Screens/Avaliar'
import { MenuProvider } from 'react-native-popup-menu'
import { LoadingMenu } from './Screens/LoadingMenu'
import OpcoesMenu from './Screens/Opcoes'

const Stack = createNativeStackNavigator();

interface AuthAction {
  type: 'SIGN_IN' | 'RESTORE_TOKEN' | 'SIGN_OUT',
  token?: string | null
}

type AuthState = {
  userToken?: string | null,
  isLoading: boolean,
  isSignout: boolean
}

export default function App (): JSX.Element {
  const [state, dispatch] = React.useReducer<Reducer<AuthState, AuthAction>>(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false
          }
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  )

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken = await getJwt()
      dispatch({ type: 'RESTORE_TOKEN', token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = React.useMemo<AuthContextT>(
    () => ({
      signIn: async (token: string) => {
        setJwt(token)
        dispatch({ type: 'SIGN_IN', token })
      },
      signOut: () => {
        setJwt(null)
        dispatch({ type: 'SIGN_OUT' })
      },
    }),
    []
  )

  return (
    <AuthContext.Provider value={authContext}>
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

                {state.isLoading ?
                  <Stack.Screen
                    name='Loading'
                    component={LoadingMenu}
                    options={{
                      headerShown: false
                    }}
                  />
                  :
                  state.userToken == null ?
                    <>
                      <Stack.Screen
                        name='Login'
                        component={LoginMenu}
                        options={{
                          title: 'Login',
                          animationTypeForReplace: state.isSignout ? 'pop' : 'push'
                        }}
                      />
                      <Stack.Screen
                        name='Signup'
                        component={SignupMenu}
                        options={{
                          title: 'Sign up',
                        }}
                      />
                    </> : <>
                      <Stack.Screen
                        name='Estabelecimentos'
                        component={EstabelecimentosMenu}
                        initialParams={{
                          bar: false,
                          disco: false,
                          aberto: false,
                          ordem: 0,
                          nome: null,
                          searched: false,
                        }}
                      />
                      <Stack.Screen
                        name='Filtros'
                        component={FiltrosMenu}
                        initialParams={{
                          bar: false,
                          disco: false,
                          aberto: false,
                          ordem: 0
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
                      <Stack.Screen
                        name='Opcoes'
                        component={OpcoesMenu}
                        options={{
                          headerTitle:'Opções'
                        }}
                      />
                    </>
                }
              </Stack.Navigator>
            </NavigationContainer>
          </MenuProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </AuthContext.Provider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

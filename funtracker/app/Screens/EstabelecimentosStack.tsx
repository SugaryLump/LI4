import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { EstabelecimentosMenu } from './Estabelecimentos'
import { FiltrosMenu } from './Filtros'
import { EstabelecimentoMenu } from './Estabelecimento'
import { AvaliarMenu } from './Avaliar'

const Stack = createNativeStackNavigator();

export default function EstabelecimentoStack (): JSX.Element {
  return (
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
            />
            <Stack.Screen
              name='Avaliar'
              component={AvaliarMenu}
            />

          </Stack.Navigator>
        </NavigationContainer>
  )
}
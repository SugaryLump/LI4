import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { View } from 'react-native'
import { ThemeProvider, Header, Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from './lib/constants'
import { patchWebProps } from 'react-native-elements/dist/helpers'

export default function App (): JSX.Element {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const createUser = (): void => {
    fetch(constants.serverUrl + '/api/v1/user', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username, password })})
      .then(async res => setMessage(await res.text()))
      .catch(async error => console.error(error))
  }

  const appTheme={
    Header: {
      placement: 'left',
      backgroundColor:'#f6f7f8'
    },
    Button: {
      titleStyle: {
        color: '#2582ff'
      },
      buttonStyle: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 10,
        padding: 20
      },
      containerStyle: {
        width: 150
      }
    }
  }

  //Components
  const LoginCircle = () => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 50}}>
        <svg.Svg height='150' width='150'>
          <svg.Circle
            cx='75'
            cy='75'
            r='75'
            fill='#d9d9d9'> 
          </svg.Circle>
          <svg.Text
            fill='#000'
            x='75'
            y='75'
            fontSize='14'
            textAnchor='middle'>
            Login
          </svg.Text>
        </svg.Svg>
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={appTheme}>
        <Header
          centerComponent={{ text: 'Login Menu', style: { color: '#000', fontSize: 40 } }}
        />
        <LoginCircle/>
        <Input 
          placeholder='Username'
          onChangeText={(username)=>setUsername(username)}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: '#c5cad4',
            padding: 5
          }}
          containerStyle={{
            paddingHorizontal:50
          }}
        />
        <Input
          placeholder='Password'
          secureTextEntry
          onChangeText={(password)=>setPassword(password)}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: '#c5cad4',
            padding: 5
          }}
          containerStyle={{
            paddingHorizontal:50
          }}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button title='Login' onPress={() => {setMessage('Funcionalidade por implementar')}}/>
          <Button title='Sign up' onPress={createUser} containerStyle={{paddingTop:30}}/>
        </View>
        <Text style={{alignSelf:'center'}}> Don't have an account yet? </Text>
        <View style={{flex:1, justifyContent: 'flex-end', paddingHorizontal: 10, paddingVertical: 20}}>
          <Text>
            Mensagem de Debug: {message}
          </Text>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

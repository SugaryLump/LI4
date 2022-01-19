import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { ThemeProvider, Header, Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as constants from './lib/constants'

export default function App (): JSX.Element {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const createUser = (): void => {
    fetch(constants.serverUrl + '/api/v1/user', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username, password })})
      .then(async res => setMessage(await res.text()))
      .catch(async error => console.error(error))
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Header centerComponent={{ text: 'LI4', style: { color: '#fff', fontSize: 20 } }} />
        <Text h2>Criar utilizador</Text>
        <Input placeholder='Username' onChangeText={setUsername} value={username} />
        <Input placeholder='Password' secureTextEntry onChangeText={setPassword} value={password} />
        <Button title='Submeter' onPress={createUser} />
        <Text>
          Mensagem: {message}
        </Text>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

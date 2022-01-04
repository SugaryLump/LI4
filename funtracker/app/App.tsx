import { registerRootComponent } from 'expo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { ThemeProvider, Header, Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as constants from './lib/constants'
import { RestClient } from 'typed-rest-client'
import { User } from '.prisma/client'

interface UserMsg {
  success: boolean
  user?: User
}

interface UserCreate {
  username: string
  password: string
}

export default function App (): JSX.Element {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const createUser = (): void => {
    const rest = new RestClient('users-api', constants.serverUrl + '/api/v1/users')
    rest.get<UserMsg>('/api/v1/users/test').then(res => console.log(res)).catch(console.error)
    rest.create<UserCreate>('/api/v1/users', { username, password })
      .then(res => console.log(res.result))
      .catch(console.error)
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Header centerComponent={{ text: 'LI4', style: { color: '#fff', fontSize: 20 } }} />
        <Text h2>Criar utilizador</Text>
        <Input placeholder='Username' onChangeText={setUsername} value={username} />
        <Input placeholder='Password' secureTextEntry onChangeText={setPassword} value={password} />
        <Button title='Submeter' onPress={createUser} />
      </ThemeProvider>

    </SafeAreaProvider>
  )
}

// Necessário, como estamos a colocar a aplicação noutro sítio
registerRootComponent(App)

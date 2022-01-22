import React, { useState } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import { Text, Button, Input } from 'react-native-elements'
import * as constants from '../lib/constants'

export const SignupMenu = ({ navigation }: any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const usernameRef = React.createRef<TextInput>()
  const passwordRef = React.createRef<TextInput>()

  const createUser = (): void => {
    fetch(constants.serverUrl + '/api/v1/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
      .then(async res => setMessage(await res.text()))
      .catch(async error => console.error(error))

    //go to home menu if successful
    navigation.reset({ index: 0, routes: [{ name: 'MainDrawer' }] });
  }

  //Components

  return (
    <ScrollView contentContainerStyle={{
      flexDirection: 'column',
      justifyContent: 'center',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      position: 'absolute',
      flex: 1,
      paddingHorizontal: 20
    }}>
      <Input
        placeholder='Username'
        onChangeText={(username) => {
          setUsername(username)
          setUsernameError('')
        }}
        errorMessage={usernameError}
        returnKeyType='next'
        autoCapitalize='none'
        autoCompleteType='username'
        ref={usernameRef}
        onSubmitEditing={() => passwordRef.current?.focus()}
        blurOnSubmit={false}
      />
      <Input
        placeholder='Password'
        secureTextEntry
        onChangeText={(password) => {
          setPassword(password)
          setPasswordError('')
        }}
        errorMessage={passwordError}
        ref={passwordRef}
        onSubmitEditing={createUser}
      />
      <Button title='Sign up' onPress={createUser} />
    </ScrollView>
  )
}
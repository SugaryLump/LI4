import React, { useState } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import { Text, Button, Input } from 'react-native-elements'
import * as constants from '../lib/constants'
import { colors } from '../lib/constants'

export const SignupMenu = ({ navigation }: any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const usernameRef = React.createRef<TextInput>()
  const passwordRef = React.createRef<TextInput>()
  const confirmPasswordRef = React.createRef<TextInput>()

  const signupDisabled = username === '' || password == '' || password.length < 8 || password !== confirmPassword

  const createUser = async () => {
    try {
      let result = await fetch(constants.serverUrl + '/api/v1/user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).then(r => r.json())
      if (result.success) {
        navigation.goBack()
      } else {
        setUsernameError("Utilizador já existe")
      }
    } catch (e) {
      setUsernameError("Erro a comunicar com o servidor")
    }

    //go to home menu if successful
    // navigation.reset({ index: 0, routes: [{ name: 'Estabelecimentos' }] });
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
        blurOnSubmit={false}
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <Input
        placeholder='Confirmar password'
        secureTextEntry
        onChangeText={(password) => {
          setConfirmPassword(password)
          setConfirmPasswordError('')
        }}
        errorMessage={confirmPasswordError}
        ref={confirmPasswordRef}
        onSubmitEditing={createUser}
      />

      <Button title='Sign up' onPress={createUser} disabled={signupDisabled} containerStyle={{ backgroundColor: colors.lightBlue, borderRadius: 10, borderWidth: 0 }} titleStyle={{ color: '#fff' }} />
    </ScrollView>
  )
}
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useContext, useState } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import { Text, Button, Input } from 'react-native-elements'
import { AuthContext } from '../auth'
import { useAuthContext } from '../hooks'
import * as constants from '../lib/constants'
import { colors } from '../lib/constants'
import { AppParamList } from '../routeTypes'

export const SignupMenu = ({ navigation }: NativeStackScreenProps<AppParamList, 'Signup'>) => {
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

  const authContext = useAuthContext()

  const createUser = async () => {
    try {
      let result = await authContext.fetchWithJwt('/user', 'POST', {
        username, password
      })
      if (result.success) {
        navigation.goBack()
      } else {
        setUsernameError("Utilizador já existe")
      }
    } catch (e) {
      setUsernameError("Erro a comunicar com o servidor")
    }
  }

  //Components

  return (
    <View style={{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      position: 'absolute',
      flex: 1,
      paddingHorizontal: 20
    }}>
      <View style={{
        maxWidth: 800,
        width: '100%'
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
          returnKeyType='next'
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
      </View>
    </View>
  )
}
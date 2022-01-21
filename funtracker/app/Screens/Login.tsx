import React, { useEffect, useState } from 'react'
import { ScrollView, TextInput, View } from 'react-native'
import { Text, Button, Input } from 'react-native-elements'
// import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import { colors, serverUrl } from '../lib/constants'
import { setJwt } from '../storage'

const LoginCircle = () => (
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

export const LoginMenu = ({ navigation }:any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const loginDisabled = username === "" || password === ""

  const usernameRef = React.createRef<TextInput>()
  const passwordRef = React.createRef<TextInput>()

  const login = async () => {
    try {
      let result = await fetch(serverUrl + "/api/v1/session", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }).then(r => r.json())
      if (result.success) {
        setJwt(result.jwt)
      } else {
        setUsernameError("Combinação de utilizador/password inválida")
        setPasswordError("Combinação de utilizador/password inválida")

        let anyUserRef: any = usernameRef.current
        let anyPassRef: any = passwordRef.current

        // TODO: Descobrir porque é que isto não dá sempre
        anyUserRef?.shake()
        anyPassRef?.shake()
      }
    } catch(e) {
      setUsernameError("Erro a comunicar com o servidor")
    }
    // navigation.reset({index: 0, routes: [{ name: 'Estabelecimentos'}]});
  }

  useEffect(() => usernameRef.current?.focus(), [])

  return (
    <ScrollView contentContainerStyle={{
       position: 'absolute',
       top: 0,
       bottom: 0,
       left: 0,
       right: 0
    }}>
      <View style={{
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100%',
        flex: 1,
        paddingHorizontal: 20
      }}>
        <LoginCircle />
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
          onSubmitEditing={login}
        />
        <Button title='Login' onPress={login} disabled={loginDisabled} containerStyle={{ backgroundColor: colors.lightBlue, borderRadius: 10, borderWidth: 0 }} titleStyle={{ color: '#fff' }} />
        <Text style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10 }}> Don't have an account yet? </Text>
        <Button title='Sign up' onPress={() => navigation.navigate('Signup')} />
      </View>
    </ScrollView>
  )
}
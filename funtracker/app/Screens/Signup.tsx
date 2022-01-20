import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from '../lib/constants'

export const SignupMenu = ({ navigation }:any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const createUser = (): void => {
    fetch(constants.serverUrl + '/api/v1/user', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ username, password })})
      .then(async res => setMessage(await res.text()))
      .catch(async error => console.error(error))

    //go to home menu is successful
  }

  //Components

  return (
    <View>
      <Input 
        placeholder='Username'
        onChangeText={(username)=>{
          setUsername(username)
          setUsernameError('')
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: '#c5cad4',
          padding: 5,
        }}
        containerStyle={{
          paddingTop:150,
          paddingHorizontal:50
        }}
        errorMessage={usernameError}
        errorStyle={{
          color: '#e33d3d',
          borderBottomWidth: usernameError===''? 0:1,
          borderBottomColor: '#e33d3d',
        }}
      />
      <Input
        placeholder='Password'
        secureTextEntry
        onChangeText={(password)=>{
          setPassword(password)
          setPasswordError('')
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: '#c5cad4',
          padding: 5
        }}
        containerStyle={{
          paddingHorizontal:50
        }}
        errorMessage={passwordError}
        errorStyle={{
          color: '#e33d3d',
          borderBottomWidth: usernameError===''? 0:1,
          borderBottomColor: '#e33d3d',
        }}
      />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Button title='Sign up' onPress={createUser} containerStyle={{paddingTop:50, width:320}}/>
      </View>
      <View style={{paddingHorizontal: 10, paddingVertical: 40}}>
        <Text>
          Debug: {message}
        </Text>
      </View>
    </View>
  )
}
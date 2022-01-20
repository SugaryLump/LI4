import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from '../lib/constants'

export const LoginMenu = ({ navigation }:any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameError, setUsernameError] = useState('')

  const login = (): void => {
    //Validate login with server and go to home screen
    navigation.navigate('Home') 
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
    <View>
      <LoginCircle/>
      <Input 
        placeholder='Username'
        onChangeText={(username)=>{
          setUsername(username)
          setUsernameError('')
        }}
        inputContainerStyle={{
          borderWidth: 1,
          borderColor: '#c5cad4',
          padding: 5
        }}
        containerStyle={{
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
        <Button title='Login' onPress={login}/>
        <Button title='Sign up' onPress={() => navigation.navigate('Signup')} containerStyle={{paddingTop:30}}/>
      </View>
      <Text style={{alignSelf:'center'}}> Don't have an account yet? </Text>
      <View style={{paddingHorizontal: 10, paddingVertical: 40}}>
        <Text>
          Debug: {message}
        </Text>
      </View>
    </View>
  )
}
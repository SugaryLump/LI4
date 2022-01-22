import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Input, Divider } from 'react-native-elements'

export default function OpcoesMenu() {
    const [newUsername, setNewUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [oldPassword, setOldPassword] = useState('')
    const [oldPasswordError, setOldPasswordError] = useState('')

    const [newPassword1, setNewPassword1] = useState('')
    const [newPassword1Error, setNewPassword1Error] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [newPassword2Error, setNewPassword2Error] = useState('')

    return (
        <View style={{flex:1}}>
            <View style={{flex:0.2, marginVertical:10, marginHorizontal:15}}>
            <Input
                placeholder='Username'
                onChangeText={(username) => {
                    setNewUsername(username)
                    setUsernameError('')
                }}
                errorMessage={usernameError}
                returnKeyType='next'
                autoCapitalize='none'
                autoCompleteType='username'
                blurOnSubmit={false}
            />
            <Button title='Alterar Username'/>
            </View>
            <Divider/>
            <View style={{flex:0.4, marginHorizontal:15}}>
                <Input
                    placeholder='Password atual'
                    secureTextEntry
                    onChangeText={(password) => {
                        setOldPassword(password)
                        setOldPasswordError('')
                    }}
                    errorMessage={oldPasswordError}
                />
                <Input
                    placeholder='Password nova'
                    secureTextEntry
                    onChangeText={(password) => {
                        setOldPassword(password)
                        setOldPasswordError('')
                    }}
                    errorMessage={newPassword1Error}
                />
                <Input
                    placeholder='Repetir password nova'
                    secureTextEntry
                    onChangeText={(password) => {
                        setOldPassword(password)
                        setOldPasswordError('')
                    }}
                    errorMessage={newPassword2Error}
                />
                <Button title='Alterar Password'/>
            </View>
            <View style={{flex:0.4, justifyContent:'flex-end', marginVertical:10, marginHorizontal:15}}>
                <Button title='Logout' titleStyle={{color:'red'}} buttonStyle={{borderColor:'red'}}/>
            </View>
        </View>
    )
}
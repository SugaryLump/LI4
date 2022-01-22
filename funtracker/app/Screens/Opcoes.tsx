import React, { useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, Input, Divider } from 'react-native-elements'
import { AuthContext } from '../auth'
import { useAuthContext } from '../hooks'

export default function OpcoesMenu({ navigation, route }:any) {
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const authContext = useAuthContext()

    return (
        <View style={{flex:1}}>
            <View style={{flex:0.9, marginHorizontal:15, marginVertical:15}}>
                <Input
                    placeholder='Password atual'
                    secureTextEntry
                    onChangeText={(password) => {
                        setPassword(password)
                        setPasswordError('')
                    }}
                    errorMessage={passwordError}
                />
                <Button title='Alterar Credenciais' onPress={() => {navigation.navigate({name:'Credenciais'})}}/>
            </View>
            <View style={{flex:0.1, justifyContent:'flex-end', marginVertical:10, marginHorizontal:15,}}>
                <Button title='Logout' titleStyle={{color:'red'}} buttonStyle={{borderColor:'red'}} onPress={authContext.signOut}/>
            </View>
        </View>
    )
}
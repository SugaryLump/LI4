import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Input, Divider } from 'react-native-elements'
import { useAuthContext } from '../hooks'
import { AppParamList } from '../routeTypes'

export default function OpcoesMenu({ navigation, route }: NativeStackScreenProps<AppParamList, 'Opcoes'>) {
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const authContext = useAuthContext()

    const alteraCredenciais = async () => {
        try {
            let res = await authContext.fetchWithJwt('/session', 'POST', {
                username: authContext.username as string,
                password,
                special: true
            })

            if (res.success) {
                navigation.navigate('Credenciais', { jwt: res.jwt })
            } else {
                setPasswordError('Password errada')
            }
        } catch (e) {
            setPasswordError('Erro a comunicar com o servidor')
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 15 }}>
            <View style={{
                flex: 1,
                width: '100%',
                maxWidth: 800
            }}>
                <View style={{ flex: 1 }}>
                    <Input
                        placeholder='Password atual'
                        secureTextEntry
                        onChangeText={(password) => {
                            setPassword(password)
                            setPasswordError('')
                        }}
                        onSubmitEditing={alteraCredenciais}
                        errorMessage={passwordError}
                    />
                    <Button title='Alterar Credenciais' onPress={alteraCredenciais} disabled={password === ''} />
                </View>
                <Button title='Logout' titleStyle={{ color: 'red' }} buttonStyle={{ borderColor: 'red' }} onPress={authContext.signOut} />
            </View>
        </View>
    )
}
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { createRef, useRef, useState } from 'react'
import { TextInput, View } from 'react-native'
import { Button, Input, Divider } from 'react-native-elements'
import { useAuthContext } from '../hooks'
import { AppParamList } from '../routeTypes'

export default function CredenciaisMenu({ navigation, route }: NativeStackScreenProps<AppParamList, 'Credenciais'>) {
    const [newUsername, setNewUsername] = useState('')
    const [usernameError, setUsernameError] = useState('')

    const [newPassword1, setNewPassword1] = useState('')
    const [newPassword1Error, setNewPassword1Error] = useState('')
    const [newPassword2, setNewPassword2] = useState('')
    const [newPassword2Error, setNewPassword2Error] = useState('')

    const password2Ref = createRef<TextInput>()

    const authContext = useAuthContext()

    const changeUsername = async () => {
        try {
            let result = await authContext.fetchWithJwt('/user/:id/username', 'PATCH', {
                username: newUsername
            }, { id: authContext.userId as number }, route.params.jwt)

            if (result.success) {
                authContext.newUsername(newUsername)
                navigation.goBack()
            } else {
                setUsernameError(result.errors[0])
            }
        } catch (e) {
            setUsernameError('Erro ao comunicar com o servidor')
        }
    }

    const changePassword = async () => {
        try {
            let result = await authContext.fetchWithJwt('/user/:id/password', 'PATCH', {
                password: newPassword2
            }, { id: authContext.userId as number }, route.params.jwt)

            if (result.success) {
                navigation.goBack()
            } else {
                setNewPassword1Error(result.errors[0])
                setNewPassword2Error(result.errors[0])
            }
        } catch (e) {
            setNewPassword1Error('Erro ao comunicar com o servidor')
            setNewPassword2Error('Erro ao comunicar com o servidor')
        }
    }

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            padding: 15
        }}>
            <View style={{
                width: '100%',
                maxWidth: 800,
                flex: 1
            }}>
                <Input
                    placeholder='Username'
                    onChangeText={(username) => {
                        setNewUsername(username)
                        setUsernameError('')
                    }}
                    errorMessage={usernameError}
                    autoCapitalize='none'
                    autoCompleteType='username'
                    onSubmitEditing={changeUsername}
                />
                <Button title='Alterar Username' disabled={newUsername === ''} onPress={changeUsername} />

                <Divider style={{ marginVertical: 15 }} />

                <Input
                    placeholder='Password nova'
                    secureTextEntry
                    onChangeText={(password) => {
                        setNewPassword1(password)
                        setNewPassword1Error('')
                    }}
                    errorMessage={newPassword1Error}
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => password2Ref.current?.focus()}
                />
                <Input
                    placeholder='Repetir password nova'
                    secureTextEntry
                    onChangeText={(password) => {
                        setNewPassword2(password)
                        setNewPassword2Error('')
                    }}
                    ref={password2Ref}
                    errorMessage={newPassword2Error}
                    onSubmitEditing={() => password2Ref.current?.focus()}
                />
                <Button title='Alterar Password' disabled={newPassword1 === ''} onPress={changePassword} />
            </View>
        </View>
    )
}
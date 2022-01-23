import { NavigationHelpersContext } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { AirbnbRating, Input, Button, colors } from 'react-native-elements'
import { useAuthContext } from '../hooks'
import { AppParamList } from '../routeTypes'

const submeterAvaliacao = () => {
    //sumbeter a avaliação e lidar com a resposta
    
}

export const AvaliarMenu = ({ navigation, route }: NativeStackScreenProps<AppParamList, 'Avaliar'>) => {
    const [rating, setRating] = useState(1)
    const [texto, setTexto] = useState('')
    const [error, setError] = useState('')

    const authContext = useAuthContext()

    const submeterAvaliacao = async () => {
        let result = await authContext.fetchWithJwt('/estabelecimento/:id/classificacoes', 'POST', {
            valor: rating,
            comentario: texto
        })

        if (result.success) {
            navigation.goBack()
        } else {
            setError('Erro ao adicionar avaliação')
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: '100%', maxWidth: 800, padding: 15 }}>
                <Text style={{ alignSelf: 'center', fontSize: 16 }}>Classifique o estabelecimento:</Text>
                <AirbnbRating
                    defaultRating={1}
                    onFinishRating={(score) => setRating(score)}
                    selectedColor='#ffd500'
                    showRating={false}
                    starContainerStyle={{ marginVertical: 15 }}
                />
                <Input
                    placeholder='Dê a sua opinião'
                    onChangeText={(comentario) => setTexto(comentario)}
                    maxLength={500}
                    numberOfLines={5}
                    textAlignVertical='top'
                    multiline
                />
                { error !== '' && <Text style={{ color: colors.error }}>{ error }</Text>}
                <Button title='Submeter' onPress={submeterAvaliacao} />
            </View>
        </View>
    )
}
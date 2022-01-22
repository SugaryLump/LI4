import { NavigationHelpersContext } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { AirbnbRating, Input, Button } from 'react-native-elements'

const submeterAvaliacao = () => {
    //sumbeter a avaliação e lidar com a resposta
    
}

export const AvaliarMenu = ({ navigation, route }: any) => {
    const [rating, setRating] = useState(1)
    const [texto, setTexto] = useState('')

    const submeterAvaliacao = () => {
        //sumbeter a avaliação e lidar com a resposta
        navigation.goBack()
    }

    return (
        <View style={{flex:1, marginVertical:50, marginHorizontal:10}}>
            <Text style={{fontSize:16}}>Classifique o estabelecimento:</Text> 
            <AirbnbRating
                defaultRating={1}
                onFinishRating={(score) => setRating(score)}
                selectedColor='#ffd500'
                showRating={false}
                starContainerStyle={{marginVertical:30}}
            />
            <View style={{flex:0.5}}>
                <Input
                    placeholder='Comentário'
                    onChangeText={(comentario) => setTexto(comentario)}
                    label='Dê a sua opinião:'
                    maxLength={500}
                    multiline
                    containerStyle={{flex:1}}
                    inputContainerStyle={{borderWidth:1, borderColor:'#dddddd'}}
                />
            </View>
            <View style={{flex:0.5, marginTop:50}}>
                <Button title='Submeter' onPress={submeterAvaliacao}/>
            </View>
        </View>
    )
}
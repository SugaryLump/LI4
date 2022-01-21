import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { ListItem, Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from '../lib/constants'
import * as Location from 'expo-location' 
import { LocationEventEmitter } from 'expo-location/build/LocationEventEmitter'
import { Local } from '../../common/model/LocalNoturno'

export function fetchEstabelecimentos(aberto:boolean, disco:boolean, bar:boolean, nome:string) : Local[] {
    return [];
}

export const EstabelecimentosMenu = ({ navigation, route }:any) => {
    const [location, setLocation] = useState({})
    const [locationMessage, setLocationMessage] = useState('Obtaining location...')
    const [debug, setDebug] = useState(0);
    
    

    const updateLocation= async () => {
        let permission = await Location.requestForegroundPermissionsAsync();
        if (permission.granted) {
            let location = await Location.getCurrentPositionAsync();
            setLocation(location);
            setLocationMessage(JSON.stringify(location));
            return;
        }
        else {
            setLocationMessage('Location permission denied');
        }
    }

    return (
        <View style={constants.styles.container}>
            <View style={constants.styles.centered}>
                <Button title='Filtrar' onPress={() => navigation.navigate({name:'Filtros', params:route.params,})}/>
                <Button title='Atualizar Localização' onPress={() => updateLocation()}/>
                <Text>{locationMessage}</Text>
                <Text>{debug}</Text> 
            </View>
        </View>
    )
}
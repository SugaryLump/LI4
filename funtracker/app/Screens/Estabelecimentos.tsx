import React, { useState } from 'react'
import { View } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from '../lib/constants'
import * as Location from 'expo-location' 
import { LocationEventEmitter } from 'expo-location/build/LocationEventEmitter'

export const EstabelecimentosMenu = ({ router, navigation }:any) => {
    const [location, setLocation] = useState({})
    const [locationMessage, setLocationMessage] = useState('Obtaining location...')

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
            <Text>{locationMessage}</Text>
            <View style={constants.styles.footer}>
                <View style={{alignItems:'center', padding:20}}>
                    <Button title='Refresh Location' onPress={() => updateLocation()}/>
                </View>
            </View>
        </View>
    )
}
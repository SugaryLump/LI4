import React, { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Platform, Linking, Dimensions } from 'react-native'
import { Button, Text, Image, Input, Divider, CheckBox } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as constants from '../lib/constants'
import * as Location from 'expo-location'
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens'
import MapView from 'react-native-maps'

export default function AdicionarMenu({ navigation, route} : any) {
    const [imagem, setImagem] = useState('placeholder')

    const [nome, setNome] = useState('')

    const [contacto, setContacto] = useState('')

    const [disco, setDisco] = useState(false)
    const [bar, setBar] = useState(false)

    const [abertura, setAbertura] = useState(new Date(0))
    const [fecho, setFecho] = useState(new Date(1209550000))
    const [horaMode, setHoraMode] = useState('abertura')
    const [showTimePicker, setShowTimePicker] = useState(false)

    const [latitude, setLatitude] = useState(route.params?.latitude)
    const [longitude, setLongitude] = useState(route.params?.longitude)
    const [morada, setMorada] = useState('')

    const[debug, setDebug] = useState(0)

    const pickImage = async () => {
        let newImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1,1],
            quality:1
        });

        if (!newImage.cancelled) {
            setImagem(newImage.uri);
        }
    }

    const onTimeChange = (event: any, selectedDate: Date|undefined) => {
        var horaFunc = setAbertura
        var oldHora = abertura
        if (horaMode === 'fecho') {
            horaFunc = setFecho
            oldHora = fecho
        }

        let novaHora = selectedDate || oldHora
        setShowTimePicker(Platform.OS === 'ios');
        horaFunc(novaHora)
    };

    const atualizaCoordenadas = async () => {
        let location = (await Location.geocodeAsync(morada))[0]
        setLatitude(location.latitude)
        setLongitude(location.longitude)
    }

    function createMapURL():string {
        return (
            'https://www.google.com/maps/search/?api=1&query=' + latitude +
                '%2C' + longitude
        )
    }

    function padTime (time: number): string {
        if (time < 10) {
            return '0'.concat(time.toString())
        }
        else {
            return time.toString()
        }
    }

    return(
        <View style={{flex:1, maxWidth:800}}>
            <ScrollView>
                <View style={{alignItems:'center', height:200, aspectRatio:1/1, marginTop:10, alignSelf:'center'}}>
                        <Image 
                            source={{uri:imagem}}
                            containerStyle={{flex:1, alignSelf:'stretch'}}
                        />
                </View>
                <View style={{marginHorizontal:15, marginVertical:10}}>
                    <Button title="Adicionar Imagem" onPress={pickImage}/>
                </View>
                <Divider/>
                <View style={{marginHorizontal:20, marginVertical:15}}>
                    <Input
                        placeholder='Nome do estabelecimento'
                        maxLength={50}
                        onChangeText={(nome) => setNome(nome)}
                    />
                    <Input
                        placeholder='Telefone'
                        maxLength={9}
                        onChangeText={(tlm) => setContacto(tlm)}
                    />
                    <View style={{marginHorizontal:15}}>
                        <CheckBox title='Bar' checked={bar} onPress={() => setBar(!bar)} />
                        <CheckBox title='Discoteca' checked={disco} onPress={() => setDisco(!disco)} />
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center', marginVertical:20}}>
                        <Text style={{fontSize:18}}>Aberto das </Text>
                        <TouchableOpacity 
                            onPress={() => {setHoraMode('abertura');setShowTimePicker(true)}}
                            activeOpacity={0.5}
                        >
                            <Text style={{fontSize:18, color:constants.colors.lightBlue}}>{abertura.getHours()}:{padTime(abertura.getMinutes())}</Text>
                        </TouchableOpacity>
                        <Text style={{fontSize:18}}> às </Text>
                        <TouchableOpacity
                            onPress={() => {setHoraMode('fecho');setShowTimePicker(true)}}
                            activeOpacity={0.5}
                        >
                            <Text style={{fontSize:18, color:constants.colors.lightBlue}}>{fecho.getHours()}:{padTime(fecho.getMinutes())}</Text>
                        </TouchableOpacity>
                    </View>
                    <Input
                        placeholder='Morada'
                        onChangeText={(morada) => setMorada(morada)}
                        onBlur={atualizaCoordenadas}
                    />
                </View>
                <MapView
                        style={{height:Dimensions.get('window').height/3, width:Dimensions.get('window').width}}
                        region={{latitude:latitude, longitude:longitude, latitudeDelta:0.005, longitudeDelta:0.005}}
                        showsCompass={false}
                        scrollEnabled={false}
                        onPress={() => {Linking.openURL(createMapURL())}}
                />
                <View style={{marginHorizontal:15, marginVertical:20}}>
                    <Button title='Submeter'/>
                </View>
            </ScrollView>
            {showTimePicker && (
                <DateTimePicker
                    value={new Date(0)}
                    mode={'time'}
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                />
            )}
        </View>
    )
}
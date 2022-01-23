import React, { createRef, useState } from 'react'
import { View, ScrollView, TouchableOpacity, Platform, Linking, Dimensions } from 'react-native'
import { Button, Text, Image, Input, Divider, ButtonGroup, CheckBox, colors } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as constants from '../lib/constants'
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppParamList } from '../routeTypes'
import { TextInput } from 'react-native-gesture-handler'
import { useAuthContext } from '../hooks'

export default function AdicionarMenu({ navigation, route }: NativeStackScreenProps<AppParamList, 'Adicionar'>) {
    const [imagem, setImagem] = useState('placeholder')

    const [nome, setNome] = useState('')

    const [contacto, setContacto] = useState('')

    const [lotacao, setLotacao] = useState('')

    const [disco, setDisco] = useState(false)
    const [bar, setBar] = useState(false)

    const [preco, setPreco] = useState(0)

    const [abertura, setAbertura] = useState(new Date(0))
    const [fecho, setFecho] = useState(new Date(1209550000))
    const [horaMode, setHoraMode] = useState('abertura')
    const [showTimePicker, setShowTimePicker] = useState(false)

    const [latitude, setLatitude] = useState(route.params?.latitude)
    const [longitude, setLongitude] = useState(route.params?.longitude)
    const [morada, setMorada] = useState('')

    const [imageBase64, setImageBase64] = useState<string | null>()
    const [imageMime, setImageMime] = useState<string | null>()

    const [errorMessage, setErrorMessage] = useState('')

    const telefoneRef = createRef<TextInput>()
    const lotacaoRef = createRef<TextInput>()

    const authContext = useAuthContext()

    const pickImage = async () => {
        let newImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        });

        if (!newImage.cancelled) {
            setImagem(newImage.uri);
            setImageBase64(newImage.base64)
            if (newImage.uri.endsWith('.png')) {
                setImageMime('image/png')
            } else if (newImage.uri.endsWith('.jpeg') || newImage.uri.endsWith('.jpg')) {
                setImageMime('image/jpeg')
            }
        }
    }

    const onTimeChange = (event: any, selectedDate: Date | undefined) => {
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
        setLatitude(location?.latitude)
        setLongitude(location?.longitude)
    }

    function createMapURL(): string {
        return (
            'https://www.google.com/maps/search/?api=1&query=' + latitude +
            '%2C' + longitude
        )
    }

    function padTime(time: number): string {
        if (time < 10) {
            return '0'.concat(time.toString())
        }
        else {
            return time.toString()
        }
    }

    const submeter = async () => {
        let categorias: string[] = []

        if (bar) categorias.push("Bar")
        if (disco) categorias.push("Discoteca")

        try {
            let res = await authContext.fetchWithJwt('/estabelecimento', 'POST', {
                nome,
                lotacao: +lotacao,
                gamaPreco: '$'.repeat(preco + 1) as '$' | '$$' | '$$$',
                categorias,
                horarioAbertura: abertura.getHours() + ":" + abertura.getMinutes(),
                horarioFecho: fecho.getHours() + ":" + fecho.getMinutes(),
                contacto,
                image: imageBase64!,
                coordenadas: {
                    latitude: latitude?.toString() ?? "0",
                    longitude: longitude?.toString() ?? "0"
                },
                morada,
                fileMime: imageMime!
            })

            if (res.success) {
                navigation.replace('Estabelecimento', { id: res.estabelecimento.id })
            } else {
                setErrorMessage(res.errors[0])
            }
        } catch (e) {
            console.log("????")
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <ScrollView style={{
                width: '100%', maxWidth: 800,
                padding: 15
            }}>
                <Image
                    source={{ uri: imagem }}
                    containerStyle={{ height: 200, aspectRatio: 1 / 1, alignSelf: 'center', marginBottom: 15 }}
                />
                <Button title="Adicionar Imagem" onPress={pickImage} />
                <Divider style={{ marginVertical: 15 }} />
                <Input
                    placeholder='Nome do estabelecimento'
                    maxLength={50}
                    onChangeText={(nome) => setNome(nome)}
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => telefoneRef.current?.focus()}
                />
                <Input
                    placeholder='Telefone'
                    maxLength={9}
                    onChangeText={(tlm) => setContacto(tlm)}
                    keyboardType='phone-pad'
                    ref={telefoneRef}
                    returnKeyType='next'
                    blurOnSubmit={false}
                    onSubmitEditing={() => lotacaoRef.current?.focus()}
                />
                <Input
                    placeholder="Lotação máxima"
                    onChangeText={setLotacao}
                    keyboardType='numeric'
                    ref={lotacaoRef}
                />
                <CheckBox title='Bar' checked={bar} onPress={() => setBar(!bar)} />
                <CheckBox title='Discoteca' checked={disco} onPress={() => setDisco(!disco)} />
                <Text style={{ fontSize: 15, padding: 15, }}>Selecione uma gama de preço</Text>
                <ButtonGroup
                    buttons={['€', '€€', '€€€']}
                    selectedIndex={preco}
                    onPress={(preco) => setPreco(preco)}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
                    <Text style={{ fontSize: 18 }}>Aberto das </Text>
                    <TouchableOpacity
                        onPress={() => { setHoraMode('abertura'); setShowTimePicker(true) }}
                        activeOpacity={0.5}
                    >
                        <Text style={{ fontSize: 18, color: constants.colors.lightBlue }}>{abertura.getHours()}:{padTime(abertura.getMinutes())}</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18 }}> às </Text>
                    <TouchableOpacity
                        onPress={() => { setHoraMode('fecho'); setShowTimePicker(true) }}
                        activeOpacity={0.5}
                    >
                        <Text style={{ fontSize: 18, color: constants.colors.lightBlue }}>{fecho.getHours()}:{padTime(fecho.getMinutes())}</Text>
                    </TouchableOpacity>
                </View>
                <Input
                    placeholder='Morada'
                    onChangeText={(morada) => setMorada(morada)}
                    onBlur={atualizaCoordenadas}
                />
                <MapView
                    style={{ height: Dimensions.get('window').height / 3, marginBottom: 15 }}
                    region={{ latitude: latitude ?? 0, longitude: longitude ?? 0, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
                    showsCompass={false}
                    scrollEnabled={false}
                    onPress={() => { Linking.openURL(createMapURL()) }}
                >
                    { latitude !== undefined && longitude !== undefined &&
                        <Marker
                            coordinate={{ latitude, longitude }}
                            title={ nome }
                            description={ nome }
                        />
                    }
                </MapView>
                { errorMessage !== '' && <Text style={{ color: colors.error }}>{ errorMessage }</Text>}
                <Button title='Adicionar' onPress={submeter} disabled={imagem === 'placeholder' || nome === '' || contacto === '' || lotacao === '' || (!bar && !disco) || morada == '' || latitude === undefined || longitude === undefined}/>
                <View style={{ height: 25 }}>
                    {/* Hacky, mas o marginBottom não está a funcionar no submeter for some reason, por isso serve para espaçar o fundo */}
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
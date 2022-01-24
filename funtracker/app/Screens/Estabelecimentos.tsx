import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { serverUrl } from '../lib/constants'
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { AirbnbRating, Image, Text, Button, colors } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import * as Location from 'expo-location'
import * as Popup from 'react-native-popup-menu'
import { Divider } from 'react-native-elements/dist/divider/Divider'
import { Coordinate } from 'react-native-maps'
import { useAuthContext } from '../hooks'
import { LoadingMenu } from './LoadingMenu'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppParamList } from '../routeTypes'
import { API } from '../../common/apiTypes'

class LocalNoturno {
    constructor(
        public id: number,
        public nome: string,
        public rating: number,
        public gamaPreco: string,
        public totalRatings: number,
        public categorias: string[],
        public imagem: string,
    ) { }
}


export const EstabelecimentosMenu = ({ navigation, route }: NativeStackScreenProps<AppParamList, 'Estabelecimentos'>) => {
    const [location, setLocation] = useState({} as Location.LocationObject)
    const [error, setError] = useState('')
    const [estabelecimentos, setEstabelecimentos] = useState<LocalNoturno[] | undefined>(undefined)

    const authContext = useAuthContext()

    async function fetchEstabelecimentos(aberto: boolean, disco: boolean, bar: boolean, ordem: number, nome: string): Promise<LocalNoturno[] | undefined> {
        // Atualizar a lista
        let filtros: API['/estabelecimento']['GET']['req'] = {} // TODO
        if (aberto) filtros.aberto = true
        let categorias = []
        if (bar) categorias.push('Bar')
        if (disco) categorias.push('Discoteca')
        if (categorias.length > 0) filtros.categorias = categorias.join(',')
        if (route.params.preco > 0) filtros.precos = '$'.repeat(route.params.preco) as '$' | '$$' | '$$$'
        if (ordem > 0) {
            switch (ordem) {
                case 1:
                    filtros.order = 'Proximidade'
                    filtros.latitude = location.coords.latitude.toString()
                    filtros.longitude = location.coords.longitude.toString()
                    break;
                case 2:
                    filtros.order = 'Precos'
                    break;
                case 3:
                    filtros.order = 'Criticas'
                    break;
            }
        }
        if (route.params.searched) filtros.nome = nome

        let r = await authContext.fetchWithJwt('/estabelecimento', 'GET', filtros)
        if (r.success) {
            return r.estabelecimentos.map(e => {
                return new LocalNoturno(e.id, e.nome, +e.rating.toFixed(1), e.gamaPreco, e.numberRatings, e.categorias, serverUrl + "/" + e.imageUrls[0])
            })
        }
        else {
            setError(r.errors[0])
        }
    }

    //Search
    useFocusEffect(useCallback(() => {
        updateLocation()
        navigation.setParams({
            searched: true
        })
        fetchEstabelecimentos(route.params?.aberto,
            route.params.disco,
            route.params.bar,
            route.params.ordem,
            route.params.nome ?? '').then((arr) => {
                setEstabelecimentos(arr);
            }).catch(e => console.log(e))

        return () => {}
    }, []));

    useLayoutEffect(() => {
        const MyMenuOption = (props: any) => {
            return (
                <Popup.MenuOption
                    style={{ borderTopWidth: 1, borderColor: '#eeeeee' }}
                    value={props.value}
                >
                    <Text style={{ fontSize: 15, padding: 10 }}>{props.text}</Text>
                </Popup.MenuOption>
            )
        }

        const AdminOption = () => {
            if (authContext.isAdmin) {
                return (
                    <MyMenuOption
                        text='Adicionar local'
                        value={{
                            menu: 'Adicionar', params: {
                                latitude: location.coords?.latitude,
                                longitude: location.coords?.longitude
                            }
                        }}
                    />
                )
            }
            else {
                return (<></>)
            }
        }

        // TODO: Colocar o value no seu próprio tipo
        const onSelect = (value: any) => {
            navigation.navigate(value.menu, value.params)
        }

        navigation.setOptions({
            headerRight: () => (
                <Popup.Menu onSelect={onSelect} >
                    <Popup.MenuTrigger>
                        <View style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>⋮</Text>
                        </View>
                    </Popup.MenuTrigger>

                    <Popup.MenuOptions>
                        <AdminOption />
                        <MyMenuOption text='Histórico de Avaliações' value={{ menu: 'Historico', params: {} }} />
                        <MyMenuOption text='Opções' value={{ menu: 'Opcoes', params: {} }} />
                    </Popup.MenuOptions>
                </Popup.Menu>
            )
        })

        return () => {}
    }, [])

    const updateLocation = async () => {
        let permission = await Location.requestForegroundPermissionsAsync();
        if (permission.granted) {
            let location = await Location.getCurrentPositionAsync();
            setLocation(location);
        }
    }

    const renderLocalTile = ({ item, index }: { item: LocalNoturno, index: number }) => {
        const CardText = (props: any) => {
            return (
                <Text style={{ paddingRight: 5, color: '#a0a0a0' }}>
                    {props.text}
                </Text>
            )
        }
        return (
            //Something is padding these cards and I don't know what
            <TouchableOpacity key={index} onPress={() => navigation.navigate({ name: 'Estabelecimento', params: { id: item.id } })} activeOpacity={0.7}>
                <View
                    key={index}
                    style={{
                        height: 130,
                        marginVertical: 5,
                        flexDirection: 'row',
                    }}
                >
                    <Image
                        source={{ uri: item.imagem }}
                        containerStyle={{ aspectRatio: 1 / 1, alignSelf: 'stretch' }}
                    />
                    <View style={{ paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: 16 }}>{item.nome}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <CardText text={item.rating} />
                            <AirbnbRating
                                defaultRating={item.rating}
                                isDisabled={true}
                                showRating={false}
                                size={10}
                                starContainerStyle={{ transform: [{ translateY: 0 }], paddingRight: 5 }}
                                selectedColor='#ffd500'
                            />
                            <CardText text='•' />
                            <CardText text={JSON.stringify(item.totalRatings).concat(' críticas')} />
                            <CardText text='•' />
                            <CardText text={item.gamaPreco} />
                        </View>
                        <CardText text={item.categorias.join('   •   ')} />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    if (estabelecimentos === undefined)
        return <LoadingMenu />
    if (error !== '')
        return <View style={{ alignItems: 'center', flex: 1}}>
            <Text style={{ color: colors.error }}>{ error }</Text>
        </View>

    return (
        <View style={{
            alignItems: 'center',
            flex: 1,
            padding: 15
        }}>
            <View style={{
                width: '100%',
                maxWidth: 800,
                flex: 1,
            }}>
                <Button
                    title='Filtrar'
                    onPress={() => navigation.navigate({ name: 'Filtros', params: route.params, })}
                />
                <Divider style={{ marginVertical: 15 }} />
                <FlatList
                    data={estabelecimentos}
                    renderItem={renderLocalTile}
                />

                <Divider style={{ marginVertical: 15 }} />

                <Button title='Atualizar Localização' onPress={() => updateLocation()} />
            </View>
        </View>
    )
}

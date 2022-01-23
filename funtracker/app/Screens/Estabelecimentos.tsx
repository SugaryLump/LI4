import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { AirbnbRating, Image, Text, Button } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import * as Location from 'expo-location'
import * as Popup from 'react-native-popup-menu'
import { Divider } from 'react-native-elements/dist/divider/Divider'
import { Coordinate } from 'react-native-maps'
import { useAuthContext } from '../hooks'
import { LoadingMenu } from './LoadingMenu'

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

export function fetchEstabelecimentos(aberto: boolean, disco: boolean, bar: boolean, ordem: number, nome: string): LocalNoturno[] {
    //Fazer o fetch da pesquisa aqui, tendo em conta que se o nome não for null
    //temos de fazer um get(nome) (nem é pesquisa, é mesmo só ir buscar o
    //local com esse nome)

    //Resultado false temporário
    let locais = [(new LocalNoturno(0, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(1, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(2, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(3, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(4, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(5, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(6, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(7, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(8, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(9, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(10, 'Taberna Linda', 4, '€', 32, ['Bar'], 'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg'))]
    return locais;
}

export const EstabelecimentosMenu = ({ navigation, route }: any) => {
    const [location, setLocation] = useState({} as Location.LocationObject)
    const [locationMessage, setLocationMessage] = useState('A obter localização')
    const [estabelecimentos, setEstabelecimentos] = useState<LocalNoturno[] | undefined>(undefined)
    const [debug, setDebug] = useState(0)

    const authContext = useAuthContext()
    

    //Search
    useEffect(() => {
        if (!route.params?.searched) {
            setDebug(debug+1)
            updateLocation()
            navigation.setParams({
                searched: true
            })
            let locais: LocalNoturno[] =
                fetchEstabelecimentos(route.params?.aberto,
                    route.params?.boolean,
                    route.params?.bar,
                    route.params?.order,
                    route.params?.nome);
            setEstabelecimentos(locais);
        }
    });

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

        // Atualizar a lista
        let filtros = {} // TODO
        authContext.fetchWithJwt('/estabelecimento', 'GET', filtros).then(r => {
            if (r.success) {
                // TODO: Incluir o total de ratings
                let locais = r.estabelecimentos.map(e => new LocalNoturno(e.id, e.nome, e.rating, e.gamaPreco, 0, e.categorias, e.imageUrls[0]))
                setEstabelecimentos(locais)
            }
        })
    }, [])

    const updateLocation = async () => {
        let permission = await Location.requestForegroundPermissionsAsync();
        if (permission.granted) {
            let location = await Location.getCurrentPositionAsync();
            setLocation(location);
            setLocationMessage(JSON.stringify(location.coords));
            return;
        }
        else {
            setLocationMessage('Permissão de localização recusada');
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
                <Text>{locationMessage}</Text>
                <Text>{debug}</Text>
            </View>
        </View>
    )
}

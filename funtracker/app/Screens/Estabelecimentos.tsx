import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { AirbnbRating, Card, Text, Button } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from '../lib/constants'
import * as Location from 'expo-location' 
import { LocationEventEmitter } from 'expo-location/build/LocationEventEmitter'
import { ListItem } from 'react-native-elements/dist/list/ListItem'
import * as Popup from 'react-native-popup-menu'

class LocalNoturno {
    constructor(
        public key:number,
        public nome:string,
        public rating:number,
        public gamaPreco:string,
        public totalRatings:number,
        public categorias:string[],
        public imagem:string,
    ) {}
}

export function fetchEstabelecimentos(aberto:boolean, disco:boolean, bar:boolean, ordem:number, nome:string) : LocalNoturno[] {
    //Fazer o fetch da pesquisa aqui, tendo em conta que se o nome não for null
    //temos de fazer um get(nome) (nem é pesquisa, é mesmo só ir buscar o
    //local com esse nome)

    //Resultado false temporário
    let locais = [(new LocalNoturno(0,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(1,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(2,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(3,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(4,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(5,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(6,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(7,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(8,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(9,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg')),
    (new LocalNoturno(10,'TabernaLinda', 4, '€', 32, ['Bar'],'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg'))]
    return locais;
}

export const EstabelecimentosMenu = ({ navigation, route }:any) => {
    const [location, setLocation] = useState({})
    const [locationMessage, setLocationMessage] = useState('A obter localização')
    const [estabelecimentos, setEstabelecimentos] = useState([] as LocalNoturno[])
    const [debug, setDebug] = useState(0)
    
    //Search
    useEffect (() => {
        if (!route.params?.searched) {
            navigation.setParams({
                searched:true
            })
            let locais : LocalNoturno[] = 
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
                    style={{borderTopWidth:1, borderColor:'#eeeeee'}}
                    value={props.value}
                >
                    <Text style={{fontSize:15, padding:10}}>{props.text}</Text>
                </Popup.MenuOption>
            )
        }
        const AdminOption = () => {
            //check if admin
            let isAdmin=true
            if (isAdmin) {
                return (
                    <MyMenuOption
                        text='Adicionar localização'
                        value={{menu:'placeholder1', params:{}}}
                    />
                )
            }
            else {
                return (<></>)
            }
        }
        navigation.setOptions({
            headerRight: () => (
                <Popup.Menu onSelect={value => {navigation.navigate({name:value.menu, params:value.params})}}>
                    <Popup.MenuTrigger>
                        <View style={{paddingVertical:10, paddingHorizontal:20}}>
                        <Text style={{fontSize:25, fontWeight:'bold'}}>⋮</Text>
                        </View>
                    </Popup.MenuTrigger>

                    <Popup.MenuOptions>
                        <AdminOption/>
                        <MyMenuOption text='Histórico de Avaliações' value={{menu:'placeholder2', params:{}}}/>
                        <MyMenuOption text='Opções...' value={{menu:'placeholder3', params:{}}}/>
                    </Popup.MenuOptions>
                </Popup.Menu>
              )
        })
    })

    const updateLocation= async () => {
        let permission = await Location.requestForegroundPermissionsAsync();
        if (permission.granted) {
            let location = await Location.getCurrentPositionAsync();
            setLocation(location);
            setLocationMessage(JSON.stringify(location));
            return;
        }
        else {
            setLocationMessage('Permissão de localização recusada');
        }
    }

    const renderLocalTile = ({ item, index }:{item:LocalNoturno, index:number}) => {
        const CardText = (props:any) => {
            return (
                <Text style={{paddingRight:5, color:'#a0a0a0'}}>
                    {props.text}
                </Text>
            )
        }
        return (
            //Something is padding these cards and I don't know what
            <TouchableOpacity key={index} onPress={() => navigation.navigate({name:'Estabelecimento', params:{key:item.key}})} activeOpacity={0.7}>
                <View>
                    <Card 
                        containerStyle={{
                            elevation:0,
                            borderWidth:0,
                            paddingVertical:10,
                            paddingHorizontal:0, 
                            backgroundColor:'#f2f2f2'}}
                    >
                        <View style={{flexDirection:'row'}}>
                            <Card.Image
                                source={{uri:item.imagem}}
                                containerStyle={{height:85, width:85}}
                                transition={true}
                                transitionDuration={180}
                                resizeMode='repeat'/>
                            <View style={{paddingHorizontal:20, paddingVertical:25}}>
                                <View style={{flexDirection:'row'}}>
                                    <CardText text={item.rating}/>
                                    <AirbnbRating 
                                        defaultRating={item.rating}
                                        isDisabled={true}
                                        showRating={false}
                                        size={10}
                                        starContainerStyle={{transform:[{ translateY:0 }], paddingRight:5}}
                                        selectedColor='#ffd500'
                                    />
                                    <CardText text='•'/>
                                    <CardText text={JSON.stringify(item.totalRatings).concat(' críticas')}/>
                                    <CardText text='•'/>
                                    <CardText text={item.gamaPreco}/>
                                </View>
                                <CardText text={item.categorias.join('   •   ')}/>
                            </View>
                        </View>
                    </Card>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={constants.styles.container}>
            <View style={constants.styles.contentContainer}>
                <View style={constants.styles.centered}>
                    <Button title='Filtrar' onPress={() => navigation.navigate({name:'Filtros', params:route.params,})} containerStyle={{paddingVertical:20}}/>
                    <FlatList
                        data={estabelecimentos}
                        renderItem={renderLocalTile}
                    />
                </View>
            </View>
            <View style={constants.styles.footer}>
                <Button title='Atualizar Localização' onPress={() => updateLocation()}/>
                <Text>{locationMessage}</Text>
                <Text>DEBUG: {debug}</Text> 
            </View>
        </View>
    )
}
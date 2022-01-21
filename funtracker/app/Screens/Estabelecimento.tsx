import { NavigationHelpersContext } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { ScrollView, View, FlatList, useWindowDimensions, Dimensions, Linking } from 'react-native'
import { AirbnbRating, LinearProgress, Image, Text, Button } from 'react-native-elements'
import * as constants from '../lib/constants'
import { EstabelecimentosMenu } from './Estabelecimentos'
import MapView from 'react-native-maps'

class LocalNoturno {
    constructor(
        public key:number,
        public nome:string,
        public rating:number,
        public gamaPreco:string,
        public totalRatings:number,
        public categorias:string[],
        public imagem:string,
        public percentRatingsByGrade:number[], //[0.07,0.13,0.20,0.45,0.15] por exemplo
        public contacto:string, //telemóvel
        public criticas:{nome:string, text:string, rating:number}[],
        public abertura:string,
        public fecho:string,
        public latitude:number,
        public longitude:number,
    ) {}
}

export const EstabelecimentoMenu = ({ navigation, route }: any) => {
    const [estabelecimento,setEstabelecimento] = useState(fetchLocalNoturno(route.params?.key))


    function fetchLocalNoturno(key:number) : LocalNoturno {
        //Pedir ao server o local pelo seu key
    
        //fake result para demo
        let local = new LocalNoturno(
                        0, 'Taberna Linda', 4, '€', 32, ['Bar'],
                        'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg',
                        [0.07,0.13,0.20,0.45,0.15],'934669512',
                        [{nome:"Joberto",text:"épico",rating:4},{nome:"Mauricio",text:"gostoso",rating:3}, {nome:"Josefina",text:"não poggers",rating:5}],
                        "14:00", "23h00", 41.6889, -8.8366);
        return local;
    }

    useEffect (() => {
        navigation.setOptions({title:estabelecimento.nome})
    })

    const RatingPercentageBar = (props:any) => {
        return (
            <LinearProgress
                value={props.percentage}
                variant='determinate'
                style={{borderRadius:10, flex:0.08}}
                color='#ffd500'
                trackColor='#ededed'
            />
        )
    }

    /*const AdminButton = () => {
        let admin = true; //Temos de verificar se é admin para mostrar isto ou não
        if (admin) {
            return (
                <Button title='Adicionar foto' onPress={() => navigation.navigate({name:'AdicionarFoto', params:{key:estabelecimento.key}})}/>
            )
        }
        else {
            return (<></>)
        }
    }*/

    return (
        <View style={{flex:1}}>
            <ScrollView>
                <View style={{alignItems:'center', height:200, aspectRatio:1/1, marginTop:10, alignSelf:'center'}}>
                    <Image 
                        source={{uri:estabelecimento.imagem}}
                        containerStyle={{flex:1, alignSelf:'stretch'}}
                    />
                </View>
                <View style={{marginTop:15}}>
                    <Text style={{paddingHorizontal:25, fontSize:15, fontWeight:'bold'}}>Resumo das críticas</Text>
                    <View style={{flex:0.25, flexDirection:'row'}}>
                        <View style={{flex:0.08, alignItems:'center', justifyContent:'space-around'}}>
                            <Text style={{color:'#909090'}}>5</Text>
                            <Text style={{color:'#909090'}}>4</Text>
                            <Text style={{color:'#909090'}}>3</Text>
                            <Text style={{color:'#909090'}}>2</Text>
                            <Text style={{color:'#909090'}}>1</Text>
                        </View>
                        <View style={{flex:0.5, alignItems:'center', justifyContent:'space-around'}}>
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[0]}/>
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[1]}/>
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[2]}/>
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[3]}/>
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[4]}/>
                        </View>
                        <View style={{flex:0.42, alignItems:'center', justifyContent:'space-around', paddingBottom:5}}>
                            <Text style={{fontSize:50}}>{estabelecimento.rating}</Text>
                            <AirbnbRating
                                isDisabled
                                defaultRating={estabelecimento.rating}
                                size={20}
                                selectedColor='#ffd500'
                                showRating={false}
                            />
                            <Text>{estabelecimento.totalRatings} críticas</Text>
                        </View>
                    </View>
                    <View style={{flex:0.50,marginTop:15, marginHorizontal:10}}>
                        {estabelecimento.criticas.map((critica) => {
                            return (
                                <View style={{marginBottom:30}}>
                                        <Text style={{marginLeft:2, fontSize:15, color:'#000'}}>{critica.nome}</Text>
                                        <AirbnbRating
                                            isDisabled
                                            defaultRating={critica.rating}
                                            size={8}
                                            selectedColor='#ffd500'
                                            showRating={false}
                                            starContainerStyle={{alignSelf:'flex-start'}}
                                        />
                                    <Text style={{fontSize:13, marginLeft:3}}>{critica.text}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={{marginVertical:50, marginHorizontal:20}}>
                    <View style={{flexDirection:"row", marginBottom:20, justifyContent:'space-between'}}>
                        <View>
                            {estabelecimento.categorias.map((categoria) => {
                                return (
                                    <View style={{paddingBottom:5}}>
                                        <Text style={{fontSize:15}}>✓  {categoria}</Text>
                                    </View>
                                )
                            })}
                        </View>
                        <Text>📞  {estabelecimento.contacto}</Text>
                    </View>
                    <Text>🕒  Aberto das {estabelecimento.abertura} às {estabelecimento.fecho}</Text>
                </View>
                <View>
                    <MapView
                        style={{height:Dimensions.get('window').height/3, width:Dimensions.get('window').width}}
                        initialRegion={{latitude:estabelecimento.latitude, longitude:estabelecimento.longitude, latitudeDelta:0.005, longitudeDelta:0.005}}
                        showsCompass={false}
                        scrollEnabled={false}
                        onPress={() => {
                            Linking.openURL('https://www.google.com/maps/search/?api=1&query=' +
                                             estabelecimento.latitude +
                                             '%2C' +
                                             estabelecimento.longitude)}}
                    />
                </View>
                <View style={{marginHorizontal:10, marginVertical:20}}>
                <Button title='Avaliar' onPress={() => navigation.navigate({name:'Avaliar', params:{key:estabelecimento.key}})}/>
                </View>
            </ScrollView>
        </View>
    )
}
import { NavigationHelpersContext } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { ScrollView, View, FlatList } from 'react-native'
import { AirbnbRating, LinearProgress, Image, Text } from 'react-native-elements'
import * as constants from '../lib/constants'
import { EstabelecimentosMenu } from './Estabelecimentos'

class LocalNoturno {
    constructor(
        public id:number,
        public nome:string,
        public rating:number,
        public gamaPreco:string,
        public totalRatings:number,
        public categorias:string[],
        public imagem:string,
        public percentRatingsByGrade:number[], //[0.07,0.13,0.20,0.45,0.15] por exemplo
        public contacto:string, //telemóvel
        public criticas:string[][],
        public abertura:string,
        public fecho:string,
    ) {}
}

export const EstabelecimentoMenu = ({ navigation, route }: any) => {
    const [estabelecimento,setEstabelecimento] = useState(fetchLocalNoturno(route.params?.id))


    function fetchLocalNoturno(id:number) : LocalNoturno {
        //Pedir ao server o local pelo seu id
    
        //fake result para demo
        let local = new LocalNoturno(
                        0, 'Taberna Linda', 4, '€', 32, ['Bar'],
                        'https://i.pinimg.com/originals/98/ba/48/98ba48c230f378e064a02ec15c3b7227.jpg',
                        [0.07,0.13,0.20,0.45,0.15],'934669512', [["Joberto","épico"],["Mauricio", "gostoso"], ["Josefina","não poggers"]],
                        "14:00", "23h00");
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

    return (
        <View style={{flex:1, paddingVertical:15, paddingHorizontal:10}}>
            <ScrollView>
                <View style={{alignItems:'center', height:200, aspectRatio:1/1, alignSelf:'center'}}>
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
                                <View style={{paddingBottom:30}}>
                                    <Text style={{fontSize:15, fontWeight:'bold'}}>{critica[0]}</Text>
                                    <Text style={{fontSize:13, color:'#000000'}}>{critica[1]}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={{marginTop:50}}>
                    <View style={{marginHorizontal:20}}>
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
                </View>

            </ScrollView>
        </View>
    )
}
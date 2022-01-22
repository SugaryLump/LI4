import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { Card, AirbnbRating, Text, Image } from 'react-native-elements'
import { AppParamList } from '../routeTypes'

class Critica {
    constructor(
        public id:number,
        public rating:number,
        public texto:string,
        public imagem:string,
    ){}
}

export default function HistoricoMenu({ navigation, route }: NativeStackScreenProps<AppParamList, 'Historico'>) {
    const[criticas, setCriticas] = useState(fetchCriticas())

    function fetchCriticas () {
        //Temos de ir buscar as críticas do user autenticado
        let criticas = [new Critica(1,4, 'épico', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(2,3, 'meh, seen better', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(3,5, '30 CARAMBAS!!!', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(4,4, 'épico', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(5,3, 'meh, seen better', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(6,5, '30 CARAMBAS!!!', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(7,4, 'épico', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(8,3, 'meh, seen better', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(9,5, '30 CARAMBAS!!!', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg')]
        return criticas
    }

    const renderCritica = ({ item, index }:{item:Critica, index:number}) => {
        return (
            <View
                key={index}
                style={{
                    height:Dimensions.get('window').height/6,
                    marginHorizontal:10,
                    marginVertical:5,
                    flexDirection:'row',
                    justifyContent:'space-around'
                }}
            >
                <Image
                    source={{uri:item.imagem}}
                    containerStyle={{aspectRatio:1/1,flex:0.34,alignSelf:'stretch'}}
                />
                <View style={{flex:0.6, alignItems:'flex-start',marginTop:5}}>
                    <AirbnbRating 
                        defaultRating={item.rating}
                        isDisabled={true}
                        showRating={false}
                        size={10}
                        selectedColor='#ffd500'
                    />
                    <Text style={{fontSize:13, marginTop:10}}>{item.texto}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex:1}}>
            <FlatList
                data={criticas}
                renderItem={renderCritica}
                
            >
            </FlatList>
        </View>
    )
}
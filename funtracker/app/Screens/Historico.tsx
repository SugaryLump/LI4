import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useState } from 'react'
import { View, FlatList, Dimensions } from 'react-native'
import { Card, AirbnbRating, Text, Image } from 'react-native-elements'
import { AppParamList } from '../routeTypes'
import { LoadingMenu } from './LoadingMenu'

class Critica {
    constructor(
        public estabelecimento_id: number,
        public estabelecimento_nome: string,
        public id: number,
        public rating: number,
        public texto: string,
        public imagem: string,
    ){}
}

export default function HistoricoMenu({ navigation, route }: NativeStackScreenProps<AppParamList, 'Historico'>) {
    const [isLoading, setIsLoading] = useState(false)
    const[criticas, setCriticas] = useState(fetchCriticas())

    function fetchCriticas () {
        //Temos de ir buscar as críticas do user autenticado
        let criticas = [new Critica(1, 'Rick Universal', 1,4, 'épico', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 2,3, 'meh, seen better', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 3,5, '30 CARAMBAS!!!', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 4,4, 'épico', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 5,3, 'meh, seen better', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 6,5, '30 CARAMBAS!!!', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 7,4, 'épico', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 8,3, 'meh, seen better', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg'),
                         new Critica(1, 'Rick Universal', 9,5, '30 CARAMBAS!!!', 'https://smallpetsite.com/wp-content/uploads/2020/08/bathing-hedgehog-2-1.jpg')]
        return criticas
    }

    const renderCritica = ({ item, index }:{item:Critica, index:number}) => {
        return (
            <View
                key={index}
                style={{
                    height: 130,
                    marginVertical: 5,
                    flexDirection: 'row',
                }}
            >
                <Image
                    source={{uri:item.imagem}}
                    containerStyle={{ aspectRatio: 1 / 1, alignSelf: 'stretch' }}
                />
                <View style={{ alignItems: 'flex-start', paddingHorizontal: 10 }}>
                    <Text style={{ fontSize: 16 }}>{item.estabelecimento_nome}</Text>
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

    if (isLoading) {
        return <LoadingMenu />
    }
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: '100%', maxWidth: 800 }}>
                {criticas.length > 0 ?
                    <FlatList
                        data={criticas}
                        renderItem={renderCritica}
                        style={{ padding: 15 }}
                    /> : <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Sem avaliações</Text>
                    </View>}
            </View>
        </View>
    )
}
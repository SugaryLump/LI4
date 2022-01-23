import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { Card, AirbnbRating, Text, Image } from 'react-native-elements'
import { useAuthContext } from '../hooks'
import { serverUrl } from '../lib/constants'
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
    const [isLoading, setIsLoading] = useState(true)
    const [criticas, setCriticas] = useState<Critica[] | undefined>(undefined)

    const authContext = useAuthContext()

    async function fetchCriticas () {
        try {
            let r = await authContext.fetchWithJwt('/user/:id/historico', 'GET', {}, { id: authContext.userId! })
            if (r.success) {
                setCriticas(r.historico.map(c => new Critica(c.estabelecimentoNoturnoId, c.estabelecimentoNoturnoNome, c.estabelecimentoNoturnoId, c.valor, c.comentario, c.estabelecimentoNoturnoImagem)))
                setIsLoading(false)
            }
        } catch(e) {
            setIsLoading(true)
            setCriticas([])
        }
    }

    useLayoutEffect(() => {
        fetchCriticas()
    }, [])

    const renderCritica = ({ item, index }:{item:Critica, index:number}) => {
        return (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('Estabelecimento', { id: item.estabelecimento_id })}>
                <View
                    key={index}
                    style={{
                        height: 130,
                        marginVertical: 5,
                        flexDirection: 'row',
                    }}
                >
                    <Image
                        source={{ uri: serverUrl + "/" + item.imagem }}
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
                        <Text style={{ fontSize: 13, marginTop: 10 }}>{item.texto}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    if (isLoading || criticas === undefined) {
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
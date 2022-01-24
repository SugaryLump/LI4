import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react'
import { ScrollView, View, FlatList, useWindowDimensions, Dimensions, Linking } from 'react-native'
import { useAuthContext } from '../hooks'
import { serverUrl } from '../lib/constants'
import { AirbnbRating, LinearProgress, Image, Text, Button } from 'react-native-elements'
import MapView from 'react-native-maps'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppParamList } from '../routeTypes'
import { useFocusEffect } from '@react-navigation/native'
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
        public percentRatingsByGrade: number[], //[0.07,0.13,0.20,0.45,0.15] por exemplo
        public contacto: string, //telemóvel
        public criticas: { id: number, nome: string, text: string | null, rating: number }[],
        public abertura: string,
        public fecho: string,
        public latitude: number,
        public longitude: number,
    ) { }
}


export const EstabelecimentoMenu = ({ navigation, route }: NativeStackScreenProps<AppParamList, 'Estabelecimento'>) => {
    const [estabelecimento, setEstabelecimento] = useState<LocalNoturno | undefined>(undefined)
    const [error, setError] = useState('')


    const authContext = useAuthContext()

    //Pedir ao server o local pelo seu id
    async function fetchLocalNoturno(id: number): Promise<LocalNoturno> {
        let e = await authContext.fetchWithJwt('/estabelecimento/:id/', "GET", {}, { id: id })
        let c = await authContext.fetchWithJwt('/estabelecimento/:id/classificacoes', "GET", {}, { id: id })
        /* console.log(c) */
        let comentarios: { id: number, nome: string, text: string | null, rating: number }[] = []

        let ratings = [0, 0, 0, 0, 0]

        if (c.success) {
            c.classificacoes.map(e => {
                ratings[5 - e.valor]++
                comentarios.push({ id: e.id, nome: e.username, text: e.comentario, rating: e.valor })
            })
        }

        const numberRatings = comentarios.length
        if (numberRatings > 0)
            ratings = ratings.map(e => e / numberRatings)

        if (e.success) {
            return new LocalNoturno(
                e.estabelecimento.id,
                e.estabelecimento.nome,
                e.estabelecimento.rating,
                e.estabelecimento.gamaPreco,
                e.estabelecimento.numberRatings,
                e.estabelecimento.categorias,
                serverUrl + '/' + e.estabelecimento.imageUrls[0],
                ratings,
                e.estabelecimento.contacto,
                comentarios,
                e.estabelecimento.horarioAbertura,
                e.estabelecimento.horarioFecho,
                e.estabelecimento.coordenadas.latitude,
                e.estabelecimento.coordenadas.longitude
            )
        }
        else {
            throw "Local Não existe"
        }
    }

    useFocusEffect(useCallback(() => {
        fetchLocalNoturno(route.params?.id).then((est) => {
            setEstabelecimento(est)
            navigation.setOptions({ title: est.nome })
        }).catch(e => console.log(e))

        return () => { }
    }, []))

    const RatingPercentageBar = (props: { percentage: number }) => {
        return (
            <LinearProgress
                value={props.percentage}
                variant='determinate'
                style={{ borderRadius: 10, flex: 0.08 }}
                color='#ffd500'
                trackColor='#ededed'
            />
        )
    }

    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerLeft: () => (
    //             <HeaderBackButton onPress={() => navigation.navigate({ name: 'Estabelecimentos', params: { searched:false } })}/>
    //         )
    //     })
    // })
    /*const AdminButton = () => {
        let admin = true; //Temos de verificar se é admin para mostrar isto ou não
        if (admin) {
            return (
                <Button title='Adicionar foto' onPress={() => navigation.navigate({name:'AdicionarFoto', params:{id:estabelecimento.id}})}/>
            )
        }
        else {
            return (<></>)
        }
    }*/
    const removerEstabelecimento = async () => {
        let result = await authContext.fetchWithJwt('/estabelecimento/:id', 'DELETE', {}, { id: route.params.id })

        if (result.success) {
            navigation.goBack()
        } else {
            setError('Erro ao remover estabelecimento')
        }
    }


    if (estabelecimento === undefined)
        return <LoadingMenu />
    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ alignItems: 'center', height: 200, aspectRatio: 1 / 1, marginTop: 10, alignSelf: 'center' }}>
                    <Image
                        source={{ uri: estabelecimento.imagem }}
                        containerStyle={{ flex: 1, alignSelf: 'stretch' }}
                    />
                </View>
                <View style={{ marginTop: 15 }}>
                    <Text style={{ paddingHorizontal: 25, fontSize: 15, fontWeight: 'bold' }}>Resumo das críticas</Text>
                    <View style={{ flex: 0.25, flexDirection: 'row' }}>
                        <View style={{ flex: 0.08, alignItems: 'center', justifyContent: 'space-around' }}>
                            <Text style={{ color: '#909090' }}>5</Text>
                            <Text style={{ color: '#909090' }}>4</Text>
                            <Text style={{ color: '#909090' }}>3</Text>
                            <Text style={{ color: '#909090' }}>2</Text>
                            <Text style={{ color: '#909090' }}>1</Text>
                        </View>
                        <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'space-around' }}>
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[0]} />
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[1]} />
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[2]} />
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[3]} />
                            <RatingPercentageBar percentage={estabelecimento.percentRatingsByGrade[4]} />
                        </View>
                        <View style={{ flex: 0.42, alignItems: 'center', justifyContent: 'space-around', paddingBottom: 5 }}>
                            <Text style={{ fontSize: 50 }}>{estabelecimento.rating}</Text>
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
                    <View style={{ flex: 0.50, marginTop: 15, marginHorizontal: 10 }}>
                        {estabelecimento.criticas.map((critica, index) => {
                            return (
                                <View style={{ marginBottom: 30 }} key={index}>
                                    <Text style={{ marginLeft: 2, fontSize: 16, color: '#000' }}>{critica.nome}</Text>
                                    <AirbnbRating
                                        isDisabled
                                        defaultRating={critica.rating}
                                        size={8}
                                        selectedColor='#ffd500'
                                        showRating={false}
                                        starContainerStyle={{ alignSelf: 'flex-start' }}
                                    />
                                    <Text style={{ fontSize: 13, marginLeft: 3 }}>{critica.text}</Text>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={{ marginVertical: 50, marginHorizontal: 20 }}>
                    <View style={{ flexDirection: "row", marginBottom: 20, justifyContent: 'space-between' }}>
                        <View>
                            {estabelecimento.categorias.map((categoria, index) => {
                                return (
                                    <View style={{ paddingBottom: 5 }} key={index}>
                                        <Text style={{ fontSize: 15 }}>✓  {categoria}</Text>
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
                        style={{ height: Dimensions.get('window').height / 3, width: Dimensions.get('window').width }}
                        initialRegion={{ latitude: +estabelecimento.latitude, longitude: +estabelecimento.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 }}
                        showsCompass={false}
                        scrollEnabled={false}
                        onPress={() => {
                            Linking.openURL('https://www.google.com/maps/search/?api=1&query=' +
                                estabelecimento.latitude +
                                '%2C' +
                                estabelecimento.longitude)
                        }}
                    />
                </View>
                <View style={{ marginHorizontal: 10, marginVertical: 20 }}>
                    <Button title='Avaliar' onPress={() => navigation.navigate({ name: 'Avaliar', params: { id: estabelecimento.id } })} />
                    {authContext.isAdmin ? (
                        <Button title='Eliminar Estabelecimento' containerStyle={{ marginTop: 10 }} titleStyle={{ color: 'red' }} buttonStyle={{ borderColor: 'red' }}
                            onPress={removerEstabelecimento}
                        />

                    ) : null}
                </View>
            </ScrollView>
        </View>
    )
}

import React, { useState } from 'react'
import { View } from 'react-native'
import { Divider, Text, CheckBox, Button, ButtonGroup, Input } from 'react-native-elements'
import { LocationEventEmitter } from 'expo-location/build/LocationEventEmitter'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AppParamList } from '../routeTypes'

export const FiltrosMenu = ({ navigation, route }: NativeStackScreenProps<AppParamList, 'Filtros'>) => {
    const [bar, setBar] = useState(route.params.bar)
    const [disco, setDisco] = useState(route.params.disco)
    const [aberto, setAberto] = useState(route.params.aberto)
    const [preco, setPreco] = useState(route.params.preco)
    const [ordem, setOrdem] = useState(route.params.ordem)
    const [nome, setNome] = useState(route.params.nome)
    console.log(nome)

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ maxWidth: 800, width: '100%', padding: 15 }}>
                <Button
                    title='Ok'
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'Estabelecimentos',
                            params: {
                                bar,
                                disco,
                                aberto,
                                ordem,
                                nome: undefined,
                                preco: preco,
                                searched: false,
                            }
                        }]
                    })}
                />
                <Divider style={{ marginVertical: 15 }} />
                <CheckBox title='Abertos de momento' checked={aberto} onPress={() => setAberto(!aberto)} />
                <CheckBox title='Bar' checked={bar} onPress={() => setBar(!bar)} />
                <CheckBox title='Discoteca' checked={disco} onPress={() => setDisco(!disco)} />
                <Divider style={{ marginVertical: 15 }} />
                <Text style={{ fontSize: 15, padding: 15, }}>Selecione uma ordem</Text>
                <ButtonGroup
                    buttons={['Nenhuma', 'Proximidade', 'Custo', 'Críticas']}
                    selectedIndex={ordem}
                    onPress={(ordem) => setOrdem(ordem)}
                />
                <Text style={{ fontSize: 15, padding: 15, }}>Selecione uma gama de preço</Text>
                <ButtonGroup
                    buttons={['Nenhuma', '€', '€€', '€€€']}
                    selectedIndex={preco}
                    onPress={(preco) => setPreco(preco)}
                />

                <Divider style={{ marginVertical: 15 }} />
                <Input
                    placeholder='Nome'
                    onChangeText={(nome) => { setNome(nome) }}
                />
                <Button
                    title='Pesquisar por nome'
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'Estabelecimentos',
                            params: {
                                bar: bar,
                                disco: disco,
                                aberto: aberto,
                                ordem: ordem,
                                nome: nome,
                                preco: preco,
                                searched: true
                            },
                        }]
                    })}
                />
            </View>
        </View>
    )
}
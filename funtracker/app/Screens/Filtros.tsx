import React, { useState } from 'react'
import { View } from 'react-native'
import { Divider, Text, CheckBox, Button, ButtonGroup } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
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

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 0.1, marginHorizontal: 15, marginVertical: 10 }}>
                <Button
                    title='Ok'
                    onPress={() => navigation.navigate({
                        name: 'Estabelecimentos',
                        params: {
                            bar,
                            disco,
                            aberto,
                            ordem,
                            nome: undefined,
                            preco:preco,
                            searched: false,
                        },
                        merge: true,
                    })}
                />
            </View>
            <Divider />
            <View style={{ flex: 0.25, marginHorizontal: 15 }}>
                <CheckBox title='Abertos de momento' checked={aberto} onPress={() => setAberto(!aberto)} />
                <CheckBox title='Bar' checked={bar} onPress={() => setBar(!bar)} />
                <CheckBox title='Discoteca' checked={disco} onPress={() => setDisco(!disco)} />
            </View>
            <Divider />
            <View style={{ flex: 0.3 }}>
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
            </View>
            <Divider />
            <View style={{ flex: 0.35 }}>
                <Input
                    placeholder='Nome'
                    onChangeText={(nome) => { setNome(nome) }}
                    inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#c5cad4',
                        padding: 5
                    }}
                    containerStyle={{
                        paddingHorizontal: 50,
                        paddingTop: 40,
                    }}
                />
                <Button
                    title='Pesquisar por nome'
                    onPress={() => navigation.navigate({
                        name: 'Estabelecimentos',
                        params: {
                            bar: bar,
                            disco: disco,
                            aberto: aberto,
                            ordem: ordem,
                            nome: nome,
                            preco:preco,
                            searched: true
                        },
                        merge: true
                    })
                    }
                />
            </View>
        </View>
    )
}
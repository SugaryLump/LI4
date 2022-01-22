import React, { useState } from 'react'
import { View } from 'react-native'
import { Divider, Text, CheckBox, Button, ButtonGroup } from 'react-native-elements'
import { Input } from 'react-native-elements/dist/input/Input'
import * as svg from 'react-native-svg'
import * as constants from '../lib/constants'
import * as Location from 'expo-location' 
import { LocationEventEmitter } from 'expo-location/build/LocationEventEmitter'

export const FiltrosMenu = ({ navigation, route }:any) => {
    const [bar,setBar] = useState(route.params?.bar)
    const [disco,setDisco] = useState(route.params?.disco)
    const [aberto,setAberto] = useState(route.params?.aberto)
    const [ordem, setOrdem] = useState(route.params?.ordem)
    const [nome, setNome] = useState(route.params?.nome)

    return (
        <View style={{flex:1}}>
            <View style={{flex:0.2, marginHorizontal:15, marginVertical:10}}>
                <Button
                    title='Ok'
                    onPress={() => navigation.navigate({
                        name:'Estabelecimentos',
                        params:{
                            bar:bar,
                            disco:disco,
                            aberto:aberto,
                            ordem:ordem,
                            nome:null,
                            searched:false,
                        },
                        merge:true,
                    })}
                />
            </View>
            <Divider/>
            <View style={{flex:0.25, marginHorizontal:15}}>
                <CheckBox title='Abertos de momento' checked={aberto} onPress={() => setAberto(!aberto)} />
                <CheckBox title='Bar' checked={bar} onPress={() => setBar(!bar)} />
                <CheckBox title='Discoteca' checked={disco} onPress={() => setDisco(!disco)} />
            </View>
            <Divider/>
            <View style={{flex:0.2}}>
                <Text style= {{fontSize:15, padding:15,}}>Selecione uma ordem</Text>
                <ButtonGroup
                    buttons={['Nenhuma','Proximidade', 'Custo', 'Críticas']}
                    selectedIndex={ordem}
                    onPress={(ordem) => setOrdem(ordem)}
                />
            </View>
            <Divider/>
            <View style={{flex:0.35}}>
                <Input 
                    placeholder='Nome'
                    onChangeText={(nome)=>{setNome(nome)}}
                    inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#c5cad4',
                        padding: 5
                    }}
                    containerStyle={{
                        paddingHorizontal:50,
                        paddingTop:40,
                    }}
                />
                <Button
                    title='Pesquisar por nome'
                    onPress={() => navigation.navigate({
                        name:'Estabelecimentos',
                        params:{
                            bar:bar,
                            disco:disco,
                            aberto:aberto,
                            ordem:ordem,
                            nome:nome,
                        },
                        merge:true})
                    }
                />
            </View>
        </View>
    )
}
import React from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { colors } from "react-native-elements"

export const LoadingMenu = () => {
    return <View style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Text>A carregar...</Text>
        <ActivityIndicator size="large" style={{marginTop: 10}} color={colors.primary}/>
    </View>
}
import Constants from 'expo-constants'
import { StyleSheet } from 'react-native'

const extra = Constants.manifest?.extra! // eslint-disable-line

export const serverUrl: string = extra.serverUrl

export const styles= StyleSheet.create({
    container: {
        flex:1,
    },
    footer: {
        flex:1,
        justifyContent:'flex-end'
    }
})

export const appTheme={
    Header: {
        placement: 'left',
        backgroundColor:'#f6f7f8'
    },
    Button: {
        titleStyle: {
            color: '#2582ff'
        },
        buttonStyle: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: '#d0d0d0',
            borderRadius: 10,
            padding: 20
        },
        containerStyle: {
            width: 320
        }
    }
}


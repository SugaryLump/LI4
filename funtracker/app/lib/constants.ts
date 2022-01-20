import Constants from 'expo-constants'
import { StyleSheet } from 'react-native'

const extra = Constants.manifest?.extra! // eslint-disable-line

export const serverUrl: string = extra.serverUrl

export const styles= StyleSheet.create({
    container: {
        padding:20,
    },
    centered: {
        alignItems:'center',
    },
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
    },
    CheckBox: {
        containerStyle: {
            borderWidth:0,
            backgroundColor:'#f2f2f2'
        }
    },
    ButtonGroup: {
        buttonStyle: {
            backgroundColor:'#f2f2f2',
        },
        selectedButtonStyle: {
            backgroundColor:'#2582ff',
        },
        containerStyle: {
            borderRadius:10,
        },
    },
    Divider: {
        style: {
            padding:15,
        },
    },
}


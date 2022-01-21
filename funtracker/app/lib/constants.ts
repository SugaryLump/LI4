import Constants from 'expo-constants'
import { StyleSheet } from 'react-native'
import { FullTheme } from 'react-native-elements'

const extra = Constants.manifest?.extra! // eslint-disable-line

export const serverUrl: string = extra.serverUrl

export const styles = StyleSheet.create({
    container: {
        flex:1
    },
    contentContainer: {
        flex:1,
        paddingVertical:10
    },
    centered: {
        flex:1,
        alignItems:'center',

    },
    footer: {
        flex:0.2,
        alignItems:'center',
        justifyContent:'flex-end'
    }
})

export const colors = {
    lightGray: '#d0d0d0',
    lightBlue: '#2582ff'
}

export const appTheme = {
    Header: {
        placement: 'left',
        backgroundColor:'#f6f7f8'
    },
    Button: {
        titleStyle: {
            color: colors.lightBlue,
            fontWeight: 'bold'
        },
        buttonStyle: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.lightGray,
            borderRadius: 10,
            width: '100%',
            alignContent: 'center',
            padding: 15
        },
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


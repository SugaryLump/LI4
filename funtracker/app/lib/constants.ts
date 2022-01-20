import Constants from 'expo-constants'

const extra = Constants.manifest?.extra! // eslint-disable-line

export const serverUrl: string = extra.serverUrl

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
        width: 150
      }
    }
  }
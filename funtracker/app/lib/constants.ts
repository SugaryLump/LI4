import Constants from 'expo-constants'

const extra = Constants.manifest?.extra! // eslint-disable-line

export const serverUrl: string = extra.serverUrl

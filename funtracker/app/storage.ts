import AsyncStorage from '@react-native-async-storage/async-storage'

export type JWT = string

export async function getJwt(): Promise<JWT | null> {
    try {
        return await AsyncStorage.getItem('@jwt')
    } catch (e) {
        return null
    }
}

export async function setJwt(jwt: JWT) {
    try {
        await AsyncStorage.setItem('@jwt', jwt)
    } catch (e) {
        console.error(e)
    }
}
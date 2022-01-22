import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

export type JWT = string

export async function getJwt(): Promise<JWT | null> {
    try {
        return await AsyncStorage.getItem('@jwt')
    } catch (e) {
        return null
    }
}

export async function setJwt(jwt: JWT | null) {
    try {
        if (jwt !== null)
            await AsyncStorage.setItem('@jwt', jwt)
        else
            await AsyncStorage.removeItem('@jwt')
    } catch (e) {
        console.error(e)
    }
}

export type AuthContextT = {
  signIn: (token: string) => void,
  signOut: () => void
}

// Meio que a forçar a situação, mas por algum motivo o TypeSCript do react está
// mal, porque createContext não precisa de um default
export const AuthContext = React.createContext<AuthContextT>(null!)


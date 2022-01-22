import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import { serverUrl } from './lib/constants'
import { API, APIRoute, HTTPMethod } from '../common/apiTypes'

export type JWT = {
    token: string,
    username: string,
    isAdmin: boolean,
    id: number
}

export async function getJwt(): Promise<JWT | null> {
    try {
        let item = await AsyncStorage.getItem('@jwt')
        if (item !== null)
            return JSON.parse(item)
        else
            return null
    } catch (e) {
        return null
    }
}

export async function setJwt(jwt: JWT | null) {
    try {
        if (jwt !== null)
            await AsyncStorage.setItem('@jwt', JSON.stringify(jwt))
        else
            await AsyncStorage.removeItem('@jwt')
    } catch (e) {
        console.error(e)
    }
}

export type AuthAction = {
    type: 'SIGN_IN' | 'RESTORE_TOKEN'
    token: JWT | null
} | {
    type: 'SIGN_OUT'
} | {
    type: 'NEW_USERNAME',
    username: string
}

export type AuthState = {
    userToken?: JWT | null,
    isLoading: boolean,
    isSignout: boolean
}

export interface AuthContextT {
    username?: string
    userId?: number
    isAdmin?: boolean
    jwt?: string

    signIn: (token: JWT) => Promise<void>
    signOut: () => Promise<void>
    newUsername: (username: string) => void

    fetchWithJwt: <Path extends keyof API, Method extends Extract<keyof API[Path], string>, Body extends API[Path][Method]["req"], Reply extends API[Path][Method]["res"]>(
        url: Extract<Path, string>, method: Method, body?: Body, params?: { [s: string]: number | string }, token?: string
    ) => Promise<Reply>
}

export function newAuthContext(dispatch: React.Dispatch<AuthAction>, state: AuthState): AuthContextT {
    return {
        username: state.userToken?.username,
        userId: state.userToken?.id,
        isAdmin: state.userToken?.isAdmin,
        jwt: state.userToken?.token,

        signIn: async (token: JWT) => {
            await setJwt(token)
            dispatch({ type: 'SIGN_IN', token })
        },

        signOut: async () => {
            await setJwt(null)
            dispatch({ type: 'SIGN_OUT' })
        },

        newUsername: (username: string) => {
            dispatch({ type: 'NEW_USERNAME', username })
        },

        fetchWithJwt: async (url, method, body, params, token) => {
            let realUrl = url as string
            if (params !== undefined) {
                for (let [key, val] of Object.entries(params)) {
                    realUrl = realUrl.replace(":" + key, params[key].toString())
                }
            }
            let res = await fetch(serverUrl + "/api/v1" + realUrl, {
                method: method,
                body: body === undefined ? undefined : JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + (token ?? state.userToken?.token)
                }
            })

            let json = await res.json()

            return json
        }
    }
}

// Meio que a forçar a situação, mas por algum motivo o TypeSCript do react está
// mal, porque createContext não precisa de um default
export const AuthContext = React.createContext<AuthContextT>(null!)

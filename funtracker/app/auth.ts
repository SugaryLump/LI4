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
        url: Extract<Path, string>, method: Method, body?: Body, params?: { [s: string]: number | string }, token?: string, multipart?: boolean
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

        fetchWithJwt: async (url, method, body, params, token, multipart) => {
            let realUrl = url as string
            if (params !== undefined) {
                for (let [key, val] of Object.entries(params)) {
                    realUrl = realUrl.replace(":" + key, params[key].toString())
                }
            }

            let reqParams: any = {
                method,
                headers: {
                    'Authorization': 'Bearer ' + (token ?? state.userToken?.token),
                }
            }

            if (method == 'GET') {
                if (body !== {})
                    realUrl += "?" + new URLSearchParams(body).toString()
            } else {
                if (multipart) {
                    const formData = new FormData()

                    if (body) {
                        for (let [key, val] of Object.entries(body)) {
                            if (typeof val === 'string' || typeof val === 'number')
                                formData.append(key, val.toString())
                            else {
                                if (val instanceof Blob) {
                                    console.log("blob")
                                    formData.append(key, val)
                                } else {
                                    formData.append(key, JSON.stringify(val))
                                }
                            }
                        }
                        reqParams.body = formData
                    }
                } else {
                    reqParams.headers['Content-Type'] = 'application/json'
                    reqParams.body = body === undefined ? undefined : JSON.stringify(body)
                }
            }

            let res = await fetch(serverUrl + "/api/v1" + realUrl, reqParams)

            let json = await res.json()

            return json
        }
    }
}

// Meio que a for??ar a situa????o, mas por algum motivo o TypeSCript do react est??
// mal, porque createContext n??o precisa de um default
export const AuthContext = React.createContext<AuthContextT>(null!)

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

export interface AuthAction {
  type: 'SIGN_IN' | 'RESTORE_TOKEN' | 'SIGN_OUT',
  token?: JWT | null
}

export type AuthState = {
  userToken?: JWT | null,
  isLoading: boolean,
  isSignout: boolean
}

export class AuthContextT {
    public username?: string
    public userId?: number
    public isAdmin?: boolean
    public jwt?: string

    constructor(private readonly dispatch: (action: AuthAction) => void) {}

    async signIn (token: JWT) {
        await setJwt(token)
        this.userId = token.id
        this.username = token.username
        this.isAdmin = token.isAdmin
        this.jwt = token.token
        this.dispatch({ type: 'SIGN_IN', token })
    }

    async signOut () {
        await setJwt(null)
        this.userId = undefined
        this.username = undefined
        this.isAdmin = undefined
        this.jwt = undefined
        this.dispatch({ type: 'SIGN_OUT' })
    }

    async fetchWithJwt<Path extends keyof API, Method extends Extract<keyof API[Path], string>, Body extends API[Path][Method]["req"], Reply extends API[Path][Method]["res"]>(
        url: Extract<Path, string>, method: Method, body?: Body, params?: { [s: string]: number | string }
    ): Promise<Reply> {
        let realUrl = url as string
        if (params !== undefined) {
            for (let [key, val] of Object.entries(params)) {
                realUrl = realUrl.replaceAll(":" + key, params[key].toString())
            }
        }
        let res = await fetch(serverUrl + "/api/v1" + realUrl, {
            method: method,
            body: body === undefined ? undefined : JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.jwt
            }
        })

        let json = await res.json() as Reply

        return json
    }
}

// Meio que a forçar a situação, mas por algum motivo o TypeSCript do react está
// mal, porque createContext não precisa de um default
export const AuthContext = React.createContext<AuthContextT>(null!)


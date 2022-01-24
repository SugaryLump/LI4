import { AndroidManifest } from "expo-constants"
import {Classificacao} from "../src/model/Classificacao"

// Tipos para a API
export type APIResponse<T> = ({
    success: true
} & T) | {
    success: false
    errors: any[]
}

export type APIRoute<T, R extends APIResponse<any>> = {
    req: T,
    res: R
}

interface APIDef {
    [path: string]: {
        [method: string]: APIRoute<any, any>
    }
}

export interface API extends APIDef {
    '/session': {
        POST: {
            req: {
                username: string
                password: string
                special?: boolean
            },
            res: APIResponse<{
                jwt: string
                username: string
                id: number
                isAdmin: boolean
            }>
        }
    },
    '/user': {
        POST: {
            req: {
                username: string
                password: string
            },
            res: APIResponse<{
                username: string
                id: number
            }>
        }
    },
    '/user/:id/password': {
        PATCH: {
            req: {
                password: string
            },
            res: APIResponse<{}>
        }
    },
    '/user/:id/username': {
        PATCH: {
            req: {
                username: string
            },
            res: APIResponse<{}>
        }
    },
    '/user/:id/historico': {
        GET: {
            req: {},
            res: APIResponse<{
                historico: {
                    id: number,
                    comentario: string,
                    estabelecimentoNoturnoId: number,
                    estabelecimentoNoturnoNome: string,
                    estabelecimentoNoturnoImagem: string,
                    username: string,
                    utilizadorId: number,
                    valor: number
                }[]
            }>
        }
    },

    // Estabelecimentos
    '/estabelecimento': {
        POST: {
            req: {
                nome: string,
                lotacao: number,
                gamaPreco: '$' | '$$' | '$$$',
                morada: string,
                coordenadas: {
                    latitude: string,
                    longitude: string
                },
                horarioAbertura: string,
                horarioFecho: string,
                contacto: string,
                categorias: string[],
                image: string,
                fileMime: string
            },
            res: APIResponse<{
                estabelecimento: {
                    id: number,
                    nome: string,
                    lotacao: number,
                    rating: number,
                    gamaPreco: string,
                    morada: string,
                    coordenadas: {
                        latitude: string,
                        longitude: string
                    },
                    contacto: string,
                    categorias: string[],
                    horarioAbertura: string,
                    horarioFecho: string
                }
            }>
        },
        'GET': {
            req: {
                categorias?: string, // Separada por vírgulas
                aberto?: boolean,
                order?: 'Proximidade' | 'Precos' | 'Criticas',
                precos?: '$' | '$$' | '$$$',
                nome?: string
                latitude?: string
                longitude?: string
            },
            res: APIResponse<{
                estabelecimentos: {
                    categorias: string[],
                    contacto: string,
                    coordenadas: {
                        latitude: string,
                        longitude: string
                    },
                    gamaPreco: string,
                    horarioAbertura: string,
                    horarioFecho: string,
                    id: number,
                    imageUrls: string[],
                    lotacao: number,
                    morada: string,
                    nome: string,
                    rating: number,
                    numberRatings: number
                }[]
            }>
        }
    },
    '/estabelecimento/:id/classificacoes': {
        GET: {
            req: {},
            res: APIResponse<{
                classificacoes:  Classificacao[]
            }>
        }
        POST: {
            req: {
                valor: number,
                comentario?: string
            },
            res: APIResponse<{
                classificacao: {
                    id: number;
                    valor: number;
                    comentario: string | null;
                    estabelecimentoNoturnoId: number;
                    utilizadorId: number;
                }
            }>
        }
    },
}

export type HTTPMethod = 'GET' | 'POST' | 'PATCH'

export type APIForRoute<Route extends keyof API, Method extends keyof API[Route]> =
  API[Route][Method]

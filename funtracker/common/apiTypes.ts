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
                is_admin: boolean
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
    }
}

export type HTTPMethod = 'GET' | 'POST' | 'PATCH'

export type APIForRoute<Route extends keyof API, Method extends keyof API[Route]> =
  API[Route][Method]
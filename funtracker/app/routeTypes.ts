export type AppParamList = {
    Login: undefined,
    Signup: undefined,
    Loading: undefined,
    Estabelecimentos: {
        bar?: boolean,
        disco?: boolean,
        aberto?: boolean,
        ordem?: number,
        preco?: number,
        nome?: string,
        searched: boolean
    },
    Filtros: {
        bar: boolean,
        disco: boolean,
        aberto: boolean,
        ordem: number,
        preco: number,
        nome?: string
    },
    Estabelecimento: {
        id: number
    },
    Avaliar: {
        id: number
    },
    Opcoes: undefined,
    Historico: undefined,
    Credenciais: {
        jwt: string
    },
    Adicionar: {
        latitude?: number,
        longitude?: number
    }
}
export interface IIngredienteCreate {
    nombre: string,
    descripcion?: string,
    es_alergeno: boolean
}

export interface IIngredienteUpdate {
    nombre?: string,
    descripcion?: string,
    es_alergeno?: boolean,
}

export interface IIngredienteResponse {
    id: number,
    nombre: string,
    descripcion?: string,
    es_alergeno: boolean
}

export interface IIngredientesList {
    data: IIngredienteResponse[],
    total: number
}
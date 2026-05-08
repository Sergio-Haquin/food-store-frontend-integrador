export interface ICategoriaCreate {
    nombre: string;
    descripcion: string;
    imagen_url: string;
    parent_id?: number | null;
}

export interface ICategoriaUpdate {
    nombre?: string;
    descripcion?: string;
    imagen_url?: string;
    parent_id?: number | null;
}

export interface ICategoriaResponse {
    id: number;
    nombre: string;
    descripcion: string;
    imagen_url: string;
}

export interface ICategoriaList {
    data: ICategoriaResponse[],
    total: number
}

export interface ICategoriaTree {
    id: number;
    nombre: string;
    subcategorias: ICategoriaTree[];
}
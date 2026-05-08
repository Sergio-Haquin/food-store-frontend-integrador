export interface CategoriaInput {
    categoria_id: number;
    es_principal: boolean;
}

export interface IngredienteInput {
    ingrediente_id: number;
    es_removible: boolean;
}

export interface IProductoCreate {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    stock_cantidad: number;
    categorias: CategoriaInput[];
    ingredientes: IngredienteInput[];
}

export interface IProductoUpdate {
    nombre?: string;
    descripcion?: string;
    precio_base?: number;
    imagenes_url?: string[];
    stock_cantidad?: number;
    categorias?: CategoriaInput[];
    ingredientes?: IngredienteInput[];
}

export interface IProductoResponse {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    stock_cantidad: number;
    categorias: {
        id: number;
        nombre: string;
    }[];
    ingredientes: {
        id: number;
        nombre: string;
        es_removible: boolean;
    }[];
}

export interface IProductoList {
    data: IProductoResponse[];
    total: number;
}
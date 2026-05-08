import type { IProductoCreate, IProductoList, IProductoResponse, IProductoUpdate } from "../types/IProducto";

const BASE_URL = `${import.meta.env.VITE_API_URL}/productos/`;

export const getProductos = async (offset = 0, limit = 20): Promise<IProductoList> => {
    try {
        const response = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error fetching productos: ${response.statusText}`);
        }
        const data: IProductoList= await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching productos:", error);
        throw error;
    }
}

export const getProductoById = async (id: number): Promise<IProductoResponse> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching producto: ${response.statusText}`);
        }
        const data: IProductoResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching producto:", error);
        throw error;
    }
}

export const createProducto = async (producto: IProductoCreate): Promise<IProductoResponse> => {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        if (!response.ok) {
            throw new Error(`Error creating producto: ${response.statusText}`);
        }
        const data: IProductoResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating producto:", error);
        throw error;
    }
}

export const updateProducto = async (id: number, producto: IProductoUpdate): Promise<IProductoResponse> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        if (!response.ok) {
            throw new Error(`Error updating producto: ${response.statusText}`);
        }
        const data: IProductoResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating producto:", error);
        throw error;
    }
}

export const deleteProducto = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Error deleting producto: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting producto:", error);
        throw error;
    }
}

export const desactivarProducto = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}${id}/desactivar`, {
            method: "PATCH"
        });
        if (!response.ok) {
            throw new Error(`Error desactivating producto: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error desactivating producto:", error);
        throw error;
    }
}

export const activarProducto = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}${id}/activar`, {
            method: "PATCH"
        });
        if (!response.ok) {
            throw new Error(`Error activating producto: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error activating producto:", error);
        throw error;
    }
}

import type { ICategoriaResponse, ICategoriaCreate, ICategoriaUpdate, ICategoriaTree, ICategoriaList } from '../types/ICategoria';

const BASE_URL = `${import.meta.env.VITE_API_URL}/categorias/`;

export const getCategorias = async (offset = 0, limit = 20): Promise<ICategoriaList> => {
    try {
        const response = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error fetching categorias: ${response.statusText}`);
        }
        const data = await response.json();
        return { data: data.data || [], total: data.total || 0 };
    } catch (error) {
        console.error("Error fetching categorias:", error);
        throw error;
    }
}

export const getCategoriaById = async (id: number): Promise<ICategoriaResponse> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching categoria: ${response.statusText}`);
        }
        const data: ICategoriaResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching categoria:", error);
        throw error;
    }
}

export const createCategoria = async (categoria: ICategoriaCreate): Promise<ICategoriaResponse> => {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        });
        if (!response.ok) {
            throw new Error(`Error creating categoria: ${response.statusText}`);
        }
        const data: ICategoriaResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating categoria:", error);
        throw error;
    }
}

export const updateCategoria = async (id: number, categoria: ICategoriaUpdate): Promise<ICategoriaResponse> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoria)
        });
        if (!response.ok) {
            throw new Error(`Error updating categoria: ${response.statusText}`);
        }
        const data: ICategoriaResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating categoria:", error);
        throw error;
    }
}

export const deleteCategoria = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Error deleting categoria: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting categoria:", error);
        throw error;
    }
}

export const getCategoriaTree = async (): Promise<ICategoriaTree[]> => {
    try {
        const response = await fetch(`${BASE_URL}tree`);
        if (!response.ok) {
            throw new Error(`Error fetching categoria tree: ${response.statusText}`);
        }
        const data: ICategoriaTree[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching categoria tree:", error);
        throw error;
    }
}

import type { IIngredienteResponse, IIngredienteUpdate, IIngredienteCreate, IIngredientesList } from "../types/IIngrediente";

const BASE_URL = `${import.meta.env.VITE_API_URL}/ingredientes/`;

export const getIngredientes = async (offset = 0, limit = 20): Promise<IIngredientesList> => {
    try {
        const response = await fetch(`${BASE_URL}?offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error fetching ingredientes: ${response.statusText}`);
        }
        const data = await response.json();
        return { data: data.data || [], total: data.total || 0 };
    } catch (error) {
        console.error("Error fetching ingredientes:", error);
        throw error;
    }
}

export const getIngredienteById = async (id: number): Promise<IIngredienteResponse> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching ingrediente: ${response.statusText}`);
        }
        const data: IIngredienteResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching ingrediente:", error);
        throw error;
    }
}

export const createIngrediente = async (ingrediente: IIngredienteCreate): Promise<IIngredienteResponse> => {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ingrediente)
        });
        if (!response.ok) {
            throw new Error(`Error creating ingrediente: ${response.statusText}`);
        }
        const data: IIngredienteResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating ingrediente:", error);
        throw error;
    }
}

export const updateIngrediente = async (id: number, ingrediente: IIngredienteUpdate): Promise<IIngredienteResponse> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ingrediente)
        });
        if (!response.ok) {
            throw new Error(`Error updating ingrediente: ${response.statusText}`);
        }
        const data: IIngredienteResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating ingrediente:", error);
        throw error;
    }
}

export const deleteIngrediente = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error(`Error deleting ingrediente: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error deleting ingrediente:", error);
        throw error;
    }
}

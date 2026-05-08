import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getCategoriaTree,
} from "../../api/categoria.service.ts";
import type { ICategoriaCreate, ICategoriaUpdate } from "../../types/ICategoria";

export const CATEGORIA_KEYS = {
    all: ["categorias"] as const,
    list: (offset: number, limit: number) => ["categorias", "list", offset, limit] as const,
    detail: (id: number) => ["categorias", "detail", id] as const,
    tree: ["categorias", "tree"] as const,
};

export const useCategorias = (offset = 0, limit = 20) => {
    return useQuery({
        queryKey: CATEGORIA_KEYS.list(offset, limit),
        queryFn: () => getCategorias(offset, limit),
    });
};

export const useCategoriaById = (id: number) => {
    return useQuery({
        queryKey: CATEGORIA_KEYS.detail(id),
        queryFn: () => getCategoriaById(id),
        enabled: !!id,
    });
};

export const useCategoriaTree = () => {
    return useQuery({
        queryKey: CATEGORIA_KEYS.tree,
        queryFn: getCategoriaTree,
    });
};

export const useCreateCategoria = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ICategoriaCreate) => createCategoria(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.all });
        },
    });
};

export const useUpdateCategoria = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: ICategoriaUpdate }) =>
            updateCategoria(id, data),
        onSuccess: (_result, { id }) => {
            queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.all });
            queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.detail(id) });
        },
    });
};

export const useDeleteCategoria = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCategoria(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CATEGORIA_KEYS.all });
        },
    });
};
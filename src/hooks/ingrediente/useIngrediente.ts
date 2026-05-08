import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getIngredientes,
    getIngredienteById,
    createIngrediente,
    updateIngrediente,
    deleteIngrediente,
} from "../../api/ingrediente.service.ts";
import type { IIngredienteCreate, IIngredienteUpdate } from "../../types/IIngrediente";

export const INGREDIENTE_KEYS = {
    all: ["ingredientes"] as const,
    list: (offset: number, limit: number) => ["ingredientes", "list", offset, limit] as const,
    detail: (id: number) => ["ingredientes", "detail", id] as const,
};

export const useIngredientes = (offset = 0, limit = 20) => {
    return useQuery({
        queryKey: INGREDIENTE_KEYS.list(offset, limit),
        queryFn: () => getIngredientes(offset, limit),
    });
};

export const useIngredienteById = (id: number) => {
    return useQuery({
        queryKey: INGREDIENTE_KEYS.detail(id),
        queryFn: () => getIngredienteById(id),
        enabled: !!id,
    });
};

export const useCreateIngrediente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IIngredienteCreate) => createIngrediente(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INGREDIENTE_KEYS.all });
        },
    });
};

export const useUpdateIngrediente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: IIngredienteUpdate }) =>
            updateIngrediente(id, data),
        onSuccess: (_result, { id }) => {
            queryClient.invalidateQueries({ queryKey: INGREDIENTE_KEYS.all });
            queryClient.invalidateQueries({ queryKey: INGREDIENTE_KEYS.detail(id) });
        },
    });
};

export const useDeleteIngrediente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteIngrediente(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INGREDIENTE_KEYS.all });
        },
    });
};
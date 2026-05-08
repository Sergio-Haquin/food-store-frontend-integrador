import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    activarProducto,
    desactivarProducto,
} from "../../api/producto.service";
import type { IProductoCreate, IProductoUpdate } from "../../types/IProducto";

export const PRODUCTO_KEYS = {
    all: ["productos"] as const,
    list: (offset: number, limit: number) => ["productos", "list", offset, limit] as const,
    detail: (id: number) => ["productos", "detail", id] as const,
};

export const useProductos = (offset = 0, limit = 20) => {
    return useQuery({
        queryKey: PRODUCTO_KEYS.list(offset, limit),
        queryFn: () => getProductos(offset, limit),
    });
};

export const useProductoById = (id: number) => {
    return useQuery({
        queryKey: PRODUCTO_KEYS.detail(id),
        queryFn: () => getProductoById(id),
        enabled: !!id,
    });
};

export const useCreateProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IProductoCreate) => createProducto(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.all });
        },
    });
};

export const useUpdateProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: IProductoUpdate }) =>
            updateProducto(id, data),
        onSuccess: (_result, { id }) => {
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.all });
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.detail(id) });
        },
    });
};

export const useDeleteProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProducto(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.all });
        },
    });
};

export const useActivarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => activarProducto(id),
        onSuccess: (_result, id) => {
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.all });
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.detail(id) });
        },
    });
};

export const useDesactivarProducto = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => desactivarProducto(id),
        onSuccess: (_result, id) => {
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.all });
            queryClient.invalidateQueries({ queryKey: PRODUCTO_KEYS.detail(id) });
        },
    });
};
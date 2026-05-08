import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import { useCreateProducto, useUpdateProducto } from "./useProducto";
import type { IProductoCreate, IProductoUpdate, IProductoResponse } from "../../types/IProducto";

type ProductoFormValues = {
    nombre: string;
    descripcion: string;
    precio_base: number;
    imagenes_url: string[];
    stock_cantidad: number;
    categorias: { categoria_id: number; es_principal: boolean }[];
    ingredientes: { ingrediente_id: number; es_removible: boolean }[];
};

interface UseProductoFormOptions {
    producto?: IProductoResponse | null;
    onSuccess?: () => void;
}

export const useProductoForm = ({ producto, onSuccess }: UseProductoFormOptions = {}) => {
    const isEditing = !!producto;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ProductoFormValues>({
        defaultValues: {
            nombre: "",
            descripcion: "",
            precio_base: 0,
            imagenes_url: [""],
            stock_cantidad: 0,
            categorias: [],
            ingredientes: [],
        },
    });

    const {
        fields: categoriaFields,
        append: appendCategoria,
        remove: removeCategoria,
    } = useFieldArray({ control, name: "categorias" });

    const {
        fields: ingredienteFields,
        append: appendIngrediente,
        remove: removeIngrediente,
    } = useFieldArray({ control, name: "ingredientes" });

    useEffect(() => {
        if (producto) {
            reset({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio_base: producto.precio_base,
                imagenes_url: producto.imagenes_url?.length ? producto.imagenes_url : [""],
                stock_cantidad: producto.stock_cantidad,
                categorias: producto.categorias.map((c) => ({
                    categoria_id: c.id,
                    es_principal: false,
                })),
                ingredientes: producto.ingredientes.map((i) => ({
                    ingrediente_id: i.id,
                    es_removible: i.es_removible,
                })),
            });
        } else {
            reset({
                nombre: "",
                descripcion: "",
                precio_base: 0,
                imagenes_url: [""],
                stock_cantidad: 0,
                categorias: [],
                ingredientes: [],
            });
        }
    }, [producto, reset]);

    const createMutation = useCreateProducto();
    const updateMutation = useUpdateProducto();

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const onSubmit = handleSubmit(async (values: ProductoFormValues) => {
        if (isEditing && producto) {
            const payload: IProductoUpdate = {
                nombre: values.nombre,
                descripcion: values.descripcion,
                precio_base: Number(values.precio_base),
                imagenes_url: values.imagenes_url.filter(Boolean),
                stock_cantidad: Number(values.stock_cantidad),
                categorias: values.categorias,
                ingredientes: values.ingredientes,
            };
            await updateMutation.mutateAsync({ id: producto.id, data: payload });
        } else {
            const payload: IProductoCreate = {
                nombre: values.nombre,
                descripcion: values.descripcion,
                precio_base: Number(values.precio_base),
                imagenes_url: values.imagenes_url.filter(Boolean),
                stock_cantidad: Number(values.stock_cantidad),
                categorias: values.categorias,
                ingredientes: values.ingredientes,
            };
            await createMutation.mutateAsync(payload);
        }
        onSuccess?.();
    });

    return {
        register,
        handleSubmit: onSubmit,
        errors,
        isSubmitting: isSubmitting || isPending,
        isEditing,
        error,
        reset,
        control,
        categoriaFields,
        appendCategoria,
        removeCategoria,
        ingredienteFields,
        appendIngrediente,
        removeIngrediente,
    };
};
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCreateCategoria, useUpdateCategoria } from "./useCategoria";
import type { ICategoriaCreate, ICategoriaUpdate, ICategoriaResponse } from "../../types/ICategoria";

type CategoriaFormValues = {
    nombre: string;
    descripcion: string;
    imagen_url: string;
    parent_id?: number | null;
};

interface UseCategoriaFormOptions {
    categoria?: ICategoriaResponse | null;
    onSuccess?: () => void;
}

export const useCategoriaForm = ({ categoria, onSuccess }: UseCategoriaFormOptions = {}) => {
    const isEditing = !!categoria;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoriaFormValues>({
        defaultValues: {
            nombre: "",
            descripcion: "",
            imagen_url: "",
            parent_id: null,
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (categoria) {
            reset({
                nombre: categoria.nombre,
                descripcion: categoria.descripcion,
                imagen_url: categoria.imagen_url,
                parent_id: null,
            });
        } else {
            reset({ nombre: "", descripcion: "", imagen_url: "", parent_id: null });
        }
    }, [categoria, reset]);

    const createMutation = useCreateCategoria();
    const updateMutation = useUpdateCategoria();

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const onSubmit = handleSubmit(async (values: CategoriaFormValues) => {
        if (isEditing && categoria) {
            const payload: ICategoriaUpdate = {
                nombre: values.nombre,
                descripcion: values.descripcion,
                imagen_url: values.imagen_url,
                parent_id: values.parent_id ?? null,
            };
            await updateMutation.mutateAsync({ id: categoria.id, data: payload });
        } else {
            const payload: ICategoriaCreate = {
                nombre: values.nombre,
                descripcion: values.descripcion,
                imagen_url: values.imagen_url,
                parent_id: values.parent_id ?? null,
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
    };
};
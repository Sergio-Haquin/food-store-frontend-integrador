import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCreateIngrediente, useUpdateIngrediente } from "./useIngrediente";
import type { IIngredienteCreate, IIngredienteUpdate } from "../../types/IIngrediente";

// IIngrediente and IIngredienteResponse have same shape — use a common base
interface IngredienteBase {
    id: number;
    nombre: string;
    descripcion?: string;
    es_alergeno: boolean;
}

type IngredienteFormValues = {
    nombre: string;
    descripcion: string;
    es_alergeno: boolean;
};

interface UseIngredienteFormOptions {
    ingrediente?: IngredienteBase | null;
    onSuccess?: () => void;
}

export const useIngredienteForm = ({ ingrediente, onSuccess }: UseIngredienteFormOptions = {}) => {
    const isEditing = !!ingrediente;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<IngredienteFormValues>({
        defaultValues: {
            nombre: "",
            descripcion: "",
            es_alergeno: false,
        },
    });

    useEffect(() => {
        if (ingrediente) {
            reset({
                nombre: ingrediente.nombre,
                descripcion: ingrediente.descripcion ?? "",
                es_alergeno: ingrediente.es_alergeno,
            });
        } else {
            reset({ nombre: "", descripcion: "", es_alergeno: false });
        }
    }, [ingrediente, reset]);

    const createMutation = useCreateIngrediente();
    const updateMutation = useUpdateIngrediente();

    const isPending = createMutation.isPending || updateMutation.isPending;
    const error = createMutation.error || updateMutation.error;

    const onSubmit = handleSubmit(async (values: IngredienteFormValues) => {
        if (isEditing && ingrediente) {
            const payload: IIngredienteUpdate = {
                nombre: values.nombre,
                descripcion: values.descripcion || undefined,
                es_alergeno: values.es_alergeno,
            };
            await updateMutation.mutateAsync({ id: ingrediente.id, data: payload });
        } else {
            const payload: IIngredienteCreate = {
                nombre: values.nombre,
                descripcion: values.descripcion || undefined,
                es_alergeno: values.es_alergeno,
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
import { Modal } from "../Modal";
import { Button } from "../Buttons";
import { useIngredienteForm } from "../../hooks/ingrediente/useIngredienteForm";
import type { IIngredienteResponse } from "../../types/IIngrediente";

// ─── Form Modal ────────────────────────────────────────────
interface IngredienteFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    ingrediente?: IIngredienteResponse | null;
}

export const IngredienteFormModal = ({ isOpen, onClose, ingrediente }: IngredienteFormModalProps) => {
    const { register, handleSubmit, errors, isSubmitting, isEditing } = useIngredienteForm({
        ingrediente,
        onSuccess: onClose,
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar ingrediente" : "Nuevo ingrediente"}
            size="sm"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
                    <input
                        {...register("nombre", { required: "El nombre es requerido" })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition"
                        placeholder="Ej: Gluten"
                    />
                    {errors.nombre && (
                        <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
                    <textarea
                        {...register("descripcion")}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition resize-none"
                        placeholder="Descripción opcional"
                    />
                </div>

                {/* Es alérgeno */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                    <input
                        id="es_alergeno"
                        type="checkbox"
                        {...register("es_alergeno")}
                        className="w-4 h-4 rounded text-amber-500 border-stone-300
                            focus:ring-amber-400 cursor-pointer"
                    />
                    <div>
                        <label htmlFor="es_alergeno" className="text-sm font-medium text-stone-700 cursor-pointer">
                            Es alérgeno
                        </label>
                        <p className="text-xs text-stone-400">Marcar si puede causar reacciones alérgicas</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                        {isEditing ? "Guardar cambios" : "Crear ingrediente"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// ─── Detail Modal ──────────────────────────────────────────
interface IngredienteDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    ingrediente: IIngredienteResponse | null;
    onEdit: () => void;
}

export const IngredienteDetailModal = ({ isOpen, onClose, ingrediente, onEdit }: IngredienteDetailModalProps) => {
    if (!ingrediente) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalle de ingrediente" size="sm">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">ID</p>
                        <p className="text-stone-800 font-semibold">#{ingrediente.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Nombre</p>
                        <p className="text-stone-800 font-semibold">{ingrediente.nombre}</p>
                    </div>
                </div>

                {ingrediente.descripcion && (
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Descripción</p>
                        <p className="text-stone-700 text-sm">{ingrediente.descripcion}</p>
                    </div>
                )}

                <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1">Alérgeno</p>
                    {ingrediente.es_alergeno ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                            font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4 c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Contiene alérgenos
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                            font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                            Sin alérgenos
                        </span>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                    <Button variant="primary" onClick={onEdit}>Editar</Button>
                </div>
            </div>
        </Modal>
    );
};
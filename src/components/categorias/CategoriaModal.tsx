import { Modal } from "../Modal";
import { Button } from "../Buttons";
import { useCategoriaForm } from "../../hooks/categoria/useCategoriaForm";
import { useCategoriaTree } from "../../hooks/categoria/useCategoria";
import type { ICategoriaResponse } from "../../types/ICategoria";

// ─── Form Modal ────────────────────────────────────────────
interface CategoriaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoria?: ICategoriaResponse | null;
}

export const CategoriaFormModal = ({ isOpen, onClose, categoria }: CategoriaFormModalProps) => {
    const { register, handleSubmit, errors, isSubmitting, isEditing } = useCategoriaForm({
        categoria,
        onSuccess: onClose,
    });
    const { data: tree } = useCategoriaTree();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar categoría" : "Nueva categoría"}
            size="md"
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
                        placeholder="Ej: Pizzas"
                    />
                    {errors.nombre && (
                        <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Descripción *</label>
                    <textarea
                        {...register("descripcion", { required: "La descripción es requerida" })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition resize-none"
                        placeholder="Descripción breve de la categoría"
                    />
                    {errors.descripcion && (
                        <p className="mt-1 text-xs text-red-500">{errors.descripcion.message}</p>
                    )}
                </div>

                {/* Imagen URL */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">URL de imagen *</label>
                    <input
                        {...register("imagen_url", { required: "La imagen es requerida" })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition"
                        placeholder="https://..."
                    />
                    {errors.imagen_url && (
                        <p className="mt-1 text-xs text-red-500">{errors.imagen_url.message}</p>
                    )}
                </div>

                {/* Categoría padre */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Categoría padre</label>
                    <select
                        {...register("parent_id", { setValueAs: (v) => v === "" ? null : Number(v) })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    >
                        <option value="">Sin categoría padre</option>
                        {tree?.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                        {isEditing ? "Guardar cambios" : "Crear categoría"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// ─── Detail Modal ──────────────────────────────────────────
interface CategoriaDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoria: ICategoriaResponse | null;
    onEdit: () => void;
}

export const CategoriaDetailModal = ({ isOpen, onClose, categoria, onEdit }: CategoriaDetailModalProps) => {
    if (!categoria) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalle de categoría" size="md">
            <div className="space-y-4">
                {categoria.imagen_url && (
                    <img
                        src={categoria.imagen_url}
                        alt={categoria.nombre}
                        className="w-full h-48 object-cover rounded-xl"
                    />
                )}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">ID</p>
                        <p className="text-stone-800 font-semibold">#{categoria.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Nombre</p>
                        <p className="text-stone-800 font-semibold">{categoria.nombre}</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Descripción</p>
                    <p className="text-stone-700 text-sm leading-relaxed">{categoria.descripcion}</p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                    <Button variant="primary" onClick={onEdit}>Editar</Button>
                </div>
            </div>
        </Modal>
    );
};
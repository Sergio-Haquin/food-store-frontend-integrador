import { Modal } from "../Modal";
import { Button } from "../Buttons";
import { StockBadge } from "../StockBadge";
import { useProductoForm } from "../../hooks/producto/useProductoForm";
import { useCategorias } from "../../hooks/categoria/useCategoria";
import { useIngredientes } from "../../hooks/ingrediente/useIngrediente";
import type { IProductoResponse } from "../../types/IProducto";

// ─── Form Modal ────────────────────────────────────────────
interface ProductoFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    producto?: IProductoResponse | null;
}

export const ProductoFormModal = ({ isOpen, onClose, producto }: ProductoFormModalProps) => {
    const {
        register,
        handleSubmit,
        errors,
        isSubmitting,
        isEditing,
        categoriaFields,
        appendCategoria,
        removeCategoria,
        ingredienteFields,
        appendIngrediente,
        removeIngrediente,
    } = useProductoForm({ producto, onSuccess: onClose });

    const { data: categoriasData } = useCategorias();
    const { data: ingredientesData } = useIngredientes();

    const categorias = categoriasData?.data ?? [];
    const ingredientes = ingredientesData?.data ?? [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Editar producto" : "Nuevo producto"}
            size="xl"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre + Precio */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
                        <input
                            {...register("nombre", { required: "El nombre es requerido" })}
                            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                                placeholder:text-stone-300 transition"
                            placeholder="Ej: Pizza Margherita"
                        />
                        {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Precio base *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            {...register("precio_base", { required: "El precio es requerido", min: 0 })}
                            className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                                focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                                placeholder:text-stone-300 transition"
                            placeholder="0.00"
                        />
                        {errors.precio_base && <p className="mt-1 text-xs text-red-500">{errors.precio_base.message}</p>}
                    </div>
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Descripción *</label>
                    <textarea
                        {...register("descripcion", { required: "La descripción es requerida" })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition resize-none"
                        placeholder="Descripción del producto"
                    />
                    {errors.descripcion && <p className="mt-1 text-xs text-red-500">{errors.descripcion.message}</p>}
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Stock *</label>
                    <input
                        type="number"
                        min="0"
                        {...register("stock_cantidad", { required: "El stock es requerido", min: 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition"
                        placeholder="0"
                    />
                    {errors.stock_cantidad && <p className="mt-1 text-xs text-red-500">{errors.stock_cantidad.message}</p>}
                </div>

                {/* Imágenes URL */}
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">URL de imagen principal *</label>
                    <input
                        {...register("imagenes_url.0", { required: "La imagen es requerida" })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm
                            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                            placeholder:text-stone-300 transition"
                        placeholder="https://..."
                    />
                    {errors.imagenes_url && <p className="mt-1 text-xs text-red-500">La imagen es requerida</p>}
                </div>

                {/* Categorías */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-stone-700">Categorías</label>
                        <button type="button"
                            onClick={() => appendCategoria({ categoria_id: 0, es_principal: false })}
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                            + Agregar
                        </button>
                    </div>
                    <div className="space-y-2">
                        {categoriaFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <select
                                    {...register(`categorias.${index}.categoria_id`, {
                                        setValueAs: (v) => Number(v),
                                    })}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                                >
                                    <option value={0}>Seleccionar categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                <label className="flex items-center gap-1.5 text-xs text-stone-600 whitespace-nowrap">
                                    <input type="checkbox"
                                        {...register(`categorias.${index}.es_principal`)}
                                        className="rounded text-amber-500" />
                                    Principal
                                </label>
                                <button type="button" onClick={() => removeCategoria(index)}
                                    className="text-red-400 hover:text-red-600 transition p-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {categoriaFields.length === 0 && (
                            <p className="text-xs text-stone-400 italic">Sin categorías asignadas</p>
                        )}
                    </div>
                </div>

                {/* Ingredientes */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-stone-700">Ingredientes</label>
                        <button type="button"
                            onClick={() => appendIngrediente({ ingrediente_id: 0, es_removible: false })}
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                            + Agregar
                        </button>
                    </div>
                    <div className="space-y-2">
                        {ingredienteFields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <select
                                    {...register(`ingredientes.${index}.ingrediente_id`, {
                                        setValueAs: (v) => Number(v),
                                    })}
                                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-sm
                                        focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                                >
                                    <option value={0}>Seleccionar ingrediente</option>
                                    {ingredientes.map((i) => (
                                        <option key={i.id} value={i.id}>{i.nombre}</option>
                                    ))}
                                </select>
                                <label className="flex items-center gap-1.5 text-xs text-stone-600 whitespace-nowrap">
                                    <input type="checkbox"
                                        {...register(`ingredientes.${index}.es_removible`)}
                                        className="rounded text-amber-500" />
                                    Removible
                                </label>
                                <button type="button" onClick={() => removeIngrediente(index)}
                                    className="text-red-400 hover:text-red-600 transition p-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {ingredienteFields.length === 0 && (
                            <p className="text-xs text-stone-400 italic">Sin ingredientes asignados</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="primary" loading={isSubmitting}>
                        {isEditing ? "Guardar cambios" : "Crear producto"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// ─── Detail Modal ──────────────────────────────────────────
interface ProductoDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    producto: IProductoResponse | null;
    onEdit: () => void;
}

export const ProductoDetailModal = ({ isOpen, onClose, producto, onEdit }: ProductoDetailModalProps) => {
    if (!producto) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Detalle de producto" size="lg">
            <div className="space-y-4">
                {producto.imagenes_url?.[0] && (
                    <img
                        src={producto.imagenes_url[0]}
                        alt={producto.nombre}
                        className="w-full h-52 object-cover rounded-xl"
                    />
                )}

                <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">ID</p>
                        <p className="text-stone-800 font-semibold">#{producto.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Precio</p>
                        <p className="text-stone-800 font-semibold">${Number(producto.precio_base).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Stock</p>
                        <StockBadge stock={producto.stock_cantidad} />
                    </div>
                </div>

                <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Nombre</p>
                    <p className="text-stone-800 font-semibold text-base">{producto.nombre}</p>
                </div>

                <div>
                    <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-0.5">Descripción</p>
                    <p className="text-stone-700 text-sm leading-relaxed">{producto.descripcion}</p>
                </div>

                {producto.categorias?.length > 0 && (
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1.5">Categorías</p>
                        <div className="flex flex-wrap gap-1.5">
                            {producto.categorias.map((c) => (
                                <span key={c.id} className="px-2.5 py-1 rounded-full text-xs font-medium
                                    bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                                    {c.nombre}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {producto.ingredientes?.length > 0 && (
                    <div>
                        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium mb-1.5">Ingredientes</p>
                        <div className="flex flex-wrap gap-1.5">
                            {producto.ingredientes.map((i) => (
                                <span key={i.id} className="px-2.5 py-1 rounded-full text-xs font-medium
                                    bg-stone-100 text-stone-700 ring-1 ring-stone-200">
                                    {i.nombre}
                                    {i.es_removible && <span className="ml-1 text-stone-400">(removible)</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                    <Button variant="primary" onClick={onEdit}>Editar</Button>
                </div>
            </div>
        </Modal>
    );
};
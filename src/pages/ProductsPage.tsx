import { useState } from "react";
import { useProductos, useDeleteProducto, useActivarProducto, useDesactivarProducto } from "../hooks/producto/useProducto";
import { ProductoFormModal, ProductoDetailModal } from "../components/productos/ProductoModal";
import { StockBadge } from "../components/StockBadge";
import { CreateButton, EditButton, DeleteButton, DetailsButton, Button } from "../components/Buttons";
import type { IProductoResponse } from "../types/IProducto";

type ModalMode = "create" | "edit" | "detail" | null;

export const ProductosPage = () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const { data, isLoading, isError } = useProductos(offset, limit);
    const deleteMutation = useDeleteProducto();
    const activarMutation = useActivarProducto();
    const desactivarMutation = useDesactivarProducto();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selected, setSelected] = useState<IProductoResponse | null>(null);

    const openCreate = () => { setSelected(null); setModalMode("create"); };
    const openEdit = (p: IProductoResponse) => { setSelected(p); setModalMode("edit"); };
    const openDetail = (p: IProductoResponse) => { setSelected(p); setModalMode("detail"); };
    const closeModal = () => { setModalMode(null); setSelected(null); };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este producto?")) return;
        await deleteMutation.mutateAsync(id);
    };

    const productos: IProductoResponse[] = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Productos</h1>
                        <p className="text-sm text-stone-500 mt-0.5">{total} productos registrados</p>
                    </div>
                    <CreateButton onClick={openCreate}>Nuevo producto</CreateButton>
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {isError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
                        <p className="text-red-600 text-sm font-medium">Error al cargar los productos.</p>
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/60">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Imagen</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Nombre</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Precio</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Stock</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Estado</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {productos.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-stone-400 text-sm italic">
                                            No hay productos registrados
                                        </td>
                                    </tr>
                                )}
                                {productos.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="px-6 py-4 text-stone-400 font-mono text-xs">{prod.id}</td>
                                        <td className="px-6 py-4">
                                            {prod.imagenes_url?.[0] ? (
                                                <img
                                                    src={prod.imagenes_url[0]}
                                                    alt={prod.nombre}
                                                    className="w-10 h-10 rounded-lg object-cover border border-stone-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-stone-800">{prod.nombre}</p>
                                            {prod.categorias?.length > 0 && (
                                                <p className="text-xs text-stone-400 mt-0.5">
                                                    {prod.categorias.map(c => c.nombre).join(", ")}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-stone-700">
                                            ${Number(prod.precio_base).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StockBadge stock={prod.stock_cantidad} />
                                        </td>
                                        <td className="px-6 py-4">
                                            {prod.stock_cantidad > 0 ? (
                                                <Button variant="ghost" size="sm"
                                                    onClick={() => desactivarMutation.mutate(prod.id)}
                                                    loading={desactivarMutation.isPending}
                                                    className="text-amber-600 hover:bg-amber-50">
                                                    Desactivar
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="sm"
                                                    onClick={() => activarMutation.mutate(prod.id)}
                                                    loading={activarMutation.isPending}
                                                    className="text-emerald-600 hover:bg-emerald-50">
                                                    Activar
                                                </Button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <DetailsButton onClick={() => openDetail(prod)} />
                                                <EditButton onClick={() => openEdit(prod)} />
                                                <DeleteButton onClick={() => handleDelete(prod.id)}
                                                    disabled={deleteMutation.isPending} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                                <p className="text-xs text-stone-500">Página {currentPage} de {totalPages}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setOffset(Math.max(0, offset - limit))}
                                        disabled={offset === 0}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600
                                            hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                        Anterior
                                    </button>
                                    <button onClick={() => setOffset(offset + limit)}
                                        disabled={offset + limit >= total}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600
                                            hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <ProductoFormModal
                isOpen={modalMode === "create" || modalMode === "edit"}
                onClose={closeModal}
                producto={modalMode === "edit" ? selected : null}
            />
            <ProductoDetailModal
                isOpen={modalMode === "detail"}
                onClose={closeModal}
                producto={selected}
                onEdit={() => setModalMode("edit")}
            />
        </div>
    );
};
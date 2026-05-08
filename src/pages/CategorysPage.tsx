import { useState } from "react";
import { useCategorias, useDeleteCategoria } from "../hooks/categoria/useCategoria";
import { CategoriaFormModal, CategoriaDetailModal } from "../components/categorias/CategoriaModal";
import { CreateButton, EditButton, DeleteButton, DetailsButton } from "../components/Buttons";
import type { ICategoriaResponse } from "../types/ICategoria";

type ModalMode = "create" | "edit" | "detail" | null;

export const CategoriasPage = () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const { data, isLoading, isError } = useCategorias(offset, limit);
    const deleteMutation = useDeleteCategoria();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selected, setSelected] = useState<ICategoriaResponse | null>(null);

    const openCreate = () => { setSelected(null); setModalMode("create"); };
    const openEdit = (cat: ICategoriaResponse) => { setSelected(cat); setModalMode("edit"); };
    const openDetail = (cat: ICategoriaResponse) => { setSelected(cat); setModalMode("detail"); };
    const closeModal = () => { setModalMode(null); setSelected(null); };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar esta categoría?")) return;
        await deleteMutation.mutateAsync(id);
    };

    const categorias = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Categorías</h1>
                        <p className="text-sm text-stone-500 mt-0.5">{total} categorías registradas</p>
                    </div>
                    <CreateButton onClick={openCreate}>Nueva categoría</CreateButton>
                </div>

                {/* States */}
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {isError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
                        <p className="text-red-600 text-sm font-medium">Error al cargar las categorías.</p>
                    </div>
                )}

                {/* Table */}
                {!isLoading && !isError && (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/60">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Imagen</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Nombre</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Descripción</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {categorias.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-stone-400 text-sm italic">
                                            No hay categorías registradas
                                        </td>
                                    </tr>
                                )}
                                {categorias.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-stone-50/60 transition-colors group">
                                        <td className="px-6 py-4 text-stone-400 font-mono text-xs">{cat.id}</td>
                                        <td className="px-6 py-4">
                                            {cat.imagen_url ? (
                                                <img
                                                    src={cat.imagen_url}
                                                    alt={cat.nombre}
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
                                        <td className="px-6 py-4 font-medium text-stone-800">{cat.nombre}</td>
                                        <td className="px-6 py-4 text-stone-500 max-w-xs truncate">{cat.descripcion}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <DetailsButton onClick={() => openDetail(cat)} />
                                                <EditButton onClick={() => openEdit(cat)} />
                                                <DeleteButton
                                                    onClick={() => handleDelete(cat.id)}
                                                    disabled={deleteMutation.isPending}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                                <p className="text-xs text-stone-500">
                                    Página {currentPage} de {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setOffset(Math.max(0, offset - limit))}
                                        disabled={offset === 0}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600
                                            hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setOffset(offset + limit)}
                                        disabled={offset + limit >= total}
                                        className="px-3 py-1.5 text-xs rounded-lg border border-stone-200 text-stone-600
                                            hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CategoriaFormModal
                isOpen={modalMode === "create" || modalMode === "edit"}
                onClose={closeModal}
                categoria={modalMode === "edit" ? selected : null}
            />
            <CategoriaDetailModal
                isOpen={modalMode === "detail"}
                onClose={closeModal}
                categoria={selected}
                onEdit={() => setModalMode("edit")}
            />
        </div>
    );
};
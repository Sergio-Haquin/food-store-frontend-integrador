import { useState } from "react";
import { useIngredientes, useDeleteIngrediente } from "../hooks/ingrediente/useIngrediente";
import { IngredienteFormModal, IngredienteDetailModal } from "../components/ingredientes/IngredienteModal";
import { CreateButton, EditButton, DeleteButton, DetailsButton } from "../components/Buttons";
import type { IIngredienteResponse } from "../types/IIngrediente";

type ModalMode = "create" | "edit" | "detail" | null;

export const IngredientesPage = () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const { data, isLoading, isError } = useIngredientes(offset, limit);
    const deleteMutation = useDeleteIngrediente();

    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selected, setSelected] = useState<IIngredienteResponse | null>(null);

    const openCreate = () => { setSelected(null); setModalMode("create"); };
    const openEdit = (ing: IIngredienteResponse) => { setSelected(ing); setModalMode("edit"); };
    const openDetail = (ing: IIngredienteResponse) => { setSelected(ing); setModalMode("detail"); };
    const closeModal = () => { setModalMode(null); setSelected(null); };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este ingrediente?")) return;
        await deleteMutation.mutateAsync(id);
    };

    const ingredientes = data?.data ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Ingredientes</h1>
                        <p className="text-sm text-stone-500 mt-0.5">{total} ingredientes registrados</p>
                    </div>
                    <CreateButton onClick={openCreate}>Nuevo ingrediente</CreateButton>
                </div>

                {/* States */}
                {isLoading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {isError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
                        <p className="text-red-600 text-sm font-medium">Error al cargar los ingredientes.</p>
                    </div>
                )}

                {/* Table */}
                {!isLoading && !isError && (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-100 bg-stone-50/60">
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">#</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Nombre</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Descripción</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Alérgeno</th>
                                    <th className="text-right px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {ingredientes.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-stone-400 text-sm italic">
                                            No hay ingredientes registrados
                                        </td>
                                    </tr>
                                )}
                                {ingredientes.map((ing) => (
                                    <tr key={ing.id} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="px-6 py-4 text-stone-400 font-mono text-xs">{ing.id}</td>
                                        <td className="px-6 py-4 font-medium text-stone-800">{ing.nombre}</td>
                                        <td className="px-6 py-4 text-stone-500 max-w-xs truncate">
                                            {ing.descripcion ?? <span className="italic text-stone-300">—</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {ing.es_alergeno ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                                                    font-semibold bg-red-50 text-red-700 ring-1 ring-red-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    Sí
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                                                    font-semibold bg-stone-100 text-stone-500 ring-1 ring-stone-200">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <DetailsButton onClick={() => openDetail(ing)} />
                                                <EditButton onClick={() => openEdit(ing)} />
                                                <DeleteButton
                                                    onClick={() => handleDelete(ing.id)}
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
            <IngredienteFormModal
                isOpen={modalMode === "create" || modalMode === "edit"}
                onClose={closeModal}
                ingrediente={modalMode === "edit" ? selected : null}
            />
            <IngredienteDetailModal
                isOpen={modalMode === "detail"}
                onClose={closeModal}
                ingrediente={selected}
                onEdit={() => setModalMode("edit")}
            />
        </div>
    );
};
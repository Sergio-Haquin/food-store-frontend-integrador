import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { ProductosPage } from "../pages/ProductsPage";
import { CategoriasPage } from "../pages/CategorysPage";
import { IngredientesPage } from "../pages/IngredientsPage";

export const AppRouter = () => {
    return (
        <div className="min-h-screen bg-stone-50">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/productos" replace />} />
                    <Route path="/productos" element={<ProductosPage />} />
                    <Route path="/categorias" element={<CategoriasPage />} />
                    <Route path="/ingredientes" element={<IngredientesPage />} />
                    <Route path="*" element={<Navigate to="/productos" replace />} />
                </Routes>
            </main>
        </div>
    );
};
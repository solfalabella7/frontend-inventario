import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Articulos from "../pages/Articulos";
import CreateArticulo from "../components/Articulos/CreateArticulos";
import ListaArticulos from "../components/Articulos/ListaArticulos";
import Proveedores from "../pages/Proveedores";
import Ordenes from "../pages/Ordenes";
import Ventas from "../pages/Ventas";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home con menú vertical */}
      <Route path="/" element={<Home />} />

      {/* Ruta padre para Artículos */}
      <Route path="/articulos/*" element={<Articulos />}>
        <Route index element={<ListaArticulos filtro="todos" />} /> {/* /articulos */}
        <Route path="crear" element={<CreateArticulo />} /> {/* /articulos/crear */}
        <Route path="faltantes" element={<ListaArticulos filtro="faltantes" />} /> {/* /articulos/faltantes */}
        <Route path="reponer" element={<ListaArticulos filtro="reponer" />} /> {/* /articulos/reponer */}
      </Route>

      {/* Otras rutas */}
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="/ordenes" element={<Ordenes />} />
      <Route path="/ventas" element={<Ventas />} />
    </Routes>
  );
};

export default AppRoutes;
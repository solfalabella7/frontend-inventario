import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Articulos from "../pages/Articulos";
import CreateArticulo from "../components/Articulos/CreateArticulos";
import ListaArticulos from "../components/Articulos/ListaArticulos";
import Proveedores from "../pages/Proveedores";
import Ventas from "../pages/Ventas";
import OrdenCompra from "../pages/OrdenCompra";
import CreateOrdenCompra from "../components/OrdenCompra/CreateOrdenCompra";
import ListaOrdenCompra from "../components/OrdenCompra/ListaOrdenCompra";
import ListaProveedores from "../components/Proveedores/ListaProveedores";
import CreateProveedor from "../components/Proveedores/CreateProveedor"
import EditarProveedor from "../components/Proveedores/EditarProveedor";
import CreateVenta from "../components/Ventas/CreateVenta";
import ListaVentas from "../components/Ventas/ListaVentas.jsx";

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

      {/* Ruta padre para Orden de Compra*/}
      <Route path="/ordenCompra/*" element={<OrdenCompra />}>
        <Route index element={<ListaOrdenCompra />} />
        <Route path="crear" element={<CreateOrdenCompra />} />
      </Route>

      {/* Ruta padre para Proveedores */}
      <Route path="/proveedores/*" element={<Proveedores />}>
        <Route index element={<ListaProveedores />} /> {/* /proveedores */}
        <Route path="crear" element={<CreateProveedor />} /> {/* /proveedores */}
        <Route path="editar/:id" element={<EditarProveedor />} />
      </Route>


      <Route path="/ventas/*" element={<Ventas />} >
        <Route index element={<ListaVentas />} />
        <Route path="crear" element={<CreateVenta />} />  
      </Route>
    </Routes>
  );
};

export default AppRoutes;
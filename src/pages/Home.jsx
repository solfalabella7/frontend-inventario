// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Menú vertical (sidebar) */}
      <aside
        style={{
          width: "220px",
          backgroundColor: "#f0f0f0",
          padding: "1.5rem",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Menú</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/articulos" style={{ textDecoration: "none", color: "#333" }}>
                Artículos
              </Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/proveedores" style={{ textDecoration: "none", color: "#333" }}>
                Proveedores
              </Link>
            </li>
            <li style={{ marginBottom: "1rem" }}>
              <Link to="/ordenCompra" style={{ textDecoration: "none", color: "#333" }}>
                Órdenes de Compra
              </Link>
            </li>
            <li>
              <Link to="/ventas" style={{ textDecoration: "none", color: "#333" }}>
                Ventas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Área principal para contenido o mensaje */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          color: "#444",
        }}
      >
        <h1>Inventario y Stock</h1>
        <p>Selecciona una opción del menú lateral para comenzar.</p>
      </main>
    </div>
  );
};

export default Home;


import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Articulos = () => {
  return (
    <div>
      <nav style={{ backgroundColor: '#ddd', padding: '1rem' }}>
        <NavLink 
          to="/articulos" 
          end
          style={({ isActive }) => ({
            marginRight: '1rem',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration:'none'
          })}
        >
          Lista
        </NavLink>
        <NavLink 
          to="/articulos/crear"
          style={({ isActive }) => ({
            marginRight: '1rem',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration:'none'
          })}
        >
          Nuevo
        </NavLink>
        <NavLink 
          to="/"
          style={{ marginLeft: 'auto', textDecoration: 'none' }}
        >
          Volver al Home
        </NavLink>
      </nav>

      {/*Renderizacion de rutas hijas */}
      <div style={{ padding: '1rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Articulos;

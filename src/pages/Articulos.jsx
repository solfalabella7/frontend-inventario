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
         ListaCompleta 
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
          to="/articulos/faltantes"
          style={({ isActive }) => ({
            marginRight: '1rem',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration:'none'
          })}
        >
          Articulos Faltantes
        </NavLink>
        <NavLink 
          to="/articulos/reponer"
          style={({ isActive }) => ({
            marginRight: '1rem',
            fontWeight: isActive ? 'bold' : 'normal',
            textDecoration:'none'
          })}
        >
          Articulos a Reponer
        </NavLink>
        <NavLink 
          to="/"
          style={{ marginLeft: 'auto', textDecoration: 'none' }}
        >
          Volver al Home
        </NavLink>
      </nav>

      <div style={{ padding: '1rem' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Articulos;
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const OrdenCompra = () => {
    return (
         <div>
              <nav style={{ backgroundColor: '#ddd', padding: '1rem' }}>
                <NavLink 
                  to="/ordenCompra" 
                  end
                  style={({ isActive }) => ({
                    marginRight: '1rem',
                    fontWeight: isActive ? 'bold' : 'normal',
                    textDecoration:'none'
                  })}
                >
                 Ordenes disponibles
                </NavLink>
                <NavLink 
                  to="/ordenCompra/crear"
                  style={({ isActive }) => ({
                    marginRight: '1rem',
                    fontWeight: isActive ? 'bold' : 'normal',
                    textDecoration:'none'
                  })}
                >
                  Cargar Nueva OC
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
}

export default OrdenCompra;
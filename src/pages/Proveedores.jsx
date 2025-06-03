import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';


const Proveedores = () => {
    return (
        <div>
            <nav style={{ backgroundColor: '#ddd', padding: '1rem' }}>
                <NavLink
                    to="/proveedores"
                    end
                    style={({ isActive }) => ({
                        marginRight: '1rem',
                        fontWeight: isActive ? 'bold' : 'normal',
                        textDecoration: 'none'
                    })}
                >
                    Lista Proveedores
                </NavLink>

                <NavLink
                    to="/proveedores/crear"
                    style={({ isActive }) => ({
                        marginRight: '1rem',
                        fontWeight: isActive ? 'bold' : 'normal',
                        textDecoration: 'none'
                    })}
                >
                    Nuevo
                </NavLink>

            </nav>
            <div style={{ padding: '1rem' }}>
                <Outlet />
            </div>
        </div>
    ); 
}

export default Proveedores
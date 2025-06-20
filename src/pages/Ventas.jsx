import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Ventas = () => {
    return (
        <div>
            <nav style={{ backgroundColor: '#ddd', padding: '1rem' }}>
                <NavLink
                    to="/ventas"
                    end
                    style={({ isActive }) => ({
                        marginRight: '1rem',
                        fontWeight: isActive ? 'bold' : 'normal',
                        textDecoration: 'none',
                    })}
                >
                    Ventas realizadas
                </NavLink>

                <NavLink
                    to="/ventas/crear"
                    style={({ isActive }) => ({
                        marginRight: '1rem',
                        fontWeight: isActive ? 'bold' : 'normal',
                        textDecoration: 'none',
                    })}
                >
                    Nueva venta
                </NavLink>

                <NavLink
                    to="/"
                    style={{
                        marginLeft: 'auto',
                        textDecoration: 'none',
                    }}
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

export default Ventas;

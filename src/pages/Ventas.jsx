{/*import React from 'react';
import { NavLink } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

const Ventas = () => {
    return (
        <div>
            <nav stle = {{ backgorundColor: '#ddd', pagging: '1rem'}}>
                <NavLink
                    to = "/ventas"
                    end 
                    style={({ isActive }) => ({
                        marginRight:'1rem',
                        fondWright: isActive ? 'bold' : 'normal',
                        textDecoration: 'none'
                    })}
                >
                    Ventas realizadas
                </NavLink>

                <NavLink
                    to="ventas/crear"
                    style={({ isActive}) => ({
                        marginRight:'1rem',
                        fontWeight: isActive ? 'bold' : 'normal',
                        textDecoration: 'none'
                    })}
                >
                    Nueva venta
                </NavLink>
            </nav>

            <div style={{ padding: '1rem'}}>
                <Outlet />
            </div>

        
        </div>
    ); 
}

export default Ventas*/}

import React from 'react';
import { Outlet } from 'react-router-dom';

const Ventas = () => {
  return (
    <div className="container mt-4">
      <h1>Ventas</h1>
      <Outlet />
    </div>
  );
};

export default Ventas;

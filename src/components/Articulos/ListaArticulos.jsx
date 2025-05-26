
import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config'; // Importás tu instancia de axios

const ListaArticulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const respuesta = await axios.get('/articulos'); // Solo agregás la parte del endpoint
      setArticulos(respuesta.data);
    } catch (err) {
      console.error('Error al obtener los artículos:', err);
      setError('No se pudieron cargar los artículos.');
    }
  };

  return (
    <div className='container'>
      <h2>Artículos Disponibles</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {articulos.length === 0 ? (
        <p>No hay artículos registrados.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Stock Actual</th>
              <th>Stock de Seguridad</th>
              <th style={{textAlign: 'center'}}>Modificar/Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr key={articulo.codigoArticulo}>
                <td>{articulo.codigoArticulo}</td>
                <td>{articulo.nombreArticulo}</td>
                <td>{articulo.descripcion}</td>
                <td style={{textAlign: 'center'}}>{articulo.stockActualArticulo}</td>
                <td style={{textAlign: 'center'}}>{articulo.stockSeguridadArticulo}</td>
                <td style={{display: 'flex', justifyContent:'space-evenly'}}><i style={{cursor: 'pointer'}} class="bi bi-trash3-fill"></i><i  style={{cursor: 'pointer'}} class="bi bi-pencil-square"></i></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaArticulos;

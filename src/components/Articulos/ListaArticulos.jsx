
import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config';
import EliminarArticulo from './EliminarArticulo'; 
import ModificarArticulo from './ModificarArticulo';

const ListaArticulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [error, setError] = useState(null);
  const [articuloAEditar, setArticuloAEditar] = useState(null);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const respuesta = await axios.get('/articulos'); // Solo agregás la parte del endpoint
      //Ordear los articulos: activos primero, luego los dados de baja
      const articulosOrdenados = respuesta.data.sort((a,b) => {
        if (a.fechaHoraBajaArticulo && !b.fechaHoraBajaArticulo) return 1;
        if (!a.fechaHoraBajaArticulo && b.fechaHoraBajaArticulo) return -1;
        return 0;
      });
      setArticulos(articulosOrdenados);
    } catch (err) {
      console.error('Error al obtener los artículos:', err);
      setError('No se pudieron cargar los artículos.');
    }
  };
   const handleEditar = (articulo) => {
    setArticuloAEditar(articulo);
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
              <th>Fecha de Baja</th>
              <th style={{textAlign: 'center'}}>Modificar/Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr key={articulo.codigoArticulo} style={{
                backgroundColor: articulo.fechaHoraBajaArticulo ? '#FFE0B2' : 'transparent'
              }}>
                <td>{articulo.codigoArticulo}</td>
                <td>{articulo.nombreArticulo}</td>
                <td>{articulo.descripcion}</td>
                <td style={{textAlign: 'center'}}>{articulo.stockActualArticulo}</td>
                <td style={{textAlign: 'center'}}>{articulo.stockSeguridadArticulo}</td>
                <td style={{textAlign: 'center'}}>
                  {articulo.fechaHoraBajaArticulo 
                  ? new Date(articulo.fechaHoraBajaArticulo).toLocaleString()
                  : 'Activo'}
                </td>
                <td style={{display: 'flex', justifyContent:'space-evenly',}}> {/*<i style={{cursor: 'pointer'}} class="bi bi-trash3-fill"></i><i  style={{cursor: 'pointer'}} class="bi bi-pencil-square"></i>*/}
                <button onClick={() => handleEditar(articulo)}>✏️</button>
                {!articulo.fechaHoraBajaArticulo && (
                  <EliminarArticulo
                    codigoArticulo={articulo.codigoArticulo}
                    onDeleteSuccess={cargarArticulos}
                  />
                )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
       {articuloAEditar && (
        <ModificarArticulo
          articulo={articuloAEditar}
          onCancel={() => setArticuloAEditar(null)}
          onUpdateSuccess={() => {
            setArticuloAEditar(null);
            cargarArticulos();
          }}
        />
      )}
    </div>
  );
};

export default ListaArticulos;

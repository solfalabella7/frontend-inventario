
import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config';
import EliminarArticulo from './EliminarArticulo';
import ModificarArticulo from './ModificarArticulo';
import { Modal, Button, Dropdown } from 'react-bootstrap';

const ListaArticulos = ({ filtro = 'todos' }) => {
  const [articulos, setArticulos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articuloDetalle, setArticuloDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articuloAEditar, setArticuloAEditar] = useState(null);
  const [proveedores, setProveedores] = useState({});

  useEffect(() => {
    cargarArticulos();
  }, [filtro]);

  const cargarArticulos = async () => {
    setLoading(true);
    try {
      let endpoint = '/articulos';
      if (filtro === 'faltantes') endpoint = '/articulos/articulosFaltantes';
      if (filtro === 'reponer') endpoint = '/articulos/articulosReponer';

    const respuesta = await axios.get(endpoint);
console.log("Respuesta del backend:", respuesta.data);

if (Array.isArray(respuesta.data)) {
  const articulosOrdenados = respuesta.data.sort((a, b) => {
    if (a.fechaHoraBajaArticulo && !b.fechaHoraBajaArticulo) return 1;
    if (!a.fechaHoraBajaArticulo && b.fechaHoraBajaArticulo) return -1;
    return 0;
  });

  setArticulos(articulosOrdenados);
  setError(null);
} else {
  console.warn("La respuesta del backend no es un array:", respuesta.data);
  setArticulos([]);
  setError("No se pudo obtener una lista válida de artículos.");
}

    } catch (err) {
      console.error('Error al obtener artículos:', err);
      setError('No se pudieron cargar los artículos.');
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalDetalle = async (codigo) => {
    try {
      const res = await axios.get(`/articulos/${codigo}/detalle`);
      setArticuloDetalle(res.data);
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al cargar detalle del artículo:', error);
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setArticuloDetalle(null);
  };

  const handleEditar = async (articulo) => {
  try {
    const res = await axios.get(`/articulos/${articulo.codigoArticulo}/detalle`);
    const articuloConCodigo = {
      ...res.data,
      codigoArticulo: articulo.codigoArticulo, // <- Lo agregás manualmente
    };
    setArticuloAEditar(articuloConCodigo);
  } catch (error) {
    console.error('Error al obtener detalle del artículo para edición', error);
  }
};

  const cargarProveedores = async (codigoArticulo) => {
    try {
      const respuesta = await axios.get(`/articulos/${codigoArticulo}/proveedores`);
      setProveedores(prev => ({
        ...prev,
        [codigoArticulo]: respuesta.data
      }));
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
      setProveedores(prev => ({
        ...prev,
        [codigoArticulo]: [{ nombre: 'Error al cargar' }]
      }));
    }
  };

  return (
    <div className='container'>
      <h2>
        {filtro === 'todos' && 'Listado de Artículos'}
        {filtro === 'faltantes' && 'Artículos Faltantes'}
        {filtro === 'reponer' && 'Artículos a Reponer'}
      </h2>

      {loading && <div className="text-center my-3">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && articulos.length === 0 ? (
        <div className="alert alert-info">No hay artículos registrados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th className="text-center">Código</th>
                <th className="text-center">Nombre</th>
                <th className="text-center">Descripción</th>
                <th className="text-center">Stock Actual</th>
                <th className="text-center">Stock de Seguridad</th>
                <th className="text-center">Fecha de Baja</th>
                {filtro === 'todos' && <th>Proveedores</th>}
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articulos.map((articulo) => (
                <tr key={articulo.codigoArticulo}>
                  <td>{articulo.codigoArticulo}</td>
                  <td>{articulo.nombreArticulo}</td>
                  <td>{articulo.descripcion}</td>
                  <td>{articulo.stockActual}</td>
                  <td>{articulo.stockSeguridad}</td>
                  <td>
                    {articulo.fechaHoraBajaArticulo
                      ? new Date(articulo.fechaHoraBajaArticulo).toLocaleString('es-AR')
                      : '-'}
                  </td>
                  {filtro === 'todos' && (
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" size="sm">
                          Proveedores
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {proveedores[articulo.codigoArticulo] ? (
                            proveedores[articulo.codigoArticulo].map((proveedor, index) => (
                              <Dropdown.Item key={index}>
                                {proveedor.nombre || `Proveedor ${index + 1}`}
                              </Dropdown.Item>
                            ))
                          ) : (
                            <Dropdown.Item onClick={() => cargarProveedores(articulo.codigoArticulo)}>
                              Cargar proveedores
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  )}
                  <td className="text-center d-flex gap-2 justify-content-center">
                    <Button variant="info" size="sm" onClick={() => abrirModalDetalle(articulo.codigoArticulo)}>
                      Detalles
                    </Button>
                    {filtro === 'todos' && (
                      <>
                        <Button variant="warning" size="sm" onClick={() => handleEditar(articulo)} disabled={!!articulo.fechaHoraBajaArticulo}>
                          ✏️
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={async () => {
                            if (!window.confirm('¿Estás seguro de que querés eliminar este artículo?')) return;

                            try {
                              await axios.delete(`/articulos/${articulo.codigoArticulo}`);
                              alert('✅ Artículo eliminado');
                              cargarArticulos();
                            } catch (err) {                                                            
                              console.error('Error al eliminar artículo:', err);
                              const mensaje = err.response?.data || "No se pudo eliminar el artículo";
                              alert(`❌ ${mensaje}`);
                            }
                          }}
                          disabled={!!articulo.fechaHoraBajaArticulo}
                          title={articulo.fechaHoraBajaArticulo ? "Este artículo ya está dado de baja" : "Eliminar artículo"}
                        >
                          🗑️
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Artículo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {articuloDetalle ? (
            <ul className="list-group">
              

      <li className="list-group-item">Nombre: {articuloDetalle.nombreArticulo}</li>
      <li className="list-group-item">Descripción: {articuloDetalle.descripcion}</li>
      <li className="list-group-item">Demanda Anual: {articuloDetalle.demandaAnual}</li>
      <li className="list-group-item">Costo Almacenamiento: ${articuloDetalle.costoAlmacenamiento}</li>
      <li className="list-group-item">Modelo: {articuloDetalle.modeloElegido}</li>
      <li className="list-group-item">Punto de Pedido: {articuloDetalle.puntoPedido}</li>
      
      
            </ul>
          ) : (
            <p>No se encontró información del artículo.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

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

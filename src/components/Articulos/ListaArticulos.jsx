
import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config';
import EliminarArticulo from './EliminarArticulo';
import ModificarArticulo from './ModificarArticulo';
import {
    Table,
    Button,
    Modal,
    Badge,
    Alert,
    Spinner,
    Dropdown,
    ListGroup
} from 'react-bootstrap';
import ProveedoresPorArticulo from './ProveedoresPorArticulo';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ListaArticulos = ({ filtro = 'todos' }) => {
  const [articulos, setArticulos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [articuloDetalle, setArticuloDetalle] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [articuloAEditar, setArticuloAEditar] = useState(null);
  const [proveedores, setProveedores] = useState({});
  const [proveedoresDetalle, setProveedoresDetalle] = useState([]); //prov por articulo
  const [modalProveedoresVisible, setModalProveedoresVisible] = useState(false);
  const [proveedoresModal, setProveedoresModal] = useState([]);
  const [articuloEnModal, setArticuloEnModal] = useState(null);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [showModal, setShowModal] = useState(false)
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [articulosProveedor, setArticulosProveedor] = useState([]);
  const [loadingArticulos, setLoadingArticulos] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [articuloToDelete, setArticuloToDelete] = useState(null);


  useEffect(() => {
    cargarArticulos();
  }, [filtro]);

  if (loading) {
    return <div className="text-center my-5">Cargando artículos...</div>;
  }

  const cargarArticulos = async ( intento = 1 ) => {
    setLoading(true);
    setError("");
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
      if (intento < 3) {
        // 🔁 Reintenta si falla (hasta 3 veces)
        console.warn(`Reintentando cargar artículos... intento ${intento + 1}`);
        setTimeout(() => cargarArticulos(intento + 1), 1000); // espera 1s
      } else {
        setError("Error al cargar los artículos. Intente más tarde.");
        console.error(err);
      }
      
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

//para tabla proveedores
  const verProveedoresEnModal = async (articulo) => {
  setLoadingProveedores(true);
  setArticuloEnModal(articulo);
  setModalProveedoresVisible(true);
  try {
    const res = await axios.get(`/articulos/${articulo.codigoArticulo}/proveedoresPorArticulo`);
    setProveedoresModal(res.data);
  } catch (error) {
    console.error("Error al cargar proveedores del artículo:", error);
    setProveedoresModal([]);
  } finally {
    setLoadingProveedores(false);
  }
};

//para cambiar el predeterminado
const cambiarProveedorPredeterminado = async (proveedor) => {
  if (!articuloEnModal) return;

  const dto = {
    codigoArticulo: articuloEnModal.codigoArticulo,
    codProveedor: proveedor.codProveedor,
    nombreProveedor: proveedor.nombreProveedor  // ✅ opcional, solo si lo usás en el backend
  };

  try {
    await axios.put('/articulos/cambiar/predeterminado', dto);

    const res = await axios.get(`/articulos/${articuloEnModal.codigoArticulo}/proveedoresPorArticulo`);
    setProveedoresModal(res.data);
  } catch (error) {
    console.error("Error al cambiar proveedor predeterminado:", error);
    alert("❌ No se pudo cambiar el proveedor predeterminado.");
  }
};

  const handleDeleteClick = (articulo) => {
    setArticuloToDelete(articulo);
    setShowDeleteModal(true);
    setError(null); //Resetear error al abrir el modal
  };

  const confirmarEliminar = async () => {
        if (!articuloToDelete) return;

        setDeleting(true);
        try {
            await axios.delete(`/articulos/${articuloToDelete.codigoArticulo}`);
            cargarArticulos();
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Error al eliminar artículo:', err);
            setError(err.response?.data?.message || 'No se pudo eliminar el artículo');
        } finally {
            setDeleting(false);
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
                 
                    <td className="text-center">
                      <Button variant="outline-primary" size="sm" onClick={() => verProveedoresEnModal(articulo)}>
                        Ver Proveedores
                      </Button>
                    </td>

                  
                  <td className="text-center d-flex gap-2 justify-content-center">
                    <Button variant="info" size="sm" onClick={() => abrirModalDetalle(articulo.codigoArticulo)}>
                      Detalles
                    </Button>
                    {filtro === 'todos' && (
                      <>
                        <Button variant="warning" size="sm" onClick={() => handleEditar(articulo)} disabled={!!articulo.fechaHoraBajaArticulo}>
                          ✏️
                        </Button>
                         <EliminarArticulo
                          codigoArticulo={articulo.codigoArticulo}
                          nombreArticulo={articulo.nombreArticulo}
                          onDeleteSuccess={cargarArticulos}
                          disabled={!!articulo.fechaHoraBajaArticulo}
                        />
                        
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

            {/* Modal de confirmación para eliminar */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmar eliminación</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                ¿Está seguro que desea eliminar al artículo "{articuloToDelete?.nombreArticulo}"?
                <div className="mt-2 text-muted">
                  Esta acción marcará al artículo como dado de baja.
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmarEliminar}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Eliminando...
                    </>
                  ) : 'Confirmar'}
                </Button>
              </Modal.Footer>
            </Modal>
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

    <ProveedoresPorArticulo
      show={modalProveedoresVisible}
      handleClose={() => setModalProveedoresVisible(false)}
      articulo={articuloEnModal}
      proveedores={proveedoresModal}
      loading={loadingProveedores}
      onCambiarPredeterminado={cambiarProveedorPredeterminado}
    />



    </div>
  );
};

export default ListaArticulos;

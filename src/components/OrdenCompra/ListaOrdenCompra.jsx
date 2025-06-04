import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Modal } from 'react-bootstrap';
import ModificarOrdenCompra  from './ModificarOrdenCompra'; 

const ListaOrdenesCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      const response = await axios.get('/ordenCompra');
      setOrdenes(response.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las órdenes de compra.');
    }
  };

  const verDetalle = async (nro) => {
    try {
      const response = await axios.get(`/ordenes-compra/${nro}/datos`);
      setDetalle(response.data);
      setDetalleVisible(true);
    } catch (err) {
      console.error(err);
      alert('Error al cargar los detalles de la OC');
    }
  };

  const cerrarDetalle = () => {
    setDetalleVisible(false);
    setDetalle(null);
  };

  const eliminarOC = async (nro) => {
    if (window.confirm('¿Estás seguro de que querés eliminar esta orden?')) {
      try {
        await axios.delete(`/ordenes-compra/${nro}`);
        cargarOrdenes();
      } catch (err) {
        console.error(err);
        alert('Error al eliminar la orden de compra');
      }
    }
  };

    const [mostrarModalModificar, setMostrarModalModificar] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    const modificarOC = (nro) => {
        const orden = ordenes.find(o => o.nroOrdenCompra === nro);
        setOrdenSeleccionada(orden);
        setMostrarModalModificar(true);
        alert(`Modificar OC nro: ${nro}`);
    };

    const cerrarModalModificar = () => {
        setMostrarModalModificar(false);
        setOrdenSeleccionada(null);
    };

    const enviarOrden = async (nro) => {
    try {
      const response = await axios.put(`/ordenCompra/enviar/${nro}`);
      const { ordenCompra, alertar } = response.data;

      // Actualizar localmente la lista con la orden enviada
      setOrdenes(ordenes.map(o => o.nroOrdenCompra === nro ? ordenCompra : o));

      if (alertar) {
        alert('La cantidad de la OC no supera el Punto de Pedido con modelo Lote Fijo.');
      }
    } catch (err) {
      console.error(err);
      alert('Error al enviar la orden: ' + (err.response?.data || err.message));
    }
  };

  const finalizarOrden = async (nro) => {
    try {
      const response = await axios.put(`/ordenCompra/finalizar/${nro}`);
      const ordenFinalizada = response.data;

      // Actualizar localmente la lista con la orden finalizada
      setOrdenes(ordenes.map(o => o.nroOrdenCompra === nro ? ordenFinalizada : o));
    } catch (err) {
      console.error(err);
      alert('Error al finalizar la orden: ' + (err.response?.data || err.message));
    }
  };



  return (
    <div className="container mt-4">
      <h2>Órdenes de Compra</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Nro OC</th>
            <th>Nombre</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.map((oc) => (
            <tr key={oc.nroOrdenCompra}>
              <td>{oc.nroOrdenCompra}</td>
              <td>{oc.nombreOC}</td>
              <td>{oc.nombreProveedor}</td>
              <td>{new Date(oc.fechaOrden).toLocaleDateString()}</td>
              <td>{oc.estadoOC}</td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => verDetalle(oc.nroOrdenCompra)}
                  className="me-2"
                >
                  Ver Detalle
                </Button>

                {oc.estadoOC === 'PENDIENTE' && (
                  <>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => modificarOC(oc.nroOrdenCompra)}
                      className="me-2"
                    >
                      Modificar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarOC(oc.nroOrdenCompra)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => enviarOrden(oc.nroOrdenCompra)}
                    >
                      Enviar
                    </Button>
                  </>
                )}
                {oc.estadoOC === 'ENVIADA' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => finalizarOrden(oc.nroOrdenCompra)}
                  >
                    Finalizar
                  </Button>
                )}
                 {oc.estadoOC === 'ENVIADA' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => finalizarOrden(oc.nroOrdenCompra)}
                  >
                    Finalizar
                  </Button>
                )}
                 {/* Ver si lo dejo */}
                {oc.estadoOC === 'FINALIZADA' && (
                  <span>Finalizada</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={detalleVisible} onHide={cerrarDetalle}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle Orden Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalle ? (
            <div>
              <p><strong>Nro OC:</strong> {detalle.nroOrden}</p>
              <p><strong>Nombre:</strong> {detalle.nombreOC}</p>
              {detalle.detallesOC && detalle.detallesOC.length > 0 && (
                <>
                  <p><strong>Artículos:</strong></p>
                  <ul>
                    {detalle.detallesOC.map((item, idx) => (
                      <li key={idx}>
                        {item.nombreArticulo} - Cantidad: {item.cantidadArticulo}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : <p>Cargando...</p>}
        </Modal.Body>
      </Modal>

      {mostrarModalModificar && (
        <ModificarOrdenCompra
          orden={ordenSeleccionada}
          onClose={cerrarModalModificar}
        />
      )}
      
    </div>
  );
};

export default ListaOrdenesCompra;

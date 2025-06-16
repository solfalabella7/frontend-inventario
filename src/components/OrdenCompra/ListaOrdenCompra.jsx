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
      const response = await axios.get(`/ordenCompra/${nro}/datos`);
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

  const cancelarOC = async (nro) => {
    if (window.confirm('¿Estás seguro de que querés cancelar esta orden?')) {
      try {
        await axios.put(`/ordenCompra/${nro}/cancelar`);
        cargarOrdenes();
      } catch (err) {
        console.error(err);
        alert('Error al cancelar la orden de compra');
      }
    }
  };

const enviarOrden = async (nro) => {
  try {
    await axios.put(`/ordenCompra/${nro}/enviar`); 
    // Refrescar lista
    cargarOrdenes(); // <- vuelve a pedir todas las órdenes para ver el nuevo estado
    alert('Orden enviada exitosamente ✅');
  } catch (err) {
    console.error(err);
    alert('Error al enviar la orden: ' + (err.response?.data || err.message));
  }
};

const finalizarOrden = async (nro) => {
  try {
    const response = await axios.put(`/ordenCompra/${nro}/finalizar`);
    const { ordenCompra, alertar } = response.data;

    // actualizar la lista local
    setOrdenes(ordenes.map(o => o.nroOrdenCompra === nro ? ordenCompra : o));

    if (alertar) {
      alert("⚠️ El stock total de uno o más artículos aún no alcanza el punto de pedido tras finalizar la OC.");
    } else {
      alert("✅ Orden finalizada correctamente.");
    }
  } catch (err) {
    console.error(err);
    alert("Error al finalizar la orden: " + (err.response?.data || err.message));
  }
};


  const [mostrarModalModificar, setMostrarModalModificar] = useState(false);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

    const modificarOC = async (nro) => {
     try {
    const response = await axios.get(`/ordenCompra/${nro}/datos`);
    const datosCompletos = response.data;
    setOrdenSeleccionada(datosCompletos);
    setMostrarModalModificar(true);
  } catch (error) {
    console.error("Error al cargar datos completos de la orden:", error);
    alert("No se pudieron obtener los datos para modificar.");
  }
    };

    const cerrarModalModificar = () => {
        setMostrarModalModificar(false);
        setOrdenSeleccionada(null);
        cargarOrdenes();
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
              <td>{oc.fechaOrden ? new Date(oc.fechaOrden).toLocaleDateString() : 'Finalizada'}</td>
              <td>{oc.estadoOC}</td>
              <td>
                {oc.estadoOC === 'FINALIZADA' ? (
                  <span>Finalizada</span>
                ) : (
                  <>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => verDetalle(oc.nroOrdenCompra)}
                      className="me-2"
                    >
                      Ver Detalle
                    </Button>

                    {/* Botones según el estado */}
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
                          onClick={() => cancelarOC(oc.nroOrdenCompra)}
                          className="me-2"
                        >
                          Cancelar
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
                  </>
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
      {/*} {/* Modal Modificar */}
      <Modal show={mostrarModalModificar} onHide={cerrarModalModificar} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modificar Orden de Compra</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ordenSeleccionada ? (
            <ModificarOrdenCompra
              orden={ordenSeleccionada}
              onClose={cerrarModalModificar}  // se llama solo si la modificación fue exitosa
            />
          ) : (
            <p>Cargando datos de la orden...</p>
          )}
        </Modal.Body>
      </Modal>
      
    </div>
  );
};

export default ListaOrdenesCompra;

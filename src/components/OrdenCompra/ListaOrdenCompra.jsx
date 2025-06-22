import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config';
import {
  Table,
  Button,
  Modal,
  Spinner,
} from 'react-bootstrap';
import ModificarOrdenCompra from './ModificarOrdenCompra';
import CancelarOC from './CancelarOC';
import EnviarOC from './EnviarOC';
import FinalizarOC from './FinalizarOC';

const ListaOrdenesCompra = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState(null);
  const [detalleVisible, setDetalleVisible] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [ordenCompraToCancel, setOrdenCompraToCancel] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [ordenCompraToSend, setOrdenCompraToSend] = useState(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [ordenCompraToFinish, setOrdenCompraToFinish] = useState(null);
  const [mostrarModalModificar, setMostrarModalModificar] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);




  useEffect(() => {
    cargarOrdenes();
  }, []);

  if (loading) {
    return <div className="text-center my-5">Cargando artículos...</div>;
  }


  const cargarOrdenes = async ( intento = 1 ) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get('/ordenCompra');
      setOrdenes(response.data);
    } catch (err) {
      if (intento < 3) {
        // 🔁 Reintenta si falla (hasta 3 veces)
        console.warn(`Reintentando cargar órdenes... intento ${intento + 1}`);
        setTimeout(() => cargarOrdenes(intento + 1), 1000); // espera 1s
      } else {
        setError("Error al cargar las órdenes. Intente más tarde.");
        console.error(err);
      }
    } finally {
      setLoading(false);
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


  const confirmarCancelar = async () => {
    if (!ordenCompraToCancel) return;
    setCanceling(true);
    try {
      await axios.put(`/ordenCompra/${nro}/cancelar`);
      cargarOrdenes();
      setShowCancelModal(false);
    } catch (err) {
      console.error("Error al cancelar la orden de compra:", err);
      setError(err.response?.data?.message || 'No se pudo cancelar la orden');
    } finally {
      setCanceling(false);
    }
  }

  const confirmarEnviar = async () => {
    if (!ordenCompraToSend) return;
    setSending(true);
    try {
      await axios.put(`/ordenCompra/${nro}/enviar`);
      cargarOrdenes();
      setShowSendModal(false);
    } catch (err) {
      console.error("Error al enviar la orden de compra:", err);
      setError(err.response?.data?.message || 'No se pudo enviar la orden');
    } finally {
      setSending(false);
    }
  }

  const confirmarFinalizar = async () => {
    if (!ordenCompraToFinalizar) return;
    setFinishing(true);
    try {
      await axios.put(`/ordenCompra/${nro}/finalizar`);
      cargarOrdenes();
      setShowFinishModal(false);
    } catch (err) {
      console.error("Error al finalizar la orden de compra:", err);
      setError(err.response?.data?.message || 'No se pudo enviar la orden');
    } finally {
      setFinishing(false);
    }
  }


  

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

    {/* Mostrar mensaje si no hay órdenes */}
    {!loading && ordenes.length === 0 ? (
      <div className="alert alert-info mt-4">
        No hay órdenes de compra registradas. Cuando se genere una orden, aparecerá en esta lista.
      </div>
    ) : (
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
                        <CancelarOC
                          nroOrdenCompra={oc.nroOrdenCompra}
                          onDeleteSuccess={cargarOrdenes}
                        />
                        <EnviarOC
                          nroOrdenCompra={oc.nroOrdenCompra}
                          onDeleteSuccess={cargarOrdenes}
                        />
                      </>
                    )}

                    {oc.estadoOC === 'ENVIADA' && (
                      <FinalizarOC
                        nroOrdenCompra={oc.nroOrdenCompra}
                        onDeleteSuccess={cargarOrdenes}
                      />
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}

      {/* Modal detalle orden de compra */}
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

      {/* Modal Modificar */}
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

      {/* Modal Cancelar */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar cancelación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea cancelar la orden de compra nro {ordenCompraToCancel?.nroOrdenCompra}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmarCancelar}
            disabled={canceling}
          >
            {canceling ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Cancelando...
              </>
            ) : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Enviar */}
      <Modal show={showSendModal} onHide={() => setShowSendModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar envío</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea enviar la orden de compra nro {ordenCompraToSend?.nroOrdenCompra}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowSendModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmarEnviar}
            disabled={sending}
          >
            {sending ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Enviando...
              </>
            ) : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modal Finalizar */}
      <Modal show={showFinishModal} onHide={() => setShowFinishModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar finalización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea finalizar la orden de compra nro {ordenCompraToFinish?.nroOrdenCompra}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFinishModal(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmarFinalizar}
            disabled={finishing}
          >
            {finishing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Finalizando...
              </>
            ) : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default ListaOrdenesCompra;

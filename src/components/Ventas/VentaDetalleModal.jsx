import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Spinner, Alert } from 'react-bootstrap';
import axios from '../../service/axios.config';

const VentaDetalleModal = ({ show, handleClose, nroVenta }) => {
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && nroVenta != null) {
      setLoading(true);
      setError(null);
      axios.get(`/verDetalle/${nroVenta}`)
        .then(res => {
          setVenta(res.data);
        })
        .catch(err => {
          console.error('Error al obtener el detalle de la venta', err);
          setError('No se pudo obtener el detalle de la venta.');
        })
        .finally(() => setLoading(false));
    }
  }, [show, nroVenta]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalle de Venta #{nroVenta}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" />
            <p className="mt-2">Cargando detalle...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : venta ? (
          <>
            <h5>Cliente</h5>
            <p><strong>Nombre:</strong> {venta.nombreCliente} {venta.apellidoCliente}</p>
            <p><strong>DNI:</strong> {venta.dniCliente}</p>

            <h5 className="mt-4">Artículos</h5>
            {venta.articulos?.length === 0 ? (
              <Alert variant="warning">Esta venta no tiene artículos asociados.</Alert>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código Artículo</th>
                    <th>Nombre Articulo</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {venta.articulos.map((art, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{art.codigoArticulo}</td>
                      <td>{art.nombreArticulo}</td>
                      <td>{art.cantidadVA}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        ) : (
          <p>No se encontraron datos de la venta.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VentaDetalleModal;

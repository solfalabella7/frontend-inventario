import React, { useEffect, useState } from 'react';
import axios from '../../service/axios.config';
import { Table, Button, Spinner, Modal, Alert, Badge } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ListaVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const cargarVentas = async () => {
    try {
      const response = await axios.get('/ventas/tabla');
      setVentas(response.data);
    } catch (err) {
      console.error('Error al cargar ventas:', err);
      setError('Error al cargar las ventas.');
    } finally {
      setLoading(false);
    }
  };

  const verDetalleVenta = async (venta) => {
    try {
      const response = await axios.get(`/ventas/${venta.nroVenta}`);
      setVentaSeleccionada(venta);
      setDetalleVenta(response.data.articulos || []);
      setShowModal(true);
    } catch (err) {
      console.error('Error al obtener detalle:', err);
      setError('No se pudo obtener el detalle de la venta.');
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Listado de Ventas</h2>
        <Link to="/ventas/crear" className="btn btn-primary">Crear Nueva Venta</Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p>Cargando ventas...</p>
        </div>
      ) : ventas.length === 0 ? (
        <Alert variant="info">No se encontraron ventas registradas.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th># Venta</th>
              <th>Fecha</th>
              <th>DNI Cliente</th>
              <th>Cliente</th>
              <th>Cantidad Total</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((v) => (
              <tr key={v.nroVenta}>
                <td>{v.nroVenta}</td>
                <td>{new Date(v.fechaVenta).toLocaleString()}</td>
                <td>{v.dniCliente}</td>
                <td>{v.nombreCliente} {v.apellidoCliente}</td>
                <td>{v.cantidadVenta}</td>
                <td className="text-center">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => verDetalleVenta(v)}
                  >
                    <FaEye className="me-1" /> Ver Detalle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal de detalle */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Venta #{ventaSeleccionada?.nroVenta}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detalleVenta.length === 0 ? (
            <Alert variant="warning">Esta venta no tiene artículos asociados.</Alert>
          ) : (
            <Table bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Artículo</th>
                  <th>Código</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalleVenta.map((art, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{art.articulo?.nombreArticulo || 'N/A'}</td>
                    <td>{art.articulo?.codigoArticulo}</td>
                    <td>{art.cantidadVA}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListaVentas;


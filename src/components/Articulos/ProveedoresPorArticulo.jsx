import React from 'react';
import { Modal, Button, Spinner, Alert, Badge } from 'react-bootstrap';

const ProveedoresPorArticulo = ({
  show,
  handleClose,
  articulo,
  proveedores,
  loading,
  onCambiarPredeterminado
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Proveedores del Artículo #{articulo?.codigoArticulo}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center my-3">
            <Spinner animation="border" />
            <p className="mt-2">Cargando proveedores...</p>
          </div>
        ) : proveedores.length === 0 ? (
          <Alert variant="info">Este artículo no tiene proveedores asociados.</Alert>
        ) : (
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{prov.codProveedor}</td>
                  <td>{prov.nombreProveedor}</td>
                  <td>
                    {prov.predeterminado ? (
                      <Badge bg="success">Predeterminado</Badge>
                    ) : (
                      <Badge bg="secondary">No predeterminado</Badge>
                    )}
                  </td>
                  <td>
                    {!prov.predeterminado && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => onCambiarPredeterminado(prov)}
                      >
                        Marcar como predeterminado
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ProveedoresPorArticulo;

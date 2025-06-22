import React, { useState } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EliminarProveedor = ({ codigoProveedor, nombreProveedor, onDeleteSuccess, disabled }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const handleEliminar = async (codigoProveedor) => {
  try {
    await axios.delete(`/proveedores/${codigoProveedor}`);
    alert('Proveedor eliminado con éxito');
    setShowModal(false);
    onDeleteSuccess?.();
  } catch (error) {
    const status = error?.response?.status;
    const mensaje = error?.response?.data?.message;

    console.log('Mensaje de error recibido del backend:', mensaje);

    if (status === 409) {
      if (mensaje?.toLowerCase().includes("órdenes")) {
        alert("No se puede eliminar el proveedor porque tiene órdenes de compra asociadas.");
      } else if (mensaje?.toLowerCase().includes("predeterminado")) {
        alert("No se puede eliminar el proveedor porque es predeterminado en algún artículo.");
      } else {
        alert("No se puede eliminar el proveedor porque está en uso.");
      }
    } else {
      alert(`Error al eliminar proveedor: ${status ?? 'desconocido'}`);
    }

    console.error('Detalles del error:', error);
  }
};





    return (
        <>
            <Button
                variant="danger"
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={disabled}
            >
                🗑️
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                            {info && <div className="mt-2">{info}</div>}
                        </Alert>
                    )}
                    
                    <p>¿Está seguro que desea eliminar al proveedor "{nombreProveedor}"?</p>
                    <p className="text-muted">
                        Esta acción marcará al proveedor como inactivo.
                    </p>
                    
                    {!error && info && (
                        <Alert variant="info" className="mt-3">
                            {info}
                        </Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowModal(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button 

                        variant="danger"
                        onClick={() => handleEliminar(codigoProveedor)}
                        disabled={loading || error}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Eliminando...
                            </>
                        ) : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EliminarProveedor;
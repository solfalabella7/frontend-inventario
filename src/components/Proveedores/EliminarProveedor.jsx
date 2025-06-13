import React, { useState } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EliminarProveedor = ({ codigoProveedor, nombreProveedor, onDeleteSuccess, disabled }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const handleEliminar = async () => {
        setLoading(true);
        setError(null);
        setInfo(null);
        
        try {
            await axios.delete(`/proveedores/${codigoProveedor}`);
            onDeleteSuccess();
            setShowModal(false);
        } catch (err) {
            console.error('Error al eliminar proveedor:', err);

            const msg = err.response?.data;


            if (msg?.includes('predeterminado')) {
                setError('No se puede eliminar: proveedor es predeterminado en un artículo.');
                setInfo('Debes cambiar el proveedor predeterminado del artículo antes de eliminarlo.');
            } else if (msg?.includes('Órdenes de Compra')) {
                setError('No se puede eliminar: el proveedor tiene órdenes pendientes o confirmadas.');
                setInfo('Debes completar o cancelar esas órdenes antes de darlo de baja.');
            } else {
                setError(msg || 'No se pudo eliminar el proveedor');
            }
            
        } finally {
            setLoading(false);
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
                🗑️ Eliminar
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
                        onClick={handleEliminar}
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
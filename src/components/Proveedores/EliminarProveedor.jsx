import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EliminarProveedor = ({ codigoProveedor, onDeleteSuccess, disabled }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEliminar = async () => {
        setLoading(true);
        try {
            await axios.delete(`/proveedores/${codigoProveedor}`);
            onDeleteSuccess();
            setShowModal(false);
        } catch (err) {
            console.error('Error al eliminar proveedor:', err);
            setError(err.response?.data?.message || 'No se pudo eliminar el proveedor');
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
                    {error && <div className="alert alert-danger">{error}</div>}
                    <p>¿Estás seguro que deseas eliminar este proveedor?</p>
                    <p className="text-muted">Esta acción marcará al proveedor como inactivo.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleEliminar} disabled={loading}>
                        {loading ? 'Eliminando...' : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EliminarProveedor;
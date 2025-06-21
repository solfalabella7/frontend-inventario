import React, { useState } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EnviarOC = ({ nroOrdenCompra, onDeleteSuccess, disabled }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const handleEnviarOC = async () => {
        setLoading(true);
        setError(null);
        setInfo(null);

        try {
            await axios.put(`/ordenCompra/${nroOrdenCompra}/enviar`);
            setShowModal(false);
            onDeleteSuccess();

        } catch (err) {
            console.error('Error al enviar orden de compra:', err);
            const msg = err.response?.data;

            setError(msg || 'No se pudo enviar la Orden de Compra.');
            setInfo('Intente nuevamente');
        } finally {
            setLoading(false)
        }

    };


    return (
        <>
            <Button
                variant="primary"
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={disabled}
                className='me-2'
            >
                Enviar
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar envío</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                            {info && <div className="mt-2">{info}</div>}
                        </Alert>
                    )}

                    <p>¿Está seguro que desea enviar la orden "{nroOrdenCompra}"?</p>

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
                        onClick={handleEnviarOC}
                        disabled={loading || error}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Enviando...
                            </>
                        ) : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EnviarOC;
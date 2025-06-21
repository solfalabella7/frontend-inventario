import React, { useState } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from '../../service/axios.config';

const FinalizarOC = ({ nroOrdenCompra, onDeleteSuccess, disabled }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [advertencia, setAdvertencia] = useState(null);

    const handleFinalizarOC = async () => {
        setLoading(true);
        setError(null);
        setInfo(null);
        setAdvertencia(null);

        try {
            const response = await axios.put(`/ordenCompra/${nroOrdenCompra}/finalizar`);
            const alertar  = response.data;
            setShowModal(false);
            onDeleteSuccess();
            // Mostrar advertencia si corresponde
            if (alertar) {
                setAdvertencia("⚠️ El stock total de uno o más artículos aún no alcanza el punto de pedido tras finalizar la OC.");
            } else {
                setAdvertencia("✅ Orden finalizada correctamente.");
            }

        } catch (err) {
            console.error('Error al finalizar orden de compra:', err);
            const msg = err.response?.data;

            setError(msg || 'No se pudo finalizar la Orden de Compra.');
            setInfo('Intente nuevamente');
        } finally {
            setLoading(false)
        }

    };


    return (
        <>
            <Button
                variant="success"
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={disabled}
                className='me-2'
            >
                Finalizar
            </Button>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar finalización</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                            {info && <div className="mt-2">{info}</div>}
                        </Alert>
                    )}

                    {advertencia && (
                        <Alert variant={advertencia.includes("⚠️") ? "warning" : "success"} dismissible onClose={() => setAdvertencia(null)}>
                            {advertencia}
                        </Alert>
                    )}

                    <p>¿Está seguro que desea finalizar la orden "{nroOrdenCompra}"?</p>

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
                        onClick={handleFinalizarOC}
                        disabled={loading || error}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Finalizando...
                            </>
                        ) : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default FinalizarOC;
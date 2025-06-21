{/*import React, { useState } from 'react';
import axios from '../../service/axios.config';

const EliminarArticulo = ({ codigoArticulo, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEliminar = async () => {
    if (!window.confirm(`¿Seguro que quieres eliminar el artículo ${codigoArticulo}?`)) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/articulos/${codigoArticulo}`);
      onDeleteSuccess();
    } catch (err) {
      console.error(err);
      setError('Error al eliminar el artículo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleEliminar} disabled={loading} title="Eliminar artículo">
        🗑️
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EliminarArticulo;*/}
import React, { useState } from 'react';
import { Button, Modal, Alert } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EliminarArticulo = ({ codigoArticulo, nombreArticulo, onDeleteSuccess, disabled }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);

    const handleEliminar = async () => {
        setLoading(true);
        setError(null);
        setInfo(null);
        
        try {
            await axios.delete(`/articulos/${codigoArticulo}`);
            onDeleteSuccess();
            setShowModal(false);
        } catch (err) {
            console.error('Error al eliminar artículo:', err);

            const msg = err.response?.data;


            if (msg?.includes('pendiente')) {
                setError('No se puede eliminar: El artículo tiene una orden de compra pendiente.');
                setInfo('Cuando no hayan ordenes de compra pendientes se podrá eliminar.');
            } else if (msg?.includes('enviada')) {
                setError('No se puede eliminar: El artículo tiene una orden de compra enviada.');
                setInfo('Cuando no hayan ordenes de compra enviadas se podrá eliminar.');
            } else if (msg?.includes('stock')) {
                setError('No se puede eliminar: El artículo tiene stock disponible.');
                setInfo('Se pordrá eliminar cuando no haya más stock disponible para el artículo.');
            } else {
                setError(msg || 'No se pudo eliminar el articulo');
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
                    
                    <p>¿Está seguro que desea eliminar al artículo "{nombreArticulo}"?</p>
                    <p className="text-muted">
                        Esta acción marcará al artículo como dado de baja.
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

export default EliminarArticulo;



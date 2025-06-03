import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Badge,
    Alert,
    Spinner,
    Dropdown,
    ListGroup
} from 'react-bootstrap';
import axios from '../../service/axios.config';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import EliminarProveedor from './EliminarProveedor';

const ListaProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
    const [articulosProveedor, setArticulosProveedor] = useState([]);
    const [loadingArticulos, setLoadingArticulos] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [proveedorToDelete, setProveedorToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Cargar proveedores al montar el componente
    useEffect(() => {
        cargarProveedores();
    }, []);

    const cargarProveedores = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/proveedores');
            setProveedores(response.data);
        } catch (err) {
            console.error('Error al cargar proveedores:', err);
            setError('No se pudieron cargar los proveedores. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const verArticulosProveedor = async (codigoProveedor) => {
        setLoadingArticulos(true);
        try {
            const response = await axios.get(`/proveedores/${codigoProveedor}/articulos`);
            setArticulosProveedor(response.data);
            setProveedorSeleccionado(
                proveedores.find(p => p.codigoProveedor === codigoProveedor)
            );
            setShowModal(true);
        } catch (err) {
            console.error('Error al cargar artículos:', err);
            setError('No se pudieron cargar los artículos del proveedor.');
        } finally {
            setLoadingArticulos(false);
        }
    };

    const handleDeleteClick = (proveedor) => {
        setProveedorToDelete(proveedor);
        setShowDeleteModal(true);
        setError(null); //Resetear error al abrir el modal
    };

    const confirmarEliminar = async () => {
        if (!proveedorToDelete) return;

        setDeleting(true);
        try {
            await axios.delete(`/proveedores/${proveedorToDelete.codigoProveedor}`);
            cargarProveedores();
            setShowDeleteModal(false);
        } catch (err) {
            console.error('Error al eliminar proveedor:', err);
            setError(err.response?.data?.message || 'No se pudo eliminar el proveedor');
        } finally {
            setDeleting(false);
        }
    };

    const getEstadoProveedor = (proveedor) => {
        if (proveedor.fechaHoraBajaProveedor) {
            return <Badge bg="secondary">Inactivo</Badge>;
        }
        return <Badge bg="success">Activo</Badge>;
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Listado de Proveedores</h2>
                <Link to="/proveedores/crear" className="btn btn-primary">
                    <FaPlus className="me-2" /> Nuevo Proveedor
                </Link>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                    <p>Cargando proveedores...</p>
                </div>
            ) : proveedores.length === 0 ? (
                <Alert variant="info">
                    No hay proveedores registrados. <Link to="/proveedores/crear">Crear nuevo proveedor</Link>
                </Alert>
            ) : (
                <>
                    <Table striped bordered hover responsive className="mt-3">
                        <thead className="table-dark">
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Artículos</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proveedores.map((proveedor) => (
                                <tr key={proveedor.codigoProveedor}>
                                    <td>{proveedor.codigoProveedor}</td>
                                    <td>{proveedor.nombreProveedor}</td>
                                    <td className="text-center">{getEstadoProveedor(proveedor)}</td>
                                    <td className="text-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => verArticulosProveedor(proveedor.codigoProveedor)}
                                            disabled={!!proveedor.fechaHoraBajaProveedor}
                                        >
                                            <FaEye className="me-1" /> Ver
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <Link
                                                to={`/proveedores/editar/${proveedor.codigoProveedor}`}
                                                className={`btn btn-sm btn-warning ${proveedor.fechaHoraBajaProveedor ? 'disabled' : ''}`}
                                            >
                                                <FaEdit />
                                            </Link>
                                            <EliminarProveedor
                                                codigoProveedor={proveedor.codigoProveedor}
                                                nombreProveedor={proveedor.nombreProveedor}
                                                onDeleteSuccess={cargarProveedores}
                                                disabled={!!proveedor.fechaHoraBajaProveedor}
                                            />


                                            {/*<Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(proveedor)}
                                                disabled={!!proveedor.fechaHoraBajaProveedor}
                                            >
                                            <FaTrash />
                                            </Button>*/}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Modal para ver artículos del proveedor */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Artículos del proveedor: {proveedorSeleccionado?.nombreProveedor}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {loadingArticulos ? (
                                <div className="text-center">
                                    <Spinner animation="border" />
                                    <p>Cargando artículos...</p>
                                </div>
                            ) : articulosProveedor.length === 0 ? (
                                <Alert variant="info">Este proveedor no tiene artículos asociados.</Alert>
                            ) : (
                                <ListGroup>
                                    {articulosProveedor.map((pa) => (
                                        <ListGroup.Item key={pa.codigoProveedorArticulo}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5>{pa.articulo.nombreArticulo}</h5>
                                                    <div className="text-muted">Código: {pa.articulo.codigoArticulo}</div>
                                                    <div className="mt-2">
                                                        <Badge bg="light" text="dark" className="me-2">
                                                            Precio: ${pa.precioUnitProveedorArticulo.toFixed(2)}
                                                        </Badge>
                                                        <Badge bg="light" text="dark" className="me-2">
                                                            Demora: {pa.demoraEntrega} días
                                                        </Badge>
                                                        {pa.esPredeterminado && (
                                                            <Badge bg="primary">Predeterminado</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Aquí podrías implementar la edición de la asociación
                                                        }}
                                                    >
                                                        Editar
                                                    </Button>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Modal de confirmación para eliminar */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar eliminación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            ¿Está seguro que desea eliminar al proveedor "{proveedorToDelete?.nombreProveedor}"?
                            <div className="mt-2 text-muted">
                                Esta acción marcará al proveedor como inactivo.
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={confirmarEliminar}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Eliminando...
                                    </>
                                ) : 'Confirmar'}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default ListaProveedores;
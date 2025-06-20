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
            const ordenados = response.data.sort((a, b) => {
                // Los activos primero (true > false)
                return (b.activo === true) - (a.activo === true);
            });
            setProveedores(ordenados);
        } catch (err) {
            console.error('Error al cargar proveedores:', err);
            setError('No se pudieron cargar los proveedores. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const verArticulosProveedor = async (codigoProveedor) => {
        setLoadingArticulos(true);
        setError(null);
        try {
            const response = await axios.get(`/proveedores/${codigoProveedor}/articulos`);
            console.log("Artículos recibidos:", response.data); // <- Verifica aquí
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
        if (!proveedor.activo) {
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
                                <tr
                                    key={proveedor.codigoProveedor}
                                    className={!proveedor.activo ? 'table-secondary' : ''}
                                >
                                    <td>{proveedor.codigoProveedor}</td>
                                    <td>{proveedor.nombreProveedor}</td>
                                    <td className="text-center">{getEstadoProveedor(proveedor)}</td>
                                    <td className="text-center">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => verArticulosProveedor(proveedor.codigoProveedor)}
                                            disabled={!proveedor.activo}
                                        >
                                            <FaEye className="me-1" /> Ver
                                        </Button>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <Link
                                                to={`/proveedores/editar/${proveedor.codigoProveedor}`}
                                                className={`btn btn-sm btn-warning ${!proveedor.activo ? 'disabled' : ''}`}
                                            >
                                                <FaEdit />
                                            </Link>
                                            <EliminarProveedor
                                                codigoProveedor={proveedor.codigoProveedor}
                                                nombreProveedor={proveedor.nombreProveedor}
                                                onDeleteSuccess={cargarProveedores}
                                                disabled={!proveedor.activo}
                                            />
                                            
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
                                <Badge bg="info" className="ms-2">
                                    {articulosProveedor.length} artículos
                                </Badge>
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

                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Código</th>
                                            <th>Precio</th>
                                            <th>Demora</th>
                                            <th>Costo Pedido</th>
                                            <th>Costo Mantenimiento</th>
                                            <th>Lote Óptimo</th>
                                            <th>Nivel Servicio (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articulosProveedor.map((articulo, index) => (
                                            <tr key={articulo.codigoArticulo || index}>
                                                <td>{index + 1}</td>
                                                <td>{articulo.codigoArticulo}</td>
                                                <td>${articulo.precioUnitProveedorArticulo}</td>
                                                <td>{articulo.demoraEntrega} días</td>
                                                <td>${articulo.costoPedido}</td>
                                                <td>${articulo.costoMantenimiento}</td>
                                                <td>{articulo.loteOptimo}</td>
                                                <td>{articulo.nivelDeServicio}%</td>
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
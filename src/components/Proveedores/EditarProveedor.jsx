import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as FormBs, Alert, ListGroup, Badge, Spinner } from 'react-bootstrap';
import axios from '../../service/axios.config';

const EditarProveedor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [proveedor, setProveedor] = useState(null);
    const [articulos, setArticulos] = useState([]);
    const [asociaciones, setAsociaciones] = useState([]);
    const [currentAsociacion, setCurrentAsociacion] = useState({
        codigoArticulo: '',
        precioUnitProveedorArticulo: 0,
        demoraEntrega: 1,
        esPredeterminado: false
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [respProveedor, respArticulos] = await Promise.all([
                    axios.get(`/proveedores/${id}`),
                    axios.get('/articulos')
                ]);
                setProveedor(respProveedor.data);
                setAsociaciones(respProveedor.data.proveedorArticulos || []);
                setArticulos(respArticulos.data);
            } catch (err) {
                console.error('Error al cargar datos:', err);
                setError('No se pudieron cargar los datos del proveedor.');
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [id]);

    const validationSchema = Yup.object().shape({
        nombreProveedor: Yup.string()
            .min(2, 'Nombre demasiado corto')
            .max(50, 'Nombre demasiado largo')
            .required('El nombre es obligatorio')
    });

    const handleAddAsociacion = () => {
        if (!currentAsociacion.codigoArticulo) {
            setError('Debe seleccionar un artículo');
            return;
        }

        if (asociaciones.some(a => a.codigoArticulo === currentAsociacion.codigoArticulo)) {
            setError('Este artículo ya está asociado');
            return;
        }

        setAsociaciones([...asociaciones, currentAsociacion]);
        setCurrentAsociacion({
            codigoArticulo: '',
            precioUnitProveedorArticulo: 0,
            demoraEntrega: 1,
            esPredeterminado: false
        });
        setError(null);
    };

    const handleRemoveAsociacion = (index) => {
        const nuevas = [...asociaciones];
        nuevas.splice(index, 1);
        setAsociaciones(nuevas);
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        if (asociaciones.length === 0) {
            setError('Debe asociar al menos un artículo');
            setSubmitting(false);
            return;
        }

        try {
            const dto = {
                nombreProveedor: values.nombreProveedor,
                asociaciones: asociaciones
            };
            await axios.put(`/proveedores/${id}`, dto);
            setSuccess('Proveedor actualizado correctamente');
            setTimeout(() => navigate('/proveedores'), 1500);
        } catch (err) {
            console.error('Error al guardar proveedor:', err);
            setError(err.response?.data?.message || 'Error al guardar los cambios');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Cargando proveedor...</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Editar Proveedor</h2>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Formik
                initialValues={{ nombreProveedor: proveedor.nombreProveedor }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting }) => (
                    <Form>
                        <FormBs.Group className="mb-3">
                            <FormBs.Label>Nombre del Proveedor *</FormBs.Label>
                            <Field
                                name="nombreProveedor"
                                as={FormBs.Control}
                                type="text"
                                placeholder="Ingrese nombre"
                            />
                            <ErrorMessage name="nombreProveedor" component="div" className="text-danger" />
                        </FormBs.Group>

                        <div className="border p-3 mb-4 bg-light rounded">
                            <h5>Asociar Artículos</h5>

                            <FormBs.Group className="mb-3">
                                <FormBs.Label>Artículo</FormBs.Label>
                                <FormBs.Select
                                    value={currentAsociacion.codigoArticulo}
                                    onChange={(e) => setCurrentAsociacion({
                                        ...currentAsociacion,
                                        codigoArticulo: e.target.value
                                    })}
                                >
                                    <option value="">Seleccione un artículo</option>
                                    {articulos.map((a) => (
                                        <option key={a.codigoArticulo} value={a.codigoArticulo}>
                                            {a.nombreArticulo}
                                        </option>
                                    ))}
                                </FormBs.Select>
                            </FormBs.Group>

                            <FormBs.Group className="mb-3">
                                <FormBs.Label>Precio Unitario ($)</FormBs.Label>
                                <FormBs.Control
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={currentAsociacion.precioUnitProveedorArticulo}
                                    onChange={(e) => setCurrentAsociacion({
                                        ...currentAsociacion,
                                        precioUnitProveedorArticulo: parseFloat(e.target.value) || 0
                                    })}
                                />
                            </FormBs.Group>

                            <FormBs.Group className="mb-3">
                                <FormBs.Label>Demora de Entrega (días)</FormBs.Label>
                                <FormBs.Control
                                    type="number"
                                    min="1"
                                    value={currentAsociacion.demoraEntrega}
                                    onChange={(e) => setCurrentAsociacion({
                                        ...currentAsociacion,
                                        demoraEntrega: parseInt(e.target.value) || 1
                                    })}
                                />
                            </FormBs.Group>

                            <FormBs.Check
                                type="checkbox"
                                label="Proveedor predeterminado para este artículo"
                                checked={currentAsociacion.esPredeterminado}
                                onChange={(e) => setCurrentAsociacion({
                                    ...currentAsociacion,
                                    esPredeterminado: e.target.checked
                                })}
                            />

                            <Button className="mt-2" onClick={handleAddAsociacion}>Agregar Artículo</Button>
                        </div>

                        {asociaciones.length > 0 ? (
                            <ListGroup className="mb-4">
                                {asociaciones.map((a, i) => {
                                    const art = articulos.find(x => x.codigoArticulo === a.codigoArticulo);
                                    return (
                                        <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{art?.nombreArticulo || 'Artículo desconocido'}</strong>
                                                <div className="text-muted">Código: {a.codigoArticulo}</div>
                                                <div>Precio: ${a.precioUnitProveedorArticulo}</div>
                                                <div>Demora: {a.demoraEntrega} días</div>
                                                {a.esPredeterminado && <Badge bg="primary">Predeterminado</Badge>}
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleRemoveAsociacion(i)}
                                            >
                                                Eliminar
                                            </Button>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        ) : (
                            <Alert variant="warning">Este proveedor no tiene artículos asociados.</Alert>
                        )}

                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default EditarProveedor;

import React, { useEffect, useState } from "react";
import axios from "../../service/axios.config";
import { Form, Button, Table, Alert, Row, Col } from "react-bootstrap";
import * as Yup from 'yup';

const CreateVenta = () => {
    const [articulos, setArticulos] = useState([]);
    const [articuloSeleccionado, setArticuloSeleccionado] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [listaArticulos, setListaArticulos] = useState([]);
    const [cliente, setCliente] = useState({ dni: "", nombre: "", apellido: "" });
    const [mensaje, setMensaje] = useState(null);
    const [error, setError] = useState(null);
    const [errorCantidad, setErrorCantidad] = useState(null);

    // Obtener artículos activos del backend
    useEffect(() => {
        axios.get("/articulos").then((res) => {
            setArticulos(res.data.filter(a => !a.fechaHoraBajaArticulo));
        });
    }, []);

    /*const agregarArticulo = () => {
        if (!articuloSeleccionado || cantidad <= 0) return;

        const yaAgregado = listaArticulos.find(
            (item) => item.codigo === parseInt(articuloSeleccionado)
        );
        if (yaAgregado) {
            setError("Este artículo ya fue agregado.");
            return;
        }

        const articulo = articulos.find(
            (a) => a.codigoArticulo === parseInt(articuloSeleccionado)
        );

        setListaArticulos((prev) => [
            ...prev,
            {
                codigo: articulo.codigoArticulo,
                nombre: articulo.nombreArticulo,
                cantidad: parseInt(cantidad),
            },
        ]);
        setArticuloSeleccionado("");
        setCantidad(1);
        setError(null);
    };*/

    const agregarArticulo = () => {
        if (!articuloSeleccionado) {
            setErrorCantidad("Debe seleccionar un artículo.");
            return;
        }

        if (cantidad <= 0) {
            setErrorCantidad("La cantidad debe ser mayor a cero.");
            return;
        }

        const yaAgregado = listaArticulos.find(
            (item) => item.codigo === parseInt(articuloSeleccionado)
        );
        if (yaAgregado) {
            setError("Este artículo ya fue agregado.");
            setErrorCantidad(null);
            return;
        }

        const articulo = articulos.find(
            (a) => a.codigoArticulo === parseInt(articuloSeleccionado)
        );

        setListaArticulos((prev) => [
            ...prev,
            {
                codigo: articulo.codigoArticulo,
                nombre: articulo.nombreArticulo,
                cantidad: parseInt(cantidad),
            },
        ]);
        setArticuloSeleccionado("");
        setCantidad(1);
        setErrorCantidad(null);
        setError(null);
    };


    const eliminarArticulo = (codigo) => {
        setListaArticulos(listaArticulos.filter((a) => a.codigo !== codigo));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMensaje(null);

        if (!cliente.dni || isNaN(Number(cliente.dni))) {
            setError("Debe ingresar un DNI válido.");
            return;
        }

        if (!cliente.dni || !cliente.nombre || !cliente.apellido) {
            setError("Debe completar los datos del cliente.");
            return;
        }

        if (listaArticulos.length === 0) {
            setError("Debe agregar al menos un artículo a la venta.");
            return;
        }

        const ventaData = {
            dniCliente: Number(cliente.dni),
            nombreCliente: cliente.nombre,
            apellidoCliente: cliente.apellido,
            articulos: listaArticulos.map((a) => ({
                codigoArticulo: a.codigo,
                cantidadVA: a.cantidad,
            })),
        };

        try {
            console.log("Datos enviados:", ventaData); //despues borrar, solo para verificar qué se envía
            const res = await axios.post("/ventas", ventaData);
            setMensaje("Venta creada con éxito.");
            setCliente({ dni: "", nombre: "", apellido: "" });
            setListaArticulos([]);
        } catch (err) {
            console.error(err);

            const msg =
                err.response?.data || "No se pudo crear la venta. Verifique los datos.";
            setError(msg);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Crear Venta</h2>

            {mensaje && <Alert variant="success">{mensaje}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Label>DNI</Form.Label>
                        <Form.Control
                            type="number"
                            value={cliente.dni}
                            onChange={(e) => setCliente({ ...cliente, dni: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={cliente.nombre}
                            onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control
                            type="text"
                            value={cliente.apellido}
                            onChange={(e) => setCliente({ ...cliente, apellido: e.target.value })}
                        />
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Label>Artículo</Form.Label>
                        <Form.Select
                            value={articuloSeleccionado}
                            onChange={(e) => setArticuloSeleccionado(e.target.value)}
                        >
                            <option value="">Seleccione</option>
                            {articulos.map((a) => (
                                <option key={a.codigoArticulo} value={a.codigoArticulo}>
                                    {a.nombreArticulo}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={3}>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            isInvalid={!!errorCantidad}
                        />
                        {errorCantidad && (
                            <Form.Text className="text-danger">{errorCantidad}</Form.Text>
                        )}
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                        <Button variant="primary" onClick={agregarArticulo}>
                            Agregar
                        </Button>
                    </Col>
                </Row>

                {listaArticulos.length > 0 && (
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaArticulos.map((art) => (
                                <tr key={art.codigo}>
                                    <td>{art.codigo}</td>
                                    <td>{art.nombre}</td>
                                    <td>{art.cantidad}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => eliminarArticulo(art.codigo)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                <Button type="submit" variant="success">
                    Confirmar Venta
                </Button>
            </Form>
        </div>
    );
};

export default CreateVenta;


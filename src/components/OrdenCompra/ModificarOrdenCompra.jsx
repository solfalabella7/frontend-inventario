import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../service/axios.config';
import Button from 'react-bootstrap/Button';
import FormBs from 'react-bootstrap/Form';

const ModificarOrdenCompra = ({ orden, onClose }) => {
  const [articulosPermitidos, setArticulosPermitidos] = useState([]);
  const [proveedorSugeridoPorArticulo, setProveedorSugeridoPorArticulo] = useState({});

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await axios.get(`/ordenCompra/ArticulosPorProveedor/${orden.codProveedor}`);
        let permitidos = res.data;

        // Asegurar que los artículos ya seleccionados estén en la lista
        orden.detallesOC.forEach(item => {
          const existe = permitidos.some(a => a.codArticulo === item.codArticulo);
          if (!existe) {
            const nombreFallback =  ` ${item.nombreArticulo}`;
            permitidos.push({
              codArticulo: item.codArticulo,
              nombreArticulo: nombreFallback
            });
          }
        });

        setArticulosPermitidos(permitidos);
      } catch (error) {
        console.error('Error al cargar artículos del proveedor:', error);
        setArticulosPermitidos([]);
      }
    };

    if (orden?.codProveedor) {
      fetchArticulos();
    }
  }, [orden?.codProveedor]);

  if (!orden || !orden.detallesOC) return <p>Cargando datos...</p>;

  const initialValues = {
    nroOrden: orden.nroOrden,
    nombreOC: orden.nombreOC,
    detallesOC: orden.detallesOC.map(item => ({
      codArticulo: item.codArticulo,
      cantidadArticulo: item.cantidadArticulo
    }))
  };

  const validationSchema = Yup.object().shape({
    nombreOC: Yup.string().max(150, 'Nombre demasiado largo').required('Campo requerido'),
    detallesOC: Yup.array().of(
      Yup.object().shape({
        codArticulo: Yup.number().required('Seleccione un artículo'),
        cantidadArticulo: Yup.number().required('Ingrese cantidad').min(1, 'Debe ser al menos 1')
      })
    )
  });

  const handleSubmit = async (values) => {
    try {
      await axios.put(`/ordenCompra/${values.nroOrden}/modificar`, values);
      alert('✅ Orden modificada con éxito');
      onClose();
    } catch (error) {
      console.error('❌ Error al modificar:', error);
      alert('No se pudo modificar la orden');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <FormBs.Group className="mb-3">
            <label>Nombre de la Orden</label>
            <Field name="nombreOC" className="form-control" />
            <ErrorMessage name="nombreOC" component="div" className="text-danger" />
          </FormBs.Group>

          <FieldArray name="detallesOC">
            {({ remove, push }) => (
              <div>
                <h5>Artículos</h5>
                {values.detallesOC.map((detalle, index) => (
                  <div key={index} className="row mb-2">
                    <div className="col-md-6">
                      <FormBs.Label>Artículo</FormBs.Label>
                      <Field
                        as="select"
                        name={`detallesOC[${index}].codArticulo`}
                        className="form-control"
                        value={detalle.codArticulo || ""}
                        onChange={async (e) => {
                          const codArticulo = Number(e.target.value);
                          setFieldValue(`detallesOC[${index}].codArticulo`, codArticulo);

                          try {
                            const res = await axios.get(`/ordenCompra/ProvPredeterminado/${codArticulo}`);
                            if (res.status === 200) {
                              setProveedorSugeridoPorArticulo(prev => ({
                                ...prev,
                                [index]: res.data.nombreProveedorPredeterminado
                              }));
                            }
                          } catch (error) {
                            console.error("Error al obtener proveedor predeterminado:", error);
                          }
                        }}
                      >
                        <option value="">-- Seleccionar artículo --</option>
                        {articulosPermitidos.map(a => (
                          <option key={a.codArticulo} value={a.codArticulo}>
                            {a.nombreArticulo}
                          </option>
                        ))}
                      </Field>
                      {proveedorSugeridoPorArticulo[index] && (
                        <small className="text-muted">
                          Proveedor predeterminado: {proveedorSugeridoPorArticulo[index]}
                        </small>
                      )}
                      <ErrorMessage name={`detallesOC[${index}].codArticulo`} component="div" className="text-danger" />
                    </div>

                    <div className="col-md-4">
                      <FormBs.Label>Cantidad</FormBs.Label>
                      <Field
                        type="number"
                        name={`detallesOC[${index}].cantidadArticulo`}
                        className="form-control"
                      />
                      <ErrorMessage name={`detallesOC[${index}].cantidadArticulo`} component="div" className="text-danger" />
                    </div>

                    <div className="col-md-2 d-flex align-items-end">
                      <Button variant="danger" onClick={() => remove(index)}>X</Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={() => push({ codArticulo: '', cantidadArticulo: '' })}>
                  Agregar Artículo
                </Button>
              </div>
            )}
          </FieldArray>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar Cambios</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ModificarOrdenCompra;

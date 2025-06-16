import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from '../../service/axios.config';
import Button from 'react-bootstrap/Button';
import FormBs from 'react-bootstrap/Form';

const ModificarOrdenCompra = ({ orden, onClose }) => {
  const [articulos, setArticulos] = useState([]);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await axios.get('/articulos');
        setArticulos(res.data);
      } catch (err) {
        console.error('Error al cargar artículos:', err);
      }
    };
    fetchArticulos();
  }, []);
  
console.log("orden recibido en ModificarOrdenCompra:", orden);

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
    nombreOC: Yup.string().required('Campo requerido'),
    detallesOC: Yup.array().of(
      Yup.object().shape({
        codArticulo: Yup.string().required('Campo requerido'),
        cantidadArticulo: Yup.number().min(1).required('Debe ser mayor a 0')
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
      {({ values }) => (
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
                {values.detallesOC.map((_, index) => (
                  <div key={index} className="row mb-2">
                    <div className="col-md-6">
                      <Field as="select" name={`detallesOC[${index}].codArticulo`} className="form-control">
                        <option value="">-- Seleccionar artículo --</option>
                        {articulos.map(art => (
                          <option key={art.codigoArticulo} value={art.codigoArticulo}>
                            {art.nombreArticulo}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name={`detallesOC[${index}].codArticulo`} component="div" className="text-danger" />
                    </div>
                    <div className="col-md-4">
                      <Field
                        type="number"
                        name={`detallesOC[${index}].cantidadArticulo`}
                        className="form-control"
                        placeholder="Cantidad"
                      />
                      <ErrorMessage name={`detallesOC[${index}].cantidadArticulo`} component="div" className="text-danger" />
                    </div>
                    <div className="col-md-2">
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

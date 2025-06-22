import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup'; 
import Button from 'react-bootstrap/Button';
import FormBs from 'react-bootstrap/Form';
import './Formulario.css'

const FormCreateArticulo = () => {
  const initialValues = {
    nombreArticulo: '',
    descripcion: '',
    stockActualArticulo: '',
    stockSeguridadArticulo: '',
    demandaAnual: '',
    puntoPedido: '',
    modeloElegido: 'TIEMPO_FIJO',
    costoAlmacenamiento: '',
    desviacionEstandar: ''
  };

  const validationSchema = Yup.object().shape({
    nombreArticulo: Yup.string().required('El campo es obligatorio'),
    descripcion: Yup.string().max(150, 'Descripcion demasiada larga'),
    stockActualArticulo: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    stockSeguridadArticulo: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    demandaAnual: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
    puntoPedido:  Yup.number().required('Requerido').moreThan(0, 'Debe ser mayor a cero'),
    modeloElegido: Yup.string().oneOf(['TIEMPO_FIJO', 'LOTE_FIJO']).required('Modelo requerido'),
    desviacionEstandar: Yup.number().required('Requerido').moreThan(0, 'Debe ser mayor a cero'),
    costoAlmacenamiento: Yup.number().required('Requerido').min(0, 'No puede ser negativo'),
  });

  return (
    <div className="container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          const dtoCompleto = {
            nombreArticulo: values.nombreArticulo,
            descripcion: values.descripcion,
            stockReal: parseInt(values.stockActualArticulo),
            stockSeguridad: parseInt(values.stockSeguridadArticulo),
            puntoPedido: values.puntoPedido,
            fechaHoraBajaArticulo: null,
            costoAlmacenamiento: parseFloat(values.costoAlmacenamiento),
            modeloElegido: values.modeloElegido,
            demandaAnual: parseInt(values.demandaAnual),
            desviacionEstandar: parseInt (values.desviacionEstandar)
          };

         console.log(dtoCompleto)
          try {
            const response = await fetch("http://localhost:8080/api/articulos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(dtoCompleto)
            });

            if (!response.ok) throw new Error("Fallo al guardar");

            alert("Artículo guardado exitosamente");
            resetForm();
          } catch (error) {
            alert("Error al guardar el artículo");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormBs.Group className="mb-3">
              <label htmlFor='nombreArticulo'>Nombre del Articulo</label>
              <Field id='nombreArticulo' type='text' name='nombreArticulo' className='form-control field-input' />
              <ErrorMessage name="nombreArticulo" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='descripcion'>Descripción</label>
              <Field id='descripcion' type='text' name='descripcion' className='form-control field-input' />
              <ErrorMessage name="descripcion" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='stockActualArticulo'>Stock Actual</label>
              <Field id='stockActualArticulo' type='number' name='stockActualArticulo' className='form-control field-input' />
              <ErrorMessage name="stockActualArticulo" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='stockSeguridadArticulo'>Stock de Seguridad</label>
              <Field id='stockSeguridadArticulo' type='number' name='stockSeguridadArticulo' className='form-control field-input' />
              <ErrorMessage name="stockSeguridadArticulo" component="div" className="text-danger" />
            </FormBs.Group>

        

            <FormBs.Group className="mb-3">
              <label htmlFor='demandaAnual'>Demanda Anual</label>
              <Field id='demandaAnual' type='number' name='demandaAnual' className='form-control field-input' />
              <ErrorMessage name="demandaAnual" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='puntoPedido'>Punto de Pedido</label>
              <Field id='puntoPedido' type='number' name='puntoPedido' className='form-control field-input' />
              <ErrorMessage name="puntoPedido" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='costoAlmacenamiento'>Costo de Almacenamineto</label>
              <Field id='costoAlmacenamiento' type='number' name='costoAlmacenamiento' className='form-control field-input' />
              <ErrorMessage name="costoAlmacenamiento" component="div" className="text-danger" />
            </FormBs.Group>

            <FormBs.Group className="mb-3">
              <label htmlFor='modeloElegido'>Modelo Inventario</label>
              <Field as='select' id='modeloElegido' name='modeloElegido' className='form-control field-input'>
                <option value='TIEMPO_FIJO'>TIEMPO_FIJO</option>
                <option value='LOTE_FIJO'>LOTE_FIJO</option>
              </Field>
              <ErrorMessage name="modeloElegido" component="div" className="text-danger" />
            </FormBs.Group>

             <FormBs.Group className="mb-3">
              <label htmlFor='desviacionEstandar'>Desviacion Estandar</label>
              <Field id='desviacionEstandar' type='number' name='desviacionEstandar' className='form-control field-input' />
              <ErrorMessage name="desviacionEstandar" component="div" className="text-danger" />
            </FormBs.Group>

            <Button className='btn btn-primary' type='submit'>Cargar nuevo artículo</Button>
            {isSubmitting && <p>Enviando nuevo artículo...</p>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormCreateArticulo;

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
        stockSeguridadArticulo: ''
    }

    const validationSchema= Yup.object().shape({
        nombreArticulo: Yup.string().required('El campo es obligatorio'),
        descripcion: Yup.string()
                        .max(150, 'Descripcion demasiada larga'),
        stockActualArticulo: Yup.number()
                                .required('Requerido')
                                .min(0, 'No puede ser negativo'),
        stockSeguridadArticulo: Yup.number()
                                    .required('Requerido')
                                    .min(0, 'No puede ser negativo')
    })
        
    
    return(
        <div className="container">
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={ async (values,  { resetForm, setSubmitting }) => {
                try {
                    const response = await fetch("http://localhost:8080/api/articulos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(values)
                    });

                    if (!response.ok) throw new Error("Fallo al guardar");

                    alert("Artículo guardado exitosamente");
                } catch (error) {
                    alert("Error al guardar el artículo");
                } finally {
                    setSubmitting(false);
                }
                console.log(values);
            }}
            >
              {
                ({ values, isSubmitting, errors, touched }) => ( //funcion que renderiza el formulario de formik
                    <Form>
                        <FormBs.Group className="mb-3">
                            <label htmlFor= 'nombreArticulo'>Nombre del Articulo</label>
                            <Field id= 'nombreArticulo' type= 'text' placeholder='Articulo' name='nombreArticulo' className= 'form-control field-input'/>
                            <ErrorMessage name="nombreArticulo" component="div" className="text-danger"  
                            //vemos si hay errores en el campo 
                            />
                        </FormBs.Group>
                       
                        <FormBs.Group className="mb-3">
                            <label htmlFor= 'descripcion'>Descripcion</label>
                            <Field id= 'descripcion' type= 'text' placeholder='descripcion' name='descripcion' className= 'form-control field-input'/>
                            <ErrorMessage name=" descripcion" component="div" className="text-danger"  />    
                        </FormBs.Group>
                        
                        <FormBs.Group className="mb-3">
                            <label htmlFor= 'stockActualArticulo'>Stock Actual Articulo</label>
                            <Field id= 'stockActualArticulo' type= 'number' placeholder='StockActual' name='stockActualArticulo' className= 'form-control field-input'/>
                            <ErrorMessage name="stockActualArticulo" component="div" className="text-danger" /> 
                        </FormBs.Group>

                        <FormBs.Group className="mb-3">
                            <label htmlFor= 'stockSeguridadArticulo'>Stock de Seguridad</label>
                            <Field id= 'stockSeguridadArticulo' type= 'number' placeholder='StockSeguridad' name='stockSeguridadArticulo' className= 'form-control field-input'/>
                            <ErrorMessage name="stockSeguridadArticulo" component="div" className="text-danger" /> 
                        </FormBs.Group>
                        
                         
                         <Button className= 'btn btn-primary'type = 'submit'>Cargar nuevo articulo</Button>
                         {
                            isSubmitting ? (<p>Enviando nuevo articulo</p>) : null
                         }
                    
                    </Form>
                )
              }  
        </Formik>
        </div>
    ); 
}
export default FormCreateArticulo; 
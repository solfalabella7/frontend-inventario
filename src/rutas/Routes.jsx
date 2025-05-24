import React from "react";
import {Routes, Route}from 'react-router-dom'
import Home from '../pages/Home'
import CreateArticulos from '../pages/CreateArticulos'
import ListarArticulos from '../pages/ListaArticulos'
 const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/crear' element={<CreateArticulos />} />
            <Route path='/mostrar' element={<ListarArticulos />} />
        </Routes>
    );
 }

 export default AppRoutes; 
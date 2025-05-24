import { useState } from 'react'
import {BrowserRouter as Router, Routes, Route, Link, BrowserRouter}from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'

import  Navbar from './components/MyNevBar'
import AppRoutes from './rutas/Routes'

function App() {


  return (
    <BrowserRouter>
    <Navbar/>
    <AppRoutes></AppRoutes>
     

    </BrowserRouter>
    
   
  )
  
}

export default App

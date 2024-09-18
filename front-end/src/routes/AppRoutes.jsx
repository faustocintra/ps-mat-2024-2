import React from 'react'
import { Routes, Route } from 'react-router-dom'

import AuthGuard from './AuthGuard'

import Homepage from '../pages/Homepage'

import Login from '../pages/Login'

import CarForm from '../pages/car/CarForm'
import CarList from '../pages/car/CarList'

import CustomerForm from '../pages/customer/CustomerForm'
import CustomerList from '../pages/customer/CustomerList'

import About from '../pages/About'

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={ <Homepage /> } />

    <Route path='/login' element={ <Login/> }/>

    <Route path="/cars" element={ <CarList /> } />
    <Route path="/cars/new" element={ <CarForm /> } />
    <Route path="/cars/:id" element={ <CarForm /> } />

    <Route path="/customers" element={<AuthGuard> <CustomerList /> </AuthGuard>} />
    <Route path="/customers/new" element={ <AuthGuard> <CustomerForm /> </AuthGuard> } />
    <Route path="/customers/:id" element={ <AuthGuard> <CustomerForm /> </AuthGuard> } />

    {/* 11. Crie uma rota para esse componente. */}
    <Route path="/about" element={ <About /> } />
  </Routes>
}
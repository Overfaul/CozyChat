import React, { useEffect, useState } from 'react'
import GettingStarted from './pages/GettingStarted/GettingStarted'
import Home from './pages/Home/Home'
import RegisterForm from './pages/RegisterForm/RegisterForm'
import LoginForm from './pages/LoginForm/LoginForm'
import { useNavigate, Link, Navigate, Route, Routes, } from "react-router-dom"

import Api from './api/api'
export const api = new Api()


function App() {
    const navigate = useNavigate()
    const [isAuthenticated, userHasAuthenticated] = useState([api.isAuth])
    const handleLogout = () => {
        api.isAuth = false
    }

    // move home when user enters the site 
    useEffect(() => {
        if (localStorage.getItem('token')) {
            api.checkAuth()
            userHasAuthenticated(api.isAuth)
            if (isAuthenticated) {
                navigate('/home', { replace: true })
            }
        }
    }, [isAuthenticated])

    return (
            <div>
                <Routes>
                    <Route path='/home' element={<Home handleLogout={handleLogout} />} />
                    <Route path='/' element={<GettingStarted />} />
                    <Route path='/signup' element={<RegisterForm />} />
                    <Route path='/signin' element={<LoginForm />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>

    );
}

export default App;


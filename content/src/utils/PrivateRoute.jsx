import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import Store from '../store/store'
export const store = new Store()

const PrivateRoutes = () => {
    const [isAuthenticated, userHasAuthenticated] = useState(store.isAuth)
    useEffect(() => {
        if (localStorage.getItem('token')) {
          store.checkAuth()
          userHasAuthenticated(true)
        }
      }, [])

    return (
        isAuthenticated ? <Outlet/> : <Navigate to = "/login"/>
    )
}


export default PrivateRoutes;
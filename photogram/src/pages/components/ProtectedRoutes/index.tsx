import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface IProtectedRoutes {}

const ProtectedRoutes: React.FC<IProtectedRoutes> = (props: IProtectedRoutes) => {
    const isAuth: boolean = false;
    const location = useLocation();
    return (isAuth? (<Outlet />) : <Navigate to="/login" state={{ from : location }} />)
}

export default ProtectedRoutes
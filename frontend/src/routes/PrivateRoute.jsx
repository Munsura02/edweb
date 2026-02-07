import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
    const { user, token, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // User is logged in but doesn't have permission
        // Redirect to their appropriate dashboard or a 403 page
        if (user?.role === 'instructor') {
            return <Navigate to="/instructor/dashboard" replace />;
        } else if (user?.role === 'learner') {
            return <Navigate to="/learner/dashboard" replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    return <Outlet />;
};

export default PrivateRoute;

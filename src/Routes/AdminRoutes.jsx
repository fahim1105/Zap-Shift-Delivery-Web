import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import UseRole from '../Hooks/UseRole';
import Loader from '../Component/Loader/Loader';
import Forbidden from '../Component/Forbidden/Forbidden';

const AdminRoutes = ({ children }) => {
    const { loading } = UseAuth();
    const { role, roleLoading } = UseRole();

    if (loading || roleLoading) {
        return <Loader></Loader>
    }
    if (role !== 'admin') {
        return <Forbidden></Forbidden>
    }
    return children;
};

export default AdminRoutes;
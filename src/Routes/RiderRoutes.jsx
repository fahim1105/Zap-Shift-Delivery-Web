import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import UseRole from '../Hooks/UseRole';
import Forbidden from '../Component/Forbidden/Forbidden';
import Loader from '../Component/Loader/Loader';

const RiderRoutes = ({ children }) => {
    const { loading } = UseAuth();
    const { role, roleLoading } = UseRole();

    if (loading || roleLoading) {
        return <Loader></Loader>
    }
    if (role !== 'rider') {
        return <Forbidden></Forbidden>
    }
    return children;
};

export default RiderRoutes;
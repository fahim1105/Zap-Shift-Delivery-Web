import { useQuery } from '@tanstack/react-query';
import React from 'react';
import UseAuth from './UseAuth';
import UseAxiosSecure from './UseAxiosSecure';

const UseRole = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();

    const { isLoading: roleLoading, data: role = 'user' } = useQuery({
        queryKey: ['user-role', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}/role`)
            // console.log("In the use role", res.data)
            return res.data?.role || 'user';
        }
    })
    return { role, roleLoading };
};

export default UseRole;
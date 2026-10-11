import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import RootLayout from '../Layout/RootLayout';
import ErrorPage from '../Pages/ErrorPage/ErrorPage';
import Home from '../Component/Home/Home';
import Coverage from '../Pages/Coverage/Coverage';
import AboutUs from '../Pages/AboutUs/AboutUs';
import AuthLayout from '../Layout/AuthLayout';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Rider from '../Pages/Rider/Rider';
import PrivetRoutes from './PrivetRoutes';
import Services from '../Pages/Services/Services';
import SendParcel from '../Pages/SendParcel/SendParcel';
import DashboardLayout from '../Layout/DashboardLayout';
import MyParcels from '../Pages/Dashboard/MyParcels/MyParcels';
import Payment from '../Pages/Dashboard/Payment/Payment';
import PaymentSuccess from '../Pages/Dashboard/Payment/PaymentSuccess';
import PaymentCancel from '../Pages/Dashboard/Payment/PaymentCancel';
import PaymentHistory from '../Pages/Dashboard/PaymentHistory/PaymentHistory';
import ApproveRider from '../Pages/Dashboard/ApproveRider/ApproveRider';
import UserManagement from '../Pages/Dashboard/UserManagement/UserManagement';
import AdminRoutes from './AdminRoutes';
import AssignRiders from '../Pages/Dashboard/AssignRiders/AssignRiders';
import AssignedDeliveries from '../Pages/Dashboard/AssignedDeliveries/AssignedDeliveries';
import RiderRoutes from './RiderRoutes';

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "/services",
                element: <Services></Services>
            },
            {
                path: "/coverage",
                Component: Coverage,
                loader: () => fetch("/serviceCenter.json").then(res => res.json())
            },
            {
                path: "/about",
                Component: AboutUs
            },
            {
                path: "send-parcel",
                element: <PrivetRoutes><SendParcel></SendParcel></PrivetRoutes>,
                loader: () => fetch("/serviceCenter.json").then(res => res.json())
            },
            {
                path: "/be-a-rider",
                element: <PrivetRoutes><Rider></Rider></PrivetRoutes>,
                loader: () => fetch("/serviceCenter.json").then(res => res.json())
            }
        ]
    },
    {
        path: "/auth",
        Component: AuthLayout,
        children: [
            {
                path: "/auth/login",
                Component: Login
            },
            {
                path: "/auth/register",
                Component: Register
            }
        ]
    },
    {
        path: 'dashboard',
        element: <PrivetRoutes><DashboardLayout></DashboardLayout></PrivetRoutes>,
        children: [
            {
                // Default redirect to my-parcels
                index: true,
                element: <Navigate to="my-parcels" replace />
            },
            {
                path: "my-parcels",
                Component: MyParcels
            },
            {
                path: "payment/:parcelId",
                Component: Payment
            },
            {
                path: "payment-history",
                Component: PaymentHistory
            },
            {
                path: "payment-success",
                Component: PaymentSuccess
            },
            {
                path: "payment-cancelled",
                Component: PaymentCancel
            },

            //  Admin related routes
            {
                path: "approve-riders",
                element: <AdminRoutes><ApproveRider></ApproveRider></AdminRoutes>
            },
            {
                path: "user-management",
                element: <AdminRoutes><UserManagement></UserManagement></AdminRoutes>
            },
            {
                path: "assign-riders",
                element: <AdminRoutes><AssignRiders></AssignRiders></AdminRoutes>
            },
            // Rider related routes
            {
                path: "assigned-deliveries",
                element: <RiderRoutes><AssignedDeliveries></AssignedDeliveries></RiderRoutes>
            }
        ]
    }
]);

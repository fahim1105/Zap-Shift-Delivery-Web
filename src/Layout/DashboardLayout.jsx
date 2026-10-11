import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { TbTruckDelivery, TbLayoutDashboard } from "react-icons/tb";
import { MdWorkHistory, MdAssignmentAdd } from "react-icons/md";
import { RiEBikeFill } from "react-icons/ri";
import { FaTasks, FaUsersCog, FaBars, FaTimes, FaSignOutAlt, FaHome } from "react-icons/fa";
import { HiOutlineBell } from "react-icons/hi";
import UseRole from '../Hooks/UseRole';
import UseAuth from '../Hooks/UseAuth';

const navLinkBase =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full";
const navLinkActive =
    "bg-[#CAEB66] text-[#03373D] font-semibold shadow-sm";
const navLinkInactive =
    "text-slate-500 hover:bg-slate-100 hover:text-slate-800";

const SidebarLink = ({ to, icon: Icon, label, tip }) => (
    <li>
        <NavLink
            to={to}
            title={tip || label}
            className={({ isActive }) =>
                `${navLinkBase} ${isActive ? navLinkActive : navLinkInactive}`
            }
        >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
        </NavLink>
    </li>
);

const SectionLabel = ({ label }) => (
    <li>
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {label}
        </p>
    </li>
);

const DashboardLayout = () => {
    const { role } = UseRole();
    const { user, signOutUser } = UseAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = () => {
        signOutUser().then(() => navigate('/'));
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
                <div className="w-8 h-8 bg-[#CAEB66] rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 bg-[#03373D] rotate-45"></div>
                </div>
                <div>
                    <p className="font-extrabold text-slate-800 text-base leading-none">ZapShift</p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Dashboard</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-3">
                <ul className="space-y-0.5">

                    <SectionLabel label="General" />

                    <SidebarLink to="/" icon={FaHome} label="Home Page" />
                    <SidebarLink to="/dashboard/my-parcels" icon={TbTruckDelivery} label="My Parcels" />
                    <SidebarLink to="/dashboard/payment-history" icon={MdWorkHistory} label="Payment History" />

                    {role === 'rider' && (
                        <>
                            <SectionLabel label="Rider" />
                            <SidebarLink to="/dashboard/assigned-deliveries" icon={FaTasks} label="Assigned Deliveries" />
                        </>
                    )}

                    {role === 'admin' && (
                        <>
                            <SectionLabel label="Admin" />
                            <SidebarLink to="/dashboard/approve-riders" icon={RiEBikeFill} label="Approve Riders" />
                            <SidebarLink to="/dashboard/assign-riders" icon={MdAssignmentAdd} label="Assign Riders" />
                            <SidebarLink to="/dashboard/user-management" icon={FaUsersCog} label="User Management" />
                        </>
                    )}
                </ul>
            </nav>

            {/* User Card at bottom */}
            <div className="border-t border-slate-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#CAEB66] flex-shrink-0 bg-slate-200">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-sm bg-[#CAEB66]">
                                {user?.displayName?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user?.displayName || 'User'}</p>
                        <p className="text-[11px] text-slate-400 truncate capitalize">{role || 'user'}</p>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl py-2 transition-colors"
                >
                    <FaSignOutAlt className="w-3.5 h-3.5" />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-[#F5F7FA] overflow-hidden">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 flex-shrink-0 shadow-sm">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl flex flex-col">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main */}
            <div className="flex flex-col flex-1 overflow-hidden">

                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                        >
                            <FaBars className="w-4 h-4" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2">
                            <TbLayoutDashboard className="text-[#03373D] w-5 h-5" />
                            <span className="font-semibold text-slate-700 text-sm">Dashboard</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Notification bell */}
                        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                            <HiOutlineBell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* User avatar */}
                        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                            <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 bg-[#CAEB66]">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-sm text-[#03373D]">
                                        {user?.displayName?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-slate-700 leading-none">{user?.displayName?.split(' ')[0] || 'User'}</p>
                                <p className="text-[11px] text-slate-400 capitalize mt-0.5">{role || 'user'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;

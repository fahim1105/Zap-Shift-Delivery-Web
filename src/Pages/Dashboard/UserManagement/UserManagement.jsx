import React, { useState } from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { RiShieldUserFill } from 'react-icons/ri';
import { BiSolidShieldX, BiSearchAlt } from 'react-icons/bi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdDeleteForever, MdOutlineManageAccounts } from 'react-icons/md';
import Swal from 'sweetalert2';
import PageWrapper from '../../../Component/Dashboard/PageWrapper';
import PageHeader from '../../../Component/Dashboard/PageHeader';
import DashTable, { TCell, TNum } from '../../../Component/Dashboard/DashTable';

const UserManagement = () => {
    const axiosSecure = UseAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { data = {}, refetch, isLoading } = useQuery({
        queryKey: ['users', searchText, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}&page=${currentPage}&limit=${limit}`);
            return res.data;
        }
    });

    const users = data.result || [];
    const totalUsers = data.totalUsers || 0;
    const totalPages = Math.ceil(totalUsers / limit);

    const handleUser = (user, role, action) => {
        Swal.fire({
            title: `${action} Admin?`,
            text: `Confirming role change for ${user.displayName}`,
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: role === 'admin' ? "#16a34a" : "#ef4444",
            confirmButtonText: `Yes, ${action}`,
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/${user._id}/role`, { role }).then(res => {
                    if (res.data.modifiedCount) {
                        refetch();
                        Swal.fire({ title: "Updated!", icon: "success", toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                    }
                });
            }
        });
    };

    const handleDeleteUser = async (id) => {
        Swal.fire({
            title: "Delete this user?",
            text: "This action is permanent and cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(`/users/${id}`);
                if (res.data.deletedCount) {
                    refetch();
                    Swal.fire({ title: "Deleted!", icon: "success", toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                }
            }
        });
    };

    if (isLoading) return (
        <PageWrapper>
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-ring loading-lg text-secondary"></span>
            </div>
        </PageWrapper>
    );

    return (
        <PageWrapper>
            <PageHeader
                icon={<MdOutlineManageAccounts />}
                title="User Management"
                subtitle="Manage roles, permissions, and user accounts"
                badge={`${totalUsers} Users`}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Users</p>
                            <p className="text-3xl font-extrabold text-secondary">{totalUsers}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                            <MdOutlineManageAccounts className="text-2xl text-secondary" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Admins</p>
                            <p className="text-3xl font-extrabold text-green-600">{users.filter(u => u.role === 'admin').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <RiShieldUserFill className="text-2xl text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Riders</p>
                            <p className="text-3xl font-extrabold text-blue-600">{users.filter(u => u.role === 'rider').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <RiShieldUserFill className="text-2xl text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md mb-6">
                <BiSearchAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                    type="search"
                    placeholder="Search by name or email..."
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* Table */}
            <DashTable
                columns={['#', 'User', 'Email', 'Joined', 'Role', 'Actions']}
                emptyIcon={MdOutlineManageAccounts}
                emptyText="No users found"
                emptySubtext="Users will appear here once they register."
            >
                {users.map((user, index) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                        <TNum n={((currentPage - 1) * limit + index + 1)} />
                        <TCell>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center text-primary font-bold text-sm">
                                            {user.displayName?.[0] || '?'}
                                        </div>
                                    )}
                                </div>
                                <span className="font-semibold text-secondary text-sm">{user.displayName}</span>
                            </div>
                        </TCell>
                        <TCell>
                            <span className="text-gray-500 text-sm">{user.email}</span>
                        </TCell>
                        <TCell>
                            <span className="text-gray-500 text-sm">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                            </span>
                        </TCell>
                        <TCell>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                                user.role === 'admin'
                                    ? 'bg-primary/30 text-secondary'
                                    : user.role === 'rider'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'bg-gray-100 text-gray-500'
                            }`}>
                                {user.role}
                            </span>
                        </TCell>
                        <TCell>
                            <div className="flex items-center gap-1.5">
                                {user.role === 'admin' ? (
                                    <button
                                        onClick={() => handleUser(user, 'user', 'Remove')}
                                        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                        title="Revoke Admin"
                                    >
                                        <BiSolidShieldX className="w-3.5 h-3.5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleUser(user, 'admin', 'Make')}
                                        className="p-2 rounded-xl hover:bg-green-50 text-slate-400 hover:text-green-600 transition-all"
                                        title="Make Admin"
                                    >
                                        <RiShieldUserFill className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                    title="Delete User"
                                >
                                    <MdDeleteForever className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </TCell>
                    </tr>
                ))}
            </DashTable>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-500">
                        Page <span className="font-bold text-secondary">{currentPage}</span> of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-secondary hover:text-white disabled:opacity-30 transition-all"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            <FaChevronLeft className="text-xs" />
                        </button>
                        {[...Array(totalPages).keys()].map(page => (
                            <button
                                key={page}
                                className={`w-9 h-9 rounded-xl font-bold text-sm transition-all border ${
                                    currentPage === page + 1
                                        ? 'bg-secondary text-white border-secondary'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary'
                                }`}
                                onClick={() => setCurrentPage(page + 1)}
                            >
                                {page + 1}
                            </button>
                        ))}
                        <button
                            className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-secondary hover:text-white disabled:opacity-30 transition-all"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default UserManagement;

import React, { useState } from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { RiEBikeFill } from 'react-icons/ri';
import { FaUserCheck, FaUserTimes, FaTrash, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import PageWrapper from '../../../Component/Dashboard/PageWrapper';
import PageHeader from '../../../Component/Dashboard/PageHeader';
import DashTable, { TCell, TNum } from '../../../Component/Dashboard/DashTable';
import StatusBadge from '../../../Component/Dashboard/StatusBadge';
import DashModal from '../../../Component/Dashboard/DashModal';

const ApproveRider = () => {
    const axiosSecure = UseAxiosSecure();
    const [selectedRider, setSelectedRider] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { refetch, data: ridersData = {} } = useQuery({
        queryKey: ['riders', currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders?page=${currentPage}&limit=${limit}&sort=newest`);
            // If backend doesn't support pagination, handle it here
            if (Array.isArray(res.data)) {
                return { riders: res.data, total: res.data.length };
            }
            return { riders: res.data.result || res.data.riders || [], total: res.data.total || 0 };
        }
    });

    const riders = ridersData.riders || [];
    const totalRiders = ridersData.total || riders.length;
    const totalPages = Math.ceil(totalRiders / limit);

    // Sort newest first on client-side - try multiple date fields
    const sortedRiders = [...riders].sort((a, b) => {
        // Try different possible date fields
        const dateA = new Date(
            a.createdAt || 
            a.submittedAt || 
            a.applicationDate || 
            a.registeredAt ||
            a._id // MongoDB ObjectId contains timestamp
        );
        const dateB = new Date(
            b.createdAt || 
            b.submittedAt || 
            b.applicationDate || 
            b.registeredAt ||
            b._id
        );
        
        // If dates are invalid, extract timestamp from MongoDB _id
        const timeA = dateA.getTime() || (a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
        const timeB = dateB.getTime() || (b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
        
        return timeB - timeA; // Newest first (descending)
    });

    // Fetch all users to match with riders
    const { data: allUsers = [] } = useQuery({
        queryKey: ['all-users-for-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users?limit=1000'); // Get all users
            return res.data.result || res.data || [];
        }
    });

    // Create a map of email -> user for quick lookup
    const usersMap = {};
    allUsers.forEach(user => {
        if (user.email) {
            usersMap[user.email] = user;
        }
    });

    // Fetch all riders for stats (without pagination)
    const { data: allRidersForStats = [] } = useQuery({
        queryKey: ['all-riders-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders?limit=1000');
            if (Array.isArray(res.data)) return res.data;
            return res.data.result || res.data.riders || res.data || [];
        }
    });

    const pendingCount = allRidersForStats.filter(r => r.status === 'pending').length;

    const handleStatus = (rider, status) => {
        axiosSecure.patch(`/riders/${rider._id}`, { status, email: rider.email }).then(res => {
            if (res.data.modifiedCount) {
                refetch();
                toast.success(`Rider ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete this rider?',
            text: 'This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete',
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            const res = await axiosSecure.delete(`/riders/${id}`);
            if (res.data.deletedCount) {
                refetch();
                toast.success('Rider deleted.');
            }
        });
    };

    return (
        <PageWrapper>
            <PageHeader
                icon={<RiEBikeFill />}
                title="Rider Applications"
                subtitle="Review, approve, or reject rider applications"
                badge={pendingCount > 0 ? `${pendingCount} pending` : riders.length}
            />

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total', value: allRidersForStats.length, bg: 'bg-slate-800', val: 'text-[#CAEB66]' },
                    { label: 'Pending', value: allRidersForStats.filter(r => r.status === 'pending').length, bg: 'bg-amber-500', val: 'text-white' },
                    { label: 'Approved', value: allRidersForStats.filter(r => r.status === 'approved').length, bg: 'bg-emerald-600', val: 'text-white' },
                    { label: 'Rejected', value: allRidersForStats.filter(r => r.status === 'rejected').length, bg: 'bg-red-500', val: 'text-white' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4`}>
                        <p className={`text-2xl font-extrabold ${s.val}`}>{s.value}</p>
                        <p className="text-white/70 text-xs font-medium mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <DashTable
                columns={['#', 'Name', 'Email', 'District', 'App. Status', 'Work Status', 'Actions']}
                empty="No rider applications found."
                emptyIcon={<RiEBikeFill />}
            >
                {sortedRiders.map((rider, index) => {
                    const user = usersMap[rider.email];
                    const photoURL = user?.photoURL;
                    
                    return (
                    <tr key={rider._id} className="hover:bg-slate-50 transition-colors">
                        <TNum n={((currentPage - 1) * limit + index + 1)} />
                        <TCell>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl border border-gray-200 flex-shrink-0 overflow-hidden">
                                    {photoURL ? (
                                        <img 
                                            src={photoURL} 
                                            alt={rider.Name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.classList.add('bg-secondary', 'flex', 'items-center', 'justify-center');
                                                e.target.parentElement.innerHTML = `<span class="text-primary font-bold text-sm">${rider.Name?.[0]?.toUpperCase() || '?'}</span>`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-secondary flex items-center justify-center text-primary font-bold text-sm">
                                            {rider.Name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                    )}
                                </div>
                                <span className="font-semibold text-secondary text-sm">{rider.Name}</span>
                            </div>
                        </TCell>
                        <TCell><span className="text-slate-500 text-xs">{rider.email}</span></TCell>
                        <TCell>
                            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">{rider.District}</span>
                        </TCell>
                        <TCell><StatusBadge value={rider.status} /></TCell>
                        <TCell><StatusBadge value={rider.workStatus || 'un-available'} /></TCell>
                        <TCell>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleStatus(rider, 'approved')}
                                    title="Approve"
                                    className="p-2 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all"
                                >
                                    <FaUserCheck className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleStatus(rider, 'rejected')}
                                    title="Reject"
                                    className="p-2 rounded-xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all"
                                >
                                    <FaUserTimes className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setSelectedRider(rider)}
                                    title="View Details"
                                    className="p-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-all"
                                >
                                    <FaEye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(rider._id)}
                                    title="Delete"
                                    className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <FaTrash className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </TCell>
                    </tr>
                    );
                })}
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
                        {[...Array(Math.min(totalPages, 5)).keys()].map(i => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={page}
                                    className={`w-9 h-9 rounded-xl font-bold text-sm transition-all border ${
                                        currentPage === page
                                            ? 'bg-secondary text-white border-secondary'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary'
                                    }`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
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

            {/* Rider Details Modal */}
            <DashModal
                open={!!selectedRider}
                onClose={() => setSelectedRider(null)}
                title="Rider Details"
                subtitle={selectedRider?.Name}
                maxWidth="max-w-sm"
            >
                {selectedRider && (() => {
                    const user = usersMap[selectedRider.email];
                    const photoURL = user?.photoURL;
                    
                    return (
                    <>
                        <div className="flex items-center gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
                            <div className="w-14 h-14 rounded-xl border-2 border-gray-200 flex-shrink-0 overflow-hidden">
                                {photoURL ? (
                                    <img 
                                        src={photoURL} 
                                        alt={selectedRider.Name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.classList.add('bg-secondary', 'flex', 'items-center', 'justify-center');
                                            e.target.parentElement.innerHTML = `<span class="text-primary font-extrabold text-xl">${selectedRider.Name?.[0]?.toUpperCase() || '?'}</span>`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-secondary flex items-center justify-center text-primary font-extrabold text-xl">
                                        {selectedRider.Name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{selectedRider.Name}</p>
                                <p className="text-xs text-slate-500">{selectedRider.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Phone', value: selectedRider.phone || selectedRider.yourPhone || '—' },
                                { label: 'District', value: selectedRider.District },
                                { label: 'Vehicle', value: selectedRider.bikeBrandAndModel || '—' },
                                { label: 'Reg. Number', value: selectedRider.bikeRegistrationNumber || '—' },
                                { label: 'NID', value: selectedRider.yourNID || '—' },
                                { label: 'License No.', value: selectedRider.drivingLicenseNumber || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                    <span className="text-sm text-slate-500 font-medium">{label}</span>
                                    <span className="text-sm font-semibold text-slate-700">{value}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-slate-500 font-medium">Status</span>
                                <StatusBadge value={selectedRider.status} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => { handleStatus(selectedRider, 'approved'); setSelectedRider(null); }}
                                className="flex-1 btn bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl border-none text-sm"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => { handleStatus(selectedRider, 'rejected'); setSelectedRider(null); }}
                                className="flex-1 btn bg-red-500 text-white hover:bg-red-600 rounded-xl border-none text-sm"
                            >
                                Reject
                            </button>
                        </div>
                    </>
                    );
                })()}
            </DashModal>
        </PageWrapper>
    );
};

export default ApproveRider;

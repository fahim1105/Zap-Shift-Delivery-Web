import React, { useState } from 'react';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MdAssignmentAdd } from 'react-icons/md';
import { FaSearch, FaMotorcycle, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import PageWrapper from '../../../Component/Dashboard/PageWrapper';
import PageHeader from '../../../Component/Dashboard/PageHeader';
import DashTable, { TCell, TNum } from '../../../Component/Dashboard/DashTable';
import DashModal from '../../../Component/Dashboard/DashModal';
import StatusBadge from '../../../Component/Dashboard/StatusBadge';

const AssignRiders = () => {
    const axiosSecure = UseAxiosSecure();
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { data: parcelsData = {}, refetch: parcelRefetch } = useQuery({
        queryKey: ['parcels', 'pending-pickup', currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?deliveryStatus=pending-pickup&page=${currentPage}&limit=${limit}&sort=newest`);
            if (Array.isArray(res.data)) {
                return { parcels: res.data, total: res.data.length };
            }
            return { parcels: res.data.result || res.data.parcels || [], total: res.data.total || 0 };
        }
    });

    const parcels = parcelsData.parcels || [];
    const totalParcels = parcelsData.total || parcels.length;
    const totalPages = Math.ceil(totalParcels / limit);

    // Sort newest first on client-side
    const sortedParcels = [...parcels].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.bookingDate || 0);
        const dateB = new Date(b.createdAt || b.bookingDate || 0);
        return dateB - dateA;
    });

    // Get all parcels for stats
    const { data: allParcels = [] } = useQuery({
        queryKey: ['all-parcels-pending-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels?deliveryStatus=pending-pickup&limit=1000');
            if (Array.isArray(res.data)) return res.data;
            return res.data.result || res.data.parcels || res.data || [];
        }
    });

    const { data: riders = [] } = useQuery({
        queryKey: ['riders', selectedParcel?.senderDistrict, 'available'],
        enabled: !!selectedParcel,
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders?status=approved&district=${selectedParcel?.senderDistrict}&workStatus=available`);
            return res.data;
        }
    });

    const assignRiderMutation = useMutation({
        mutationFn: async (rider) => {
            const res = await axiosSecure.patch(`/parcels/${selectedParcel._id}`, {
                riderId: rider._id,
                riderName: rider.Name,
                riderEmail: rider.email,
                riderPhone: rider.yourPhone,
                parcelId: selectedParcel._id
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.modifiedCount) {
                setModalOpen(false);
                setSelectedParcel(null);
                parcelRefetch();
                queryClient.invalidateQueries(['riders', selectedParcel?.senderDistrict, 'available']);
                Swal.fire({ title: 'Assigned!', icon: 'success', timer: 1500, showConfirmButton: false });
            }
        }
    });

    const handleOpenModal = (parcel) => {
        setSelectedParcel(parcel);
        setModalOpen(true);
    };

    return (
        <PageWrapper>
            <PageHeader
                icon={<MdAssignmentAdd />}
                title="Assign Riders"
                subtitle="Match pending parcels with available riders"
                badge={allParcels.length}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Pending Assignment', value: allParcels.length, bg: 'bg-amber-500', text: 'text-white' },
                    { label: 'Avg. Wait Time', value: '2.5h', bg: 'bg-blue-600', text: 'text-white' },
                    { label: 'Districts', value: new Set(allParcels.map(p => p.senderDistrict)).size, bg: 'bg-slate-800', text: 'text-[#CAEB66]' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4`}>
                        <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
                        <p className="text-white/70 text-xs font-medium mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <DashTable
                columns={['#', 'Parcel Name', 'Weight', 'Cost', 'Booked At', 'Pickup District', 'Action']}
                empty="All parcels have been assigned."
                emptyIcon={<FaCheckCircle />}
            >
                {sortedParcels.map((parcel, index) => (
                    <tr key={parcel._id} className="hover:bg-slate-50 transition-colors">
                        <TNum n={((currentPage - 1) * limit + index + 1)} />
                        <TCell>
                            <span className="font-semibold text-slate-700">{parcel.parcelName}</span>
                        </TCell>
                        <TCell>
                            <span className="text-slate-500 text-sm">{parcel.parcelWeight} kg</span>
                        </TCell>
                        <TCell>
                            <span className="font-semibold text-slate-800">৳{parcel.cost}</span>
                        </TCell>
                        <TCell>
                            <span className="text-slate-500 text-xs">
                                {new Date(parcel.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                            </span>
                        </TCell>
                        <TCell>
                            <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                {parcel.senderDistrict}
                            </span>
                        </TCell>
                        <TCell>
                            <button
                                onClick={() => handleOpenModal(parcel)}
                                className="inline-flex items-center gap-1.5 bg-[#CAEB66] hover:bg-[#b8d45a] text-[#03373D] text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                            >
                                <FaSearch className="w-3 h-3" />
                                Find Rider
                            </button>
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

            {/* Rider Selection Modal */}
            <DashModal
                open={modalOpen}
                onClose={() => { setModalOpen(false); setSelectedParcel(null); }}
                title="Available Riders"
                subtitle={`District: ${selectedParcel?.senderDistrict || ''} • ${riders.length} found`}
                maxWidth="max-w-2xl"
            >
                {riders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <FaMotorcycle className="text-4xl mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No available riders in {selectedParcel?.senderDistrict}</p>
                        <p className="text-xs mt-1">Try again later or check other districts.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {riders.map((rider, index) => (
                            <div key={rider._id} className="border border-slate-200 bg-slate-50 rounded-xl p-4 hover:border-[#CAEB66] hover:bg-white transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 bg-[#03373D] rounded-xl flex items-center justify-center text-[#CAEB66] font-bold text-sm flex-shrink-0">
                                            {rider.Name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">Rider #{index + 1}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Available</p>
                                        </div>
                                    </div>
                                    <StatusBadge value="available" />
                                </div>
                                <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                                    <p><span className="font-medium text-slate-700">Name:</span> {rider.Name}</p>
                                    <p><span className="font-medium text-slate-700">Phone:</span> {rider.yourPhone}</p>
                                    <p className="truncate"><span className="font-medium text-slate-700">Email:</span> {rider.email}</p>
                                </div>
                                <button
                                    onClick={() => assignRiderMutation.mutate(rider)}
                                    disabled={assignRiderMutation.isLoading}
                                    className="w-full btn bg-[#03373D] hover:bg-[#03373D]/90 text-white border-none rounded-xl btn-sm text-xs font-bold h-9 min-h-0"
                                >
                                    {assignRiderMutation.isLoading ? 'Assigning...' : 'Assign This Rider'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </DashModal>
        </PageWrapper>
    );
};

export default AssignRiders;

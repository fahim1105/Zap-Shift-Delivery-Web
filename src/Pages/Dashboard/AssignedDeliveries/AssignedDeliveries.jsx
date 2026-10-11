import React, { useState } from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaTruck, FaMapMarkerAlt, FaBoxOpen, FaCheckCircle, FaTimesCircle, FaEye } from 'react-icons/fa';
import PageHeader from '../../../Component/Dashboard/PageHeader';
import PageWrapper from '../../../Component/Dashboard/PageWrapper';
import DashTable from '../../../Component/Dashboard/DashTable';
import { TCell, TNum } from '../../../Component/Dashboard/DashTable';
import StatusBadge from '../../../Component/Dashboard/StatusBadge';
import DashModal from '../../../Component/Dashboard/DashModal';

const AssignedDeliveries = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [viewParcel, setViewParcel] = useState(null);

    const { data: parcels = [], refetch, isLoading } = useQuery({
        queryKey: ['parcels', user.email, 'driver-assigned'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=driver-assigned`);
            return res.data;
        }
    });

    const handleUpdateStatus = (parcelId, newStatus, labelText) => {
        Swal.fire({
            title: `${labelText} this delivery?`,
            text: `This will mark the parcel as "${newStatus}".`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: `Yes, ${labelText}`,
            cancelButtonText: 'Cancel',
            confirmButtonColor: newStatus === 'delivered' ? '#16a34a' : '#ef4444',
            cancelButtonColor: '#6b7280',
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                const res = await axiosSecure.patch(`/parcels/${parcelId}`, {
                    deliveryStatus: newStatus,
                });
                if (res.data.modifiedCount) {
                    refetch();
                    toast.success(`Parcel marked as "${newStatus}" successfully.`);
                } else {
                    toast.error('Failed to update status. Try again.');
                }
            } catch (err) {
                console.error(err);
                toast.error('Something went wrong.');
            }
        });
    };

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <span className="loading loading-ring loading-lg text-secondary"></span>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <PageHeader
                icon={FaTruck}
                title="Assigned Deliveries"
                subtitle="Manage your delivery assignments and update delivery status"
                badge={`${parcels.length} Pending`}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Assigned</p>
                            <p className="text-3xl font-extrabold text-secondary">{parcels.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                            <FaBoxOpen className="text-2xl text-secondary" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Ready to Deliver</p>
                            <p className="text-3xl font-extrabold text-green-600">{parcels.filter(p => p.deliveryStatus === 'driver-assigned').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <FaCheckCircle className="text-2xl text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">In Transit</p>
                            <p className="text-3xl font-extrabold text-blue-600">{parcels.filter(p => p.deliveryStatus === 'in-transit').length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FaTruck className="text-2xl text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Deliveries Table */}
            <DashTable
                columns={['#', 'Parcel Details', 'Recipient', 'Destination', 'Tracking ID', 'Status', 'Actions']}
                emptyIcon={FaTruck}
                emptyText="No assigned deliveries"
                emptySubtext="You'll see your delivery assignments here once parcels are assigned to you."
            >
                {parcels.map((parcel, idx) => (
                    <tr key={parcel._id} className="hover:bg-slate-50 transition-colors">
                        <TNum>{idx + 1}</TNum>
                        <TCell>
                            <div>
                                <p className="font-semibold text-secondary">{parcel.parcelName}</p>
                                <p className="text-xs text-gray-400">Weight: {parcel.parcelWeight || 'N/A'} kg</p>
                            </div>
                        </TCell>
                        <TCell>
                            <div>
                                <p className="font-medium text-secondary">{parcel.receiverName || '—'}</p>
                                <p className="text-xs text-gray-400">{parcel.receiverPhone || '—'}</p>
                            </div>
                        </TCell>
                        <TCell>
                            <div className="flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-xs text-gray-400" />
                                <span className="text-sm">{parcel.receiverServiceCenter || parcel.district || '—'}</span>
                            </div>
                        </TCell>
                        <TCell>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                {parcel.trackingId || '—'}
                            </span>
                        </TCell>
                        <TCell>
                            <StatusBadge status={parcel.deliveryStatus} type="delivery" />
                        </TCell>
                        <TCell>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewParcel(parcel)}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-secondary hover:text-white transition-all"
                                    title="View Details"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(parcel._id, 'delivered', 'Confirm')}
                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                    title="Mark as Delivered"
                                >
                                    <FaCheckCircle />
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(parcel._id, 'delivery-failed', 'Reject')}
                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                    title="Mark as Failed"
                                >
                                    <FaTimesCircle />
                                </button>
                            </div>
                        </TCell>
                    </tr>
                ))}
            </DashTable>

            {/* View Details Modal */}
            <DashModal
                open={viewParcel !== null}
                onClose={() => setViewParcel(null)}
                title="Delivery Details"
                subtitle={`Tracking ID: ${viewParcel?.trackingId || 'N/A'}`}
            >
                {viewParcel && (
                    <div className="space-y-4">
                        {/* Parcel Info */}
                        <div className="bg-neutral rounded-xl p-4 space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Parcel Information</h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Name</p>
                                    <p className="font-semibold text-secondary">{viewParcel.parcelName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Weight</p>
                                    <p className="font-semibold text-secondary">{viewParcel.parcelWeight || 'N/A'} kg</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Type</p>
                                    <p className="font-semibold text-secondary">{viewParcel.parcelType || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-xs mb-1">Cost</p>
                                    <p className="font-semibold text-secondary">৳{viewParcel.cost}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recipient Info */}
                        <div className="bg-neutral rounded-xl p-4 space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recipient Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Name</span>
                                    <span className="font-medium text-secondary">{viewParcel.receiverName || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Phone</span>
                                    <span className="font-medium text-secondary">{viewParcel.receiverPhone || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Service Center</span>
                                    <span className="font-medium text-secondary">{viewParcel.receiverServiceCenter || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">District</span>
                                    <span className="font-medium text-secondary">{viewParcel.district || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sender Info */}
                        <div className="bg-neutral rounded-xl p-4 space-y-3">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sender Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Name</span>
                                    <span className="font-medium text-secondary">{viewParcel.senderName || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Phone</span>
                                    <span className="font-medium text-secondary">{viewParcel.senderPhone || '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Email</span>
                                    <span className="font-medium text-secondary text-xs">{viewParcel.senderEmail || '—'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setViewParcel(null);
                                    handleUpdateStatus(viewParcel._id, 'delivered', 'Confirm');
                                }}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <FaCheckCircle />
                                Mark Delivered
                            </button>
                            <button
                                onClick={() => {
                                    setViewParcel(null);
                                    handleUpdateStatus(viewParcel._id, 'delivery-failed', 'Reject');
                                }}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <FaTimesCircle />
                                Mark Failed
                            </button>
                        </div>
                    </div>
                )}
            </DashModal>
        </PageWrapper>
    );
};

export default AssignedDeliveries;

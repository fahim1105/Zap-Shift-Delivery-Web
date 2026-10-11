import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { Pencil, ReceiptText, Trash2, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { TbTruckDelivery } from 'react-icons/tb';
import Swal from 'sweetalert2';
import PageWrapper from '../../../Component/Dashboard/PageWrapper';
import PageHeader from '../../../Component/Dashboard/PageHeader';
import DashTable, { TCell, TNum } from '../../../Component/Dashboard/DashTable';
import StatusBadge from '../../../Component/Dashboard/StatusBadge';
import DashModal from '../../../Component/Dashboard/DashModal';
import { Link } from 'react-router';

const inputClass =
    'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#CAEB66] bg-white transition';

const MyParcels = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [receiptParcel, setReceiptParcel] = useState(null);
    const [editParcel, setEditParcel] = useState(null);
    const [copiedField, setCopiedField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { data: parcelsData = {}, refetch } = useQuery({
        queryKey: ['myParcels', user?.email, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}&page=${currentPage}&limit=${limit}&sort=newest`);
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
        const dateA = new Date(a.createdAt || a.bookingDate || a._id);
        const dateB = new Date(b.createdAt || b.bookingDate || b._id);
        const timeA = dateA.getTime() || (a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
        const timeB = dateB.getTime() || (b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
        return timeB - timeA;
    });

    // Get all parcels for stats
    const { data: allParcels = [] } = useQuery({
        queryKey: ['all-parcels-stats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}&limit=1000`);
            if (Array.isArray(res.data)) return res.data;
            return res.data.result || res.data.parcels || res.data || [];
        }
    });

    const paidCount = allParcels.filter(p => p.paymentStatus === 'paid').length;
    const deliveredCount = allParcels.filter(p => p.deliveryStatus === 'delivered').length;

    const handleParcelDelete = async (id) => {
        Swal.fire({
            title: 'Delete this parcel?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        }).then(async (result) => {
            if (!result.isConfirmed) return;
            Swal.fire({ title: 'Deleting...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const res = await axiosSecure.delete(`/parcels/${id}`);
            if (res.data.deletedCount) {
                refetch();
                await new Promise(r => setTimeout(r, 600));
                Swal.fire({ title: 'Deleted!', icon: 'success', confirmButtonColor: '#CAEB66', timer: 1500, showConfirmButton: false });
            }
        });
    };

    const handlePayment = async (parcel) => {
        const res = await axiosSecure.post('/create-checkout-session', {
            cost: parcel.cost,
            parcelName: parcel.parcelName,
            senderEmail: parcel.senderEmail,
            parcelId: parcel._id
        });
        window.location.assign(res.data.url);
    };

    const handleCopy = (text, field) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const res = await axiosSecure.patch(`/parcels/${editParcel._id}`, {
            parcelName: form.parcelName.value,
            receiverName: form.receiverName.value,
            receiverPhone: form.receiverPhone.value,
        });
        if (res.data.modifiedCount) {
            refetch();
            setEditParcel(null);
            Swal.fire({ title: 'Updated!', icon: 'success', timer: 1500, showConfirmButton: false });
        }
    };

    return (
        <PageWrapper>
            <PageHeader
                icon={<TbTruckDelivery />}
                title="My Parcels"
                subtitle="Track and manage all your parcel bookings"
                badge={parcels.length}
                action={
                    <Link to="/send-parcel" className="btn bg-[#03373D] hover:bg-[#03373D]/90 text-white border-none rounded-xl text-sm font-semibold px-5 h-10 min-h-0">
                        + New Parcel
                    </Link>
                }
            />

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Parcels', value: allParcels.length, color: 'bg-slate-800', text: 'text-[#CAEB66]' },
                    { label: 'Paid', value: paidCount, color: 'bg-emerald-600', text: 'text-white' },
                    { label: 'Delivered', value: deliveredCount, color: 'bg-blue-600', text: 'text-white' },
                    { label: 'Pending', value: allParcels.length - deliveredCount, color: 'bg-amber-500', text: 'text-white' },
                ].map((s, i) => (
                    <div key={i} className={`${s.color} rounded-2xl p-4`}>
                        <p className={`text-2xl font-extrabold ${s.text}`}>{s.value}</p>
                        <p className="text-white/70 text-xs font-medium mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <DashTable
                columns={['#', 'Parcel', 'Cost', 'Payment', 'Status', 'Tracking ID', 'Actions']}
                empty="No parcels yet. Send your first parcel!"
                emptyIcon={<TbTruckDelivery />}
            >
                {sortedParcels.map((parcel, index) => (
                    <tr key={parcel._id} className="hover:bg-slate-50 transition-colors">
                        <TNum n={((currentPage - 1) * limit + index + 1)} />
                        <TCell>
                            <span className="font-semibold text-slate-700">{parcel.parcelName}</span>
                        </TCell>
                        <TCell>
                            <span className="font-semibold text-slate-800">৳{parcel.cost}</span>
                        </TCell>
                        <TCell>
                            {parcel.paymentStatus === 'paid' ? (
                                <StatusBadge value="paid" />
                            ) : (
                                <button
                                    onClick={() => handlePayment(parcel)}
                                    className="inline-flex items-center gap-1 bg-[#CAEB66] hover:bg-[#b8d45a] text-[#03373D] text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Pay Now
                                </button>
                            )}
                        </TCell>
                        <TCell>
                            <StatusBadge value={parcel.deliveryStatus} />
                        </TCell>
                        <TCell>
                            <div className="flex items-center gap-1">
                                <span className="font-mono text-xs text-slate-500">{parcel.trackingId ? `${parcel.trackingId.slice(0, 12)}...` : '—'}</span>
                                {parcel.trackingId && (
                                    <button
                                        onClick={() => handleCopy(parcel.trackingId, parcel._id)}
                                        className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors"
                                    >
                                        {copiedField === parcel._id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                )}
                            </div>
                        </TCell>
                        <TCell>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setEditParcel(parcel)}
                                    disabled={parcel.paymentStatus === 'paid' || parcel.deliveryStatus === 'delivered'}
                                    title="Edit"
                                    className="p-2 rounded-xl hover:bg-[#CAEB66] text-slate-500 hover:text-[#03373D] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => setReceiptParcel(parcel)}
                                    title="View Receipt"
                                    className="p-2 rounded-xl hover:bg-blue-50 text-slate-500 hover:text-blue-600 transition-all"
                                >
                                    <ReceiptText className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleParcelDelete(parcel._id)}
                                    disabled={parcel.deliveryStatus === 'delivered' || parcel.deliveryStatus === 'driver-assigned'}
                                    title="Delete"
                                    className="p-2 rounded-xl hover:bg-red-50 text-slate-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
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
                            <ChevronLeft className="w-4 h-4" />
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
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            <DashModal
                open={!!receiptParcel}
                onClose={() => setReceiptParcel(null)}
                title="Parcel Receipt"
                subtitle={receiptParcel?.parcelName}
                maxWidth="max-w-sm"
            >
                <div className="space-y-3">
                    {receiptParcel && [
                        { label: 'Parcel Name', value: receiptParcel.parcelName },
                        { label: 'Cost', value: `৳${receiptParcel.cost}` },
                        { label: 'Payment', value: receiptParcel.paymentStatus || 'unpaid' },
                        { label: 'Delivery Status', value: receiptParcel.deliveryStatus },
                        { label: 'Sender Email', value: receiptParcel.senderEmail },
                        { label: 'Receiver Name', value: receiptParcel.receiverName || '—' },
                        { label: 'Receiver Phone', value: receiptParcel.receiverPhone || '—' },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                            <span className="text-sm text-slate-500 font-medium">{label}</span>
                            <span className="text-sm font-semibold text-slate-700 text-right max-w-[200px] break-words">{value}</span>
                        </div>
                    ))}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-slate-500 font-medium">Tracking ID</span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs text-slate-700">{receiptParcel?.trackingId || '—'}</span>
                            {receiptParcel?.trackingId && (
                                <button
                                    onClick={() => handleCopy(receiptParcel.trackingId, 'modal-track')}
                                    className="p-1 rounded hover:bg-slate-100 text-slate-400"
                                >
                                    {copiedField === 'modal-track' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setReceiptParcel(null)}
                    className="mt-4 w-full btn bg-[#03373D] text-white hover:bg-[#03373D]/90 rounded-xl border-none"
                >
                    Close
                </button>
            </DashModal>

            {/* Edit Modal */}
            <DashModal
                open={!!editParcel}
                onClose={() => setEditParcel(null)}
                title="Edit Parcel"
                subtitle="Update parcel or receiver details"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Parcel Name</label>
                        <input name="parcelName" defaultValue={editParcel?.parcelName} className={inputClass} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Receiver Name</label>
                        <input name="receiverName" defaultValue={editParcel?.receiverName} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Receiver Phone</label>
                        <input name="receiverPhone" defaultValue={editParcel?.receiverPhone} className={inputClass} />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setEditParcel(null)} className="flex-1 btn btn-outline rounded-xl text-slate-600 border-slate-300">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 btn bg-[#03373D] text-white hover:bg-[#03373D]/90 rounded-xl border-none">
                            Save Changes
                        </button>
                    </div>
                </form>
            </DashModal>
        </PageWrapper>
    );
};

export default MyParcels;

import React, { useState } from 'react';
import UseAuth from '../../../Hooks/UseAuth';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { MdWorkHistory } from 'react-icons/md';
import { FaTrashAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Swal from 'sweetalert2';
import PageWrapper from '../../../Component/Dashboard/PageWrapper';
import PageHeader from '../../../Component/Dashboard/PageHeader';
import DashTable, { TCell, TNum } from '../../../Component/Dashboard/DashTable';

const PaymentHistory = () => {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;

    const { data: paymentsData = {}, refetch } = useQuery({
        queryKey: ['payments', user.email, currentPage],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}&page=${currentPage}&limit=${limit}&sort=newest`);
            if (Array.isArray(res.data)) {
                return { payments: res.data, total: res.data.length };
            }
            return { payments: res.data.result || res.data.payments || [], total: res.data.total || 0 };
        }
    });

    const payments = paymentsData.payments || [];
    const totalPayments = paymentsData.total || payments.length;
    const totalPages = Math.ceil(totalPayments / limit);

    // Sort newest first on client-side
    const sortedPayments = [...payments].sort((a, b) => {
        const dateA = new Date(a.paidAt || a.createdAt || a._id);
        const dateB = new Date(b.paidAt || b.createdAt || b._id);
        const timeA = dateA.getTime() || (a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
        const timeB = dateB.getTime() || (b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
        return timeB - timeA;
    });

    // Get all payments for stats
    const { data: allPayments = [] } = useQuery({
        queryKey: ['all-payments-stats', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}&limit=1000`);
            if (Array.isArray(res.data)) return res.data;
            return res.data.result || res.data.payments || res.data || [];
        }
    });

    const totalSpent = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const handleDeleteAll = () => {
        Swal.fire({
            title: 'Clear all history?',
            text: 'This will permanently remove your payment records.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear all',
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/payments?email=${user.email}`).then(res => {
                    if (res.data.deletedCount > 0) {
                        Swal.fire({ title: 'Cleared!', icon: 'success', timer: 1500, showConfirmButton: false });
                        refetch();
                    }
                });
            }
        });
    };

    return (
        <PageWrapper>
            <PageHeader
                icon={<MdWorkHistory />}
                title="Payment History"
                subtitle="All your completed payment transactions"
                badge={allPayments.length}
                action={
                    allPayments.length > 0 && (
                        <button
                            onClick={handleDeleteAll}
                            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-xl transition-colors"
                        >
                            <FaTrashAlt className="w-3.5 h-3.5" />
                            Clear History
                        </button>
                    )
                }
            />

            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800 rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-[#CAEB66]">{allPayments.length}</p>
                    <p className="text-white/60 text-xs font-medium mt-0.5">Total Transactions</p>
                </div>
                <div className="bg-emerald-600 rounded-2xl p-4">
                    <p className="text-2xl font-extrabold text-white">৳{totalSpent.toFixed(0)}</p>
                    <p className="text-white/70 text-xs font-medium mt-0.5">Total Spent</p>
                </div>
                <div className="bg-blue-600 rounded-2xl p-4 col-span-2 md:col-span-1">
                    <p className="text-2xl font-extrabold text-white">
                        {allPayments.length > 0 ? `৳${(totalSpent / allPayments.length).toFixed(0)}` : '৳0'}
                    </p>
                    <p className="text-white/70 text-xs font-medium mt-0.5">Avg. per Parcel</p>
                </div>
            </div>

            <DashTable
                columns={['#', 'Parcel', 'Amount', 'Transaction ID', 'Paid At']}
                empty="No payment history yet."
                emptyIcon={<MdWorkHistory />}
            >
                {sortedPayments.map((payment, index) => (
                    <tr key={payment._id} className="hover:bg-slate-50 transition-colors">
                        <TNum n={((currentPage - 1) * limit + index + 1)} />
                        <TCell>
                            <span className="font-semibold text-slate-700">{payment.parcelName}</span>
                        </TCell>
                        <TCell>
                            <span className="inline-flex items-center bg-emerald-50 text-emerald-700 font-bold text-sm px-3 py-1 rounded-full border border-emerald-200">
                                ৳{payment.amount}
                            </span>
                        </TCell>
                        <TCell>
                            <span className="font-mono text-xs text-slate-500 block max-w-[180px] truncate">
                                {payment.transactionId}
                            </span>
                        </TCell>
                        <TCell>
                            <span className="text-slate-500 text-xs">
                                {new Date(payment.paidAt).toLocaleString('en-US', {
                                    year: 'numeric', month: 'short', day: '2-digit',
                                    hour: '2-digit', minute: '2-digit', hour12: true
                                })}
                            </span>
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
        </PageWrapper>
    );
};

export default PaymentHistory;

import React from 'react';

const presets = {
    // Delivery statuses
    'delivered':        'bg-emerald-100 text-emerald-700 border-emerald-200',
    'driver-assigned':  'bg-blue-100 text-blue-700 border-blue-200',
    'pending-pickup':   'bg-amber-100 text-amber-700 border-amber-200',
    'delivery-failed':  'bg-red-100 text-red-700 border-red-200',
    // Payment
    'paid':             'bg-emerald-100 text-emerald-700 border-emerald-200',
    'unpaid':           'bg-slate-100 text-slate-500 border-slate-200',
    // Rider status
    'approved':         'bg-emerald-100 text-emerald-700 border-emerald-200',
    'pending':          'bg-amber-100 text-amber-700 border-amber-200',
    'rejected':         'bg-red-100 text-red-700 border-red-200',
    // Work status
    'available':        'bg-emerald-100 text-emerald-700 border-emerald-200',
    'in_delivery':      'bg-blue-100 text-blue-700 border-blue-200',
    'un-available':     'bg-slate-100 text-slate-500 border-slate-200',
    // Role
    'admin':            'bg-violet-100 text-violet-700 border-violet-200',
    'rider':            'bg-blue-100 text-blue-700 border-blue-200',
    'user':             'bg-slate-100 text-slate-500 border-slate-200',
};

const StatusBadge = ({ value }) => {
    const key = (value || '').toLowerCase();
    const cls = presets[key] || 'bg-slate-100 text-slate-500 border-slate-200';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${cls}`}>
            {value || '—'}
        </span>
    );
};

export default StatusBadge;

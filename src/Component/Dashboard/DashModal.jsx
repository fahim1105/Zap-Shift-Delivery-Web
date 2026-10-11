import React from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Reusable dashboard modal.
 * Props:
 *  - open: bool
 *  - onClose: fn
 *  - title: string
 *  - subtitle: string (optional)
 *  - maxWidth: string (e.g. 'max-w-md', default 'max-w-lg')
 *  - children: ReactNode
 */
const DashModal = ({ open, onClose, title, subtitle, maxWidth = 'max-w-lg', children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Panel */}
            <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-800">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 ml-4"
                    >
                        <FaTimes className="w-3.5 h-3.5" />
                    </button>
                </div>
                {/* Body */}
                <div className="overflow-y-auto flex-1 p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashModal;

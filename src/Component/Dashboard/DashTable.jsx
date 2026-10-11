import React from 'react';

/**
 * Reusable dashboard table wrapper.
 *
 * Props:
 *  - columns: string[]        table headers
 *  - children: ReactNode      <tr> rows
 *  - empty: string            message when no rows
 *  - emptyIcon: ReactNode     icon shown in empty state
 */
const DashTable = ({ columns = [], children, empty = 'No records found.', emptyIcon }) => {
    const isEmpty = !children || (Array.isArray(children) && children.filter(Boolean).length === 0);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isEmpty ? (
                            <tr>
                                <td colSpan={columns.length} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        {emptyIcon && (
                                            <span className="text-4xl opacity-30">{emptyIcon}</span>
                                        )}
                                        <p className="font-medium">{empty}</p>
                                    </div>
                                </td>
                            </tr>
                        ) : children}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const TCell = ({ children, className = '' }) => (
    <td className={`px-5 py-3.5 text-slate-600 ${className}`}>{children}</td>
);

export const TNum = ({ n }) => (
    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
        {String(n).padStart(2, '0')}
    </td>
);

export default DashTable;

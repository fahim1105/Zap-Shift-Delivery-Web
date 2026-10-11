import React from 'react';

/**
 * Reusable page header for every dashboard route.
 *
 * Props:
 *  - icon: ReactNode (icon element)
 *  - title: string
 *  - subtitle: string
 *  - badge: string | number  (optional, shown as pill)
 *  - action: ReactNode       (optional CTA button on the right)
 */
const PageHeader = ({ icon, title, subtitle, badge, action }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                {/* Icon box */}
                {icon && (
                    <div className="w-11 h-11 rounded-xl bg-[#03373D] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-[#CAEB66] text-xl">{icon}</span>
                    </div>
                )}
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-extrabold text-slate-800">{title}</h1>
                        {badge !== undefined && badge !== null && (
                            <span className="inline-flex items-center justify-center bg-[#CAEB66] text-[#03373D] text-xs font-bold px-2.5 py-0.5 rounded-full min-w-[24px]">
                                {badge}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && (
                <div className="flex-shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
};

export default PageHeader;

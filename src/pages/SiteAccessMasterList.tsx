import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import MasterPage from '../components/MasterPage';

const SiteAccessMasterList: React.FC = () => {
    const [data] = useState<any[]>([]);
    const [loading] = useState(false);

    const columns = [
        {
            header: 'Access Node',
            key: 'siteName',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
                        <Clock size={18} />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.siteID}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Temporal Window',
            key: 'accessTimeFrom',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-3 text-slate-600">
                    <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black tracking-widest">{val}</div>
                    <div className="h-px w-3 bg-slate-300" />
                    <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black tracking-widest">{row.accessTimeTo}</div>
                </div>
            )
        },
        {
            header: 'Active Schedule',
            key: 'availableDays',
            render: (val: any) => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                return (
                    <div className="flex gap-1">
                        {days.map(d => (
                            <div
                                key={d}
                                className={`w-6 h-6 rounded flex items-center justify-center text-[8px] font-black uppercase transition-all shadow-sm ${val && val[d] ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-300'}`}
                                title={d}
                            >
                                {d[0]}
                            </div>
                        ))}
                    </div>
                );
            }
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${val ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {val ? 'Enforced' : 'Suspended'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Site Access Master"
            subtitle="Configure operational windows and enforce temporal constraints on site entry"
            data={data}
            columns={columns as any}
            onAdd={() => { }}
            onEdit={() => { }}
            loading={loading}
        />
    );
};

export default SiteAccessMasterList;

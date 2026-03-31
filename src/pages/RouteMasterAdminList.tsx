import React, { useState } from 'react';
import { Route as RouteIcon, Smartphone, User } from 'lucide-react';
import MasterPage from '../components/MasterPage';

const RouteMasterAdminList: React.FC = () => {
    const [data] = useState<any[]>([]);
    const [loading] = useState(false);

    const columns = [
        {
            header: 'Route Key',
            key: 'routeKey',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/20" />
                        <RouteIcon size={18} />
                    </div>
                    <div className="font-mono font-black text-slate-900 tracking-[0.1em] text-sm uppercase">{val || 'VOID-KEY'}</div>
                </div>
            )
        },
        {
            header: 'Hardware Anchor',
            key: 'touchKeyId',
            render: (val: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded self-start">
                        {val || 'UNMAPPED'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Touch Key Signature</div>
                </div>
            )
        },
        {
            header: 'Custodian Link',
            key: 'custodianId',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-tight">
                        <User size={12} className="text-slate-400" />
                        {val}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest italic">
                        <Smartphone size={10} />
                        {row.mobileNumber || 'No Phone Registered'}
                    </div>
                </div>
            )
        },
        {
            header: 'Geo Zone',
            key: 'district',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{val}</div>
                    <div className="text-[9px] font-bold text-slate-400 tracking-widest">{row.state} | {row.franchise}</div>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Route Hub Admin"
            subtitle="Centralized governance for logistical keys and multi-tier field asset orchestration"
            data={data}
            columns={columns as any}
            onAdd={() => { }}
            onEdit={() => { }}
            loading={loading}
        />
    );
};

export default RouteMasterAdminList;

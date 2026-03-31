import React, { useState } from 'react';
import { Network } from 'lucide-react';
import MasterPage from '../components/MasterPage';

// Simulated data as we didn't add service methods for OneLine yet
const OneLineMasterList: React.FC = () => {
    const [data] = useState<any[]>([]);
    const [loading] = useState(false);

    const columns = [
        {
            header: 'Network Identity',
            key: 'name',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100 shadow-sm">
                        <Network size={18} />
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                </div>
            )
        },
        {
            header: 'Operational Scope',
            key: 'description',
            render: (val: any) => <span className="text-xs font-bold text-slate-500 line-clamp-1">{val}</span>
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${val ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {val ? 'Active' : 'Offline'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="One Line Master"
            subtitle="Regulate unified communication trunks and administrative network mappings"
            data={data}
            columns={columns as any}
            onAdd={() => { }}
            onEdit={() => { }}
            loading={loading}
        />
    );
};

export default OneLineMasterList;

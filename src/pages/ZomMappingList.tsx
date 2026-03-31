import React, { useState, useEffect } from 'react';
import { Layers, ShieldCheck, Mail } from 'lucide-react';
import MasterPage from '../components/MasterPage';
import { adminMasterService } from '../services/adminMasterService';

const ZomMappingList: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await adminMasterService.getZomMappings();
            setData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Zone Identity',
            key: 'username',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm self-start">
                        <Layers size={18} />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-black text-slate-900 tracking-tight text-sm uppercase">{val}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.fullName}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Zone Node Code',
            key: 'zomCode',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                        <ShieldCheck size={12} />
                    </div>
                    <span className="font-mono text-xs font-black text-slate-700 tracking-wider">
                        {val}
                    </span>
                </div>
            )
        },
        {
            header: 'Channel Integrity',
            key: 'zomEmail',
            render: (val: any) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <Mail size={12} className="shrink-0" />
                    <span className="text-[11px] font-bold tracking-tight lowercase truncate max-w-[150px]">{val}</span>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="ZOM Mappings"
            subtitle="Regulate Zone Operator identities and map them to regional governance nodes"
            data={data}
            columns={columns as any}
            onAdd={() => { }}
            loading={loading}
        />
    );
};

export default ZomMappingList;

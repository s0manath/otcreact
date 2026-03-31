import React, { useState, useEffect } from 'react';
import { Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import { adminMasterService, type KeyInventoryMaster } from '../services/adminMasterService';

const KeyInventoryList: React.FC = () => {
    const navigate = useNavigate();
    const [keys, setKeys] = useState<KeyInventoryMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            setLoading(true);
            const data = await adminMasterService.getKeys();
            setKeys(data);
        } catch (error) {
            console.error('Error fetching keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Physical Token',
            key: 'keySerialNumber',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[0.9rem] bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <Key size={20} className="relative z-10" />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-black text-slate-900 tracking-tight text-sm uppercase">{val}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.keyMake} {row.keyModel}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Assigned Endpoint',
            key: 'atmid',
            render: (val: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-[11px] font-black text-slate-800 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded inline-flex self-start">
                        {val || 'Unassigned'}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">Terminal Identity</div>
                </div>
            )
        },
        {
            header: 'Type',
            key: 'keyType',
            render: (val: any) => (
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b-2 border-slate-100 pb-0.5">
                    {val}
                </span>
            )
        },
        {
            header: 'Integrity',
            key: 'isActive',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${val ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {val ? 'Operational' : 'Compromised'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Key Inventory"
            subtitle="Regulate physical access tokens and track their hardware lifecycle"
            data={keys}
            columns={columns as any}
            onAdd={() => navigate('/masters/keys/new')}
            onEdit={(row) => navigate(`/masters/keys/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default KeyInventoryList;

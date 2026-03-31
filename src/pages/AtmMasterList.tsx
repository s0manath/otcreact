import React, { useState, useEffect } from 'react';
import {
    Monitor,
    Building,
    MapPin,
    Activity,
    Server,
    Database,
    Calendar,
    Upload,
    Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type AtmMaster } from '../services/masterService';

const AtmMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [atms, setAtms] = useState<AtmMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAtms();
    }, []);

    const fetchAtms = async () => {
        try {
            setLoading(true);
            const data = await masterService.getAtms();
            setAtms(data);
        } catch (error) {
            console.error('Error fetching ATMs:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Terminal Identity',
            key: 'atmId',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                        <Monitor size={18} />
                    </div>
                    <div>
                        <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Building size={10} />
                            {row.bank}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Location Context',
            key: 'site',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                        <MapPin size={12} className="text-blue-400" />
                        {val}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Activity size={12} className="text-slate-300" />
                        {row.city}, {row.state}
                    </div>
                </div>
            )
        },
        {
            header: 'Infrastructure',
            key: 'franchise',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Server size={12} className="text-slate-400" />
                        {val}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Database size={12} className="text-slate-300" />
                        {row.atmType || 'Standard'}
                    </div>
                </div>
            )
        },
        {
            header: 'Operational State',
            key: 'atmStatus',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${val?.toLowerCase() === 'in service' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${val?.toLowerCase() === 'in service' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {val || 'Unknown'}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar size={10} />
                        {row.installDate || 'No Date'}
                    </div>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="ATM / Terminal Master"
            subtitle="Centralized inventory for terminal configuration and health."
            data={atms}
            columns={columns as any}
            onAdd={() => navigate('/masters/atms/new')}
            onEdit={(row) => navigate(`/masters/atms/edit/${row.atmId}`)}
            loading={loading}
            extraActions={
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/masters/atms/route-key')}
                        className="px-6 py-4 bg-white border border-slate-200 text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center gap-3"
                    >
                        <Key size={16} />
                        Sync Route Keys
                    </button>
                    <button
                        onClick={() => navigate('/masters/atms/bulk')}
                        className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3"
                    >
                        <Upload size={16} />
                        Bulk Upload
                    </button>
                </div>
            }
        />
    );
};

export default AtmMasterList;

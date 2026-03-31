import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import { adminMasterService, type RegionMaster } from '../services/adminMasterService';

const RegionMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [regions, setRegions] = useState<RegionMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegions();
    }, []);

    const fetchRegions = async () => {
        try {
            setLoading(true);
            const data = await adminMasterService.getRegions();
            setRegions(data);
        } catch (error) {
            console.error('Error fetching regions:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Region Node',
            key: 'regionName',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <Globe size={18} />
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                </div>
            )
        },
        {
            header: 'Governance Code',
            key: 'regionCode',
            render: (val: any) => (
                <div className="font-mono font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[10px] tracking-wider">
                    {val}
                </div>
            )
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${val ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {val ? 'Operational' : 'Restricted'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Region Master"
            subtitle="Define primary operational regions for multi-tier governance"
            data={regions}
            columns={columns as any}
            onAdd={() => navigate('/masters/regions/new')}
            onEdit={(row) => navigate(`/masters/regions/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default RegionMasterList;

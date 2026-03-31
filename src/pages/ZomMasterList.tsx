import React, { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type ZomMaster } from '../services/masterService';

const ZomMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [zoms, setZoms] = useState<ZomMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchZoms();
    }, []);

    const fetchZoms = async () => {
        try {
            setLoading(true);
            const data = await masterService.getZomsList({});
            setZoms(data);
        } catch (error) {
            console.error('Error fetching ZOMs:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'ZOM Node',
            key: 'zomName',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100 shadow-sm">
                        <Layers size={18} />
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                </div>
            )
        },
        {
            header: 'Hierarchy Context',
            key: 'regionName',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Region: {val || 'Global'}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location: {row.locationName || 'Unmapped'}</div>
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
            title="ZOM Master"
            subtitle="Establish Zone Operation nodes and map them to regions and locations"
            data={zoms}
            columns={columns as any}
            onAdd={() => navigate('/masters/zoms/new')}
            onEdit={(row) => navigate(`/masters/zoms/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default ZomMasterList;

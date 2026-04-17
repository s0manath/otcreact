import React, { useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type StateMaster } from '../services/masterService';

const StateMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [states, setStates] = useState<StateMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchStates = async () => {
        try {
            setLoading(true);
            const data = await masterService.getStatesAll();
            setStates(data);
        } catch (error) {
            console.error('Error fetching states:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'State Name',
            key: 'stateName',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
                        <Map size={18} />
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                </div>
            )
        },
        {
            header: 'Region Node',
            key: 'regionName',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                        {val || 'Unassigned'}
                    </span>
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
            title="State Master"
            subtitle="Configure secondary regional tiers and assign them to primary regions"
            data={states}
            columns={columns as any}
            onAdd={() => navigate('/masters/states/new')}
            onEdit={(row) => navigate(`/masters/states/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default StateMasterList;

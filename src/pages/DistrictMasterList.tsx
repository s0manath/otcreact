import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type DistrictMaster } from '../services/masterService';

const DistrictMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [districts, setDistricts] = useState<DistrictMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDistricts();
    }, []);

    const fetchDistricts = async () => {
        try {
            setLoading(true);
            const data = await masterService.getDistrictsList({});
            setDistricts(data);
        } catch (error) {
            console.error('Error fetching districts:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'District Name',
            key: 'districtName',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-sm">
                        <MapPin size={18} />
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                </div>
            )
        },
        {
            header: 'State Parent',
            key: 'stateName',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                        {val || 'National'}
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
            title="District Master"
            subtitle="Manage localized territories and link them to their respective states"
            data={districts}
            columns={columns as any}
            onAdd={() => navigate('/masters/districts/new')}
            onEdit={(row) => navigate(`/masters/districts/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default DistrictMasterList;

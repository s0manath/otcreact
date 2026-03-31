import React, { useState, useEffect } from 'react';
import {
    Building2,
    Phone,
    MapPin,
    Hash,
    Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type FranchiseMaster } from '../services/masterService';

const FranchiseMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [franchises, setFranchises] = useState<FranchiseMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFranchises();
    }, []);

    const fetchFranchises = async () => {
        try {
            setLoading(true);
            const data = await masterService.getFranchises({});
            setFranchises(data);
        } catch (error) {
            console.error('Error fetching franchises:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Franchise Identity',
            key: 'franchiseName',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                        <Building2 size={18} />
                    </div>
                    <div>
                        <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master ID: {row.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Compliance & ID',
            key: 'sapCode',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-600">
                        <Hash size={12} />
                        {val}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Phone size={12} className="text-slate-400" />
                        {row.mobileNumber}
                    </div>
                </div>
            )
        },
        {
            header: 'Jurisdiction',
            key: 'stateName',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-xs font-black text-slate-800">{val}</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MapPin size={10} className="text-indigo-400" />
                        {row.districtName}
                    </div>
                </div>
            )
        },
        {
            header: 'Operational Status',
            key: 'isActive',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${val ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {val ? 'Enabled' : 'Deactivated'}
                        </span>
                    </div>
                    {row.secondaryCustodianRequire && (
                        <div className="flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 w-max uppercase tracking-tighter">
                            <Users size={10} />
                            Dual-Auth
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Franchise Master"
            subtitle="Configure regional franchises and node associations."
            data={franchises}
            columns={columns as any}
            onAdd={() => navigate('/masters/franchises/new')}
            onEdit={(row) => navigate(`/masters/franchises/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default FranchiseMasterList;

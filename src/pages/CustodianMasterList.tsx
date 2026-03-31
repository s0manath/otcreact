import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type CustodianMaster } from '../services/masterService';

const CustodianMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [custodians, setCustodians] = useState<CustodianMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustodians();
    }, []);

    const fetchCustodians = async () => {
        try {
            setLoading(true);
            const data = await masterService.getCustodians({});
            setCustodians(data);
        } catch (error) {
            console.error('Error fetching custodians:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Custodian',
            key: 'custodianName',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 shadow-sm">
                        <User size={18} />
                    </div>
                    <div>
                        <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.custodianCode}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Info',
            key: 'emailId',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        {val}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Phone size={12} className="text-slate-400" />
                        {row.mobileNumber}
                    </div>
                </div>
            )
        },
        {
            header: 'Territory',
            key: 'franchiseName',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-xs font-black text-slate-800">{val}</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MapPin size={10} />
                        {row.zomName}
                    </div>
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
            title="Custodian Master"
            subtitle="Manage field custodians and their operational access rights"
            data={custodians}
            columns={columns as any}
            onAdd={() => navigate('/masters/custodians/new')}
            onEdit={(row) => navigate(`/masters/custodians/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default CustodianMasterList;

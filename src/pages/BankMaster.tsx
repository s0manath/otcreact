import React from 'react';
import MasterPage from '../components/MasterPage';
import {
    Building2
} from 'lucide-react';

const BankMaster: React.FC = () => {
    const bankData = [
        { id: 1, name: 'Bank of OTC', code: 'BOTC', status: 'Active', updated: '2026-02-23' },
        { id: 2, name: 'National ATM Bank', code: 'NATM', status: 'Active', updated: '2026-02-22' },
        { id: 3, name: 'Reserve Finance Corp', code: 'RFC', status: 'Inactive', updated: '2026-02-20' },
        { id: 4, name: 'Global Asset Bank', code: 'GAB', status: 'Active', updated: '2026-02-19' },
        { id: 5, name: 'Union Data Services', code: 'UDS', status: 'Active', updated: '2026-02-18' },
    ];

    const columns = [
        { header: 'ID', key: 'id', render: (val: any) => <span className="font-black text-slate-400">#{val}</span> },
        {
            header: 'Bank Name',
            key: 'name',
            render: (val: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                        <Building2 size={16} />
                    </div>
                    <span className="font-bold text-slate-800">{val}</span>
                </div>
            )
        },
        { header: 'Swift Code', key: 'code', render: (val: any) => <code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">{val}</code> },
        {
            header: 'Status',
            key: 'status',
            render: (val: any) => (
                <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${val === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {val}
                </span>
            )
        },
        { header: 'Last Updated', key: 'updated' },
    ];

    return (
        <MasterPage
            title="Bank Master"
            subtitle="Manage affiliated banking institutions and Swift codes."
            data={bankData}
            columns={columns}
            onAdd={() => alert('Add New Bank Modal')}
        />
    );
};

export default BankMaster;

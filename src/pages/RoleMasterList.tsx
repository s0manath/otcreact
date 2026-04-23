import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import masterService, { type RoleMaster } from '../services/masterService';

const RoleMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<RoleMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await masterService.getRoles();
            setRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Role Name',
            key: 'roleName',
            render: (_: any, row: any) => {
                const val = row.roleName || row.RoleName;
                const desc = row.roleDescription || row.RoleDescription;
                return (
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
                            <Shield size={18} />
                        </div>
                        <div>
                            <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                                {desc || 'System Role'}
                            </div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Description',
            key: 'roleDescription',
            render: (_: any, row: any) => (
                <span className="text-xs font-medium text-slate-500 line-clamp-1">
                    {row.roleDescription || row.RoleDescription || 'System Role'}
                </span>
            )
        },
        {
            header: 'System Status',
            key: 'roleStatus',
            render: (_: any, row: any) => {
                const val = row.roleStatus ?? row.RoleStatus;
                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${val === 1 ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.4)]'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${val === 1 ? 'text-indigo-600' : 'text-slate-500'}`}>
                            {val === 1 ? 'Active' : 'Disabled'}
                        </span>
                    </div>
                );
            }
        }
    ];

    return (
        <MasterPage
            title="Role Master"
            subtitle="Define system roles and granular module-level privilege matrices"
            data={roles}
            columns={columns as any}
            onAdd={() => navigate('/masters/roles/new')}
            onEdit={(row) => navigate(`/masters/roles/edit/${row.slNo || row.SlNo}`)}
            loading={loading}
        />
    );
};

export default RoleMasterList;

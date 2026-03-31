import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Shield,
    Lock,
    Activity,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import masterService, { type RoleMaster, type ModuleAccess } from '../services/masterService';

const RoleMasterForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;

    const [form, setForm] = useState<RoleMaster>({
        slNo: 0,
        roleName: '',
        roleDescription: '',
        roleStatus: 1,
        privileges: [],
        reportPrivileges: []
    });

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [matrixSearch, setMatrixSearch] = useState('');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const moduleList = await masterService.getModuleList();

            if (isEdit) {
                const data = await masterService.getRole(parseInt(id!));
                setForm(data);
            } else {
                // Initialize privileges with default false for all modules
                const initialPrivileges = moduleList.map(m => ({
                    moduleName: m,
                    add: false,
                    edit: false,
                    view: false,
                    delete: false
                }));
                setForm(prev => ({ ...prev, privileges: initialPrivileges }));
            }
        } catch (error) {
            console.error('Error loading role data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = (moduleName: string, field: keyof Omit<ModuleAccess, 'moduleName'>) => {
        setForm(prev => {
            const updatedPrivileges = prev.privileges.map(p => {
                if (p.moduleName === moduleName) {
                    return { ...p, [field]: !p[field] };
                }
                return p;
            });
            return { ...prev, privileges: updatedPrivileges };
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await masterService.saveRole(form);
            navigate('/masters/roles');
        } catch (error) {
            console.error('Error saving role:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Privilege Matrix...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10"
                    >
                        <button
                            onClick={() => navigate('/masters/roles')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-indigo-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-600">Back to Hierarchy</span>
                        </button>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            {isEdit ? 'Refine' : 'Architect'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Access Protocols.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-lg max-w-xl">
                            {isEdit ? `Modifying module-level rights for: ${form.roleName}` : 'Establish a new administrative tier with granular functional restrictions.'}
                        </p>
                    </motion.div>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    {/* Left: Role Configuration */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                    <Shield size={20} />
                                </div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Role Identity</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="roleName">Unique Role Name</label>
                                    <input
                                        id="roleName"
                                        type="text"
                                        required
                                        value={form.roleName}
                                        onChange={e => setForm({ ...form, roleName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                                        placeholder="e.g. Regional Supervisor"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1" htmlFor="roleDesc">Operational Summary</label>
                                    <textarea
                                        id="roleDesc"
                                        rows={4}
                                        value={form.roleDescription}
                                        onChange={e => setForm({ ...form, roleDescription: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all resize-none"
                                        placeholder="Describe the scope of access..."
                                    />
                                </div>

                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-3 block">Deployment Status</label>
                                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, roleStatus: 1 })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.roleStatus === 1 ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Operational
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setForm({ ...form, roleStatus: 0 })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.roleStatus === 0 ? 'bg-white shadow-sm text-rose-600' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            Restricted
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <button
                            type="submit"
                            disabled={saveLoading}
                            className="w-full py-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10">{saveLoading ? 'Propagating...' : 'Finalize Protocol'}</span>
                            <Save size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </button>
                    </div>

                    {/* Right: Privilege Matrix */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-[700px]"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
                                        <Lock size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Privilege Matrix</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-Module Permission Mapping</p>
                                    </div>
                                </div>

                                <div className="relative flex-1 max-w-xs">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                                        <Search size={14} />
                                    </div>
                                    <input
                                        type="text"
                                        value={matrixSearch}
                                        onChange={e => setMatrixSearch(e.target.value)}
                                        placeholder="Filter Modules..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                                <table className="w-full border-separate border-spacing-y-3">
                                    <thead className="sticky top-0 bg-white z-20">
                                        <tr>
                                            <th className="text-left py-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Module</th>
                                            <th className="text-center py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Execute (Add)</th>
                                            <th className="text-center py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modify (Edit)</th>
                                            <th className="text-center py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Observe (View)</th>
                                            <th className="text-center py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Purge (Delete)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.privileges
                                            .filter(p => p.moduleName.toLowerCase().includes(matrixSearch.toLowerCase()))
                                            .map((p, idx) => (
                                                <motion.tr
                                                    key={p.moduleName}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className="group"
                                                >
                                                    <td className="py-4 px-4 bg-slate-50/50 rounded-l-2xl border-l border-y border-slate-100 group-hover:bg-indigo-50/30 transition-colors">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{p.moduleName}</span>
                                                    </td>
                                                    <PermissionToggle checked={p.add} onChange={() => handleToggle(p.moduleName, 'add')} />
                                                    <PermissionToggle checked={p.edit} onChange={() => handleToggle(p.moduleName, 'edit')} />
                                                    <PermissionToggle checked={p.view} onChange={() => handleToggle(p.moduleName, 'view')} />
                                                    <PermissionToggle checked={p.delete} onChange={() => handleToggle(p.moduleName, 'delete')} isDelete />
                                                </motion.tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={12} />
                                    Security check: Granular controls active
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PermissionToggle: React.FC<{ checked: boolean; onChange: () => void; isDelete?: boolean }> = ({ checked, onChange, isDelete }) => (
    <td className={`py-4 px-2 text-center bg-slate-50/50 border-y border-slate-100 group-hover:bg-indigo-50/30 transition-colors ${isDelete ? 'rounded-r-2xl border-r' : ''}`}>
        <button
            type="button"
            onClick={onChange}
            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${checked ? (isDelete ? 'bg-rose-500' : 'bg-indigo-600') : 'bg-slate-200'}`}
        >
            <motion.div
                animate={{ x: checked ? 24 : 4 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
            >
                {checked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`w-1.5 h-1.5 rounded-full ${isDelete ? 'bg-rose-600' : 'bg-indigo-600'}`}
                    />
                )}
            </motion.div>
        </button>
    </td>
);

export default RoleMasterForm;

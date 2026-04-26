import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    User,
    Mail,
    Lock,
    ChevronRight,
    Save,
    X,
    CheckCircle2,
    Globe,
    Map,
    Search
} from 'lucide-react';
import { loginMasterService, type HierarchyItem } from '../services/loginMasterService';
import { motion, AnimatePresence } from 'framer-motion';

const LoginMasterForm: React.FC = () => {
    const navigate = useNavigate();
    const { username } = useParams();
    const isEdit = !!username;

    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'User',
        role: 'Standard',
        selectedRegions: [] as string[],
        selectedStates: [] as string[],
        selectedDistricts: [] as string[],
        selectedFranchises: [] as string[]
    });

    const [hierarchy, setHierarchy] = useState({
        regions: [] as HierarchyItem[],
        states: [] as HierarchyItem[],
        districts: [] as HierarchyItem[],
        franchises: [] as HierarchyItem[]
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [scopeSearch, setScopeSearch] = useState('');

    useEffect(() => {
        fetchInitialData();
        if (isEdit) {
            fetchUserDetails();
        }
    }, [isEdit]);

    const fetchInitialData = async () => {
        try {
            const data = await loginMasterService.getHierarchy('region');
            setHierarchy(prev => ({ ...prev, regions: data }));
        } catch (error) {
            console.error('Error fetching initial hierarchy:', error);
        }
    };

    const fetchUserDetails = async () => {
        try {
            const data = await loginMasterService.getLoginById(username!);
            setFormData(prev => ({ ...prev, ...data, confirmPassword: data?.password || '' }));
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleHierarchyChange = async (type: string, selectedIds: string[]) => {
        const newFormData = { ...formData };

        if (type === 'region') {
            newFormData.selectedRegions = selectedIds;
            newFormData.selectedStates = [];
            newFormData.selectedDistricts = [];
            newFormData.selectedFranchises = [];

            if (selectedIds.length > 0) {
                const data = await loginMasterService.getHierarchy('state', selectedIds.join(','));
                setHierarchy(prev => ({ ...prev, states: data, districts: [], franchises: [] }));
            } else {
                setHierarchy(prev => ({ ...prev, states: [], districts: [], franchises: [] }));
            }
        } else if (type === 'state') {
            newFormData.selectedStates = selectedIds;
            newFormData.selectedDistricts = [];
            newFormData.selectedFranchises = [];

            if (selectedIds.length > 0) {
                const data = await loginMasterService.getHierarchy('district', selectedIds.join(','));
                setHierarchy(prev => ({ ...prev, districts: data, franchises: [] }));
            } else {
                setHierarchy(prev => ({ ...prev, districts: [], franchises: [] }));
            }
        } else if (type === 'district') {
            newFormData.selectedDistricts = selectedIds;
            newFormData.selectedFranchises = [];

            if (selectedIds.length > 0) {
                const data = await loginMasterService.getHierarchy('franchise', selectedIds.join(','));
                setHierarchy(prev => ({ ...prev, franchises: data }));
            } else {
                setHierarchy(prev => ({ ...prev, franchises: [] }));
            }
        } else if (type === 'franchise') {
            newFormData.selectedFranchises = selectedIds;
        }

        setFormData(newFormData);
    };

    const toggleSelection = (type: string, id: string) => {
        let current: string[] = [];
        if (type === 'region') current = formData.selectedRegions;
        else if (type === 'state') current = formData.selectedStates;
        else if (type === 'district') current = formData.selectedDistricts;
        else if (type === 'franchise') current = formData.selectedFranchises;

        const updated = current.includes(id)
            ? current.filter(item => item !== id)
            : [...current, id];

        handleHierarchyChange(type, updated);
    };

    const selectAll = (type: string) => {
        let items: HierarchyItem[] = [];
        if (type === 'region') items = hierarchy.regions;
        else if (type === 'state') items = hierarchy.states;
        else if (type === 'district') items = hierarchy.districts;
        else if (type === 'franchise') items = hierarchy.franchises;

        handleHierarchyChange(type, items.map(i => i.id));
    };

    const clearAll = (type: string) => {
        handleHierarchyChange(type, []);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        setLoading(true);
        try {
            await loginMasterService.saveLogin(formData);
            setMessage({ type: 'success', text: `User ${isEdit ? 'updated' : 'created'} successfully!` });
            setTimeout(() => navigate('/login-master'), 2000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save user data.' });
        } finally {
            setLoading(false);
        }
    };

    const ListBox = ({ title, type, items, selected, fullWidth = false }: { title: string, type: string, items: HierarchyItem[], selected: string[], fullWidth?: boolean }) => {
        const filteredItems = items.filter(item => item.name.toLowerCase().includes(scopeSearch.toLowerCase()));
        
        return (
        <div className={`flex flex-col h-full ${fullWidth ? 'col-span-full' : ''}`}>
            <div className="flex items-center justify-between mb-4 px-3">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{title}</label>
                </div>
                <div className="flex gap-4">
                    <button type="button" onClick={() => selectAll(type)} className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors">Select All</button>
                    <button type="button" onClick={() => clearAll(type)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Clear All</button>
                </div>
            </div>
            <div className={`flex-1 bg-white/50 border border-slate-200 rounded-[2rem] overflow-hidden flex flex-col shadow-sm group focus-within:ring-8 focus-within:ring-primary-500/5 focus-within:border-primary-400/50 transition-all ${fullWidth ? 'min-h-[220px]' : 'min-h-[280px]'}`}>
                <div className="overflow-y-auto custom-scrollbar p-4 space-y-2">
                    {filteredItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-3">
                                <Map size={24} />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">
                                Awaiting Node Link...
                            </span>
                        </div>
                    ) : (
                        <div className={`grid ${fullWidth ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3' : 'grid-cols-1 gap-2'}`}>
                            {filteredItems.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => toggleSelection(type, item.id)}
                                    className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between group/item border ${selected.includes(item.id)
                                        ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20 border-primary-400'
                                        : 'bg-white text-slate-600 border-slate-100 hover:border-primary-200 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className="truncate pr-2">{item.name}</span>
                                    {selected.includes(item.id) ? (
                                        <CheckCircle2 size={14} className="shrink-0" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-lg border-2 border-slate-100 group-hover/item:border-primary-200 shrink-0"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] p-8 lg:p-12 font-sans selection:bg-primary-500/30">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full"></div>
                    <div className="absolute -top-24 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 bg-white/80 backdrop-blur-md border border-white/20 rounded-full shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Secure Access Protocol</span>
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            {isEdit ? 'Refine' : 'Initialize'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Configuration.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-lg max-w-xl">
                            {isEdit ? `Synchronizing security credentials for entity: ${username}` : 'Establish a new high-security identity within the central node architecture.'}
                        </p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login-master')}
                        className="px-6 py-4 bg-white/80 backdrop-blur-md border border-white/50 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-xl shadow-slate-200/50 flex items-center gap-3 z-10 group"
                    >
                        <span className="text-xs font-black uppercase tracking-widest group-hover:block hidden">Discard</span>
                        <X size={24} />
                    </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Left Panel: Identity Context */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="xl:col-span-4 space-y-8"
                    >
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white/80 shadow-2xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700"></div>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                                    <User size={24} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Master Identity</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 01 / Primary Data</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Universal Identifier</label>
                                    <div className="group/input relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            disabled={isEdit}
                                            required
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all disabled:opacity-50 placeholder:text-slate-300"
                                            placeholder="UNQUE_ID_001"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all placeholder:text-slate-300"
                                        placeholder="Administrator Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contact Protocol (Email)</label>
                                    <div className="group/input relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all placeholder:text-slate-300"
                                            placeholder="auth@node.local"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Entity Type</label>
                                        <div className="relative">
                                            <select
                                                value={formData.userType}
                                                onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                                className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all appearance-none"
                                            >
                                                <option>Admin</option>
                                                <option>User</option>
                                                <option>Manager</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Permission Level</label>
                                        <div className="relative">
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all appearance-none"
                                            >
                                                <option>Super Admin</option>
                                                <option>Validator</option>
                                                <option>Operator</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                <ChevronRight size={14} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cryptographic Secret</label>
                                        <div className="group/input relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                required={!isEdit}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all placeholder:text-slate-300"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Verification Hash</label>
                                        <input
                                            type="password"
                                            required={!isEdit}
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all placeholder:text-slate-300"
                                            placeholder="••••••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Panel: Hierarchical Clearance */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="xl:col-span-8 space-y-8"
                    >
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] border border-white/80 shadow-2xl shadow-slate-200/40 p-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                                        <Globe size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Territorial Clearance</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 02 / Access Scope</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                                        <Search size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        value={scopeSearch}
                                        onChange={(e) => setScopeSearch(e.target.value)}
                                        className="bg-white/50 border border-slate-200 rounded-2xl py-2 pl-10 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-400 transition-all placeholder:text-slate-300"
                                        placeholder="Search access scope..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-10 flex-1">
                                {/* Top Row: Region, State, District (3-column layout) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <ListBox
                                        title="Region Access"
                                        type="region"
                                        items={hierarchy.regions}
                                        selected={formData.selectedRegions}
                                    />
                                    <ListBox
                                        title="State Territories"
                                        type="state"
                                        items={hierarchy.states}
                                        selected={formData.selectedStates}
                                    />
                                    <ListBox
                                        title="District Nodes"
                                        type="district"
                                        items={hierarchy.districts}
                                        selected={formData.selectedDistricts}
                                    />
                                </div>

                                {/* Bottom Row: Franchise Group (Full Width) */}
                                <div className="border-t border-slate-100 pt-10">
                                    <ListBox
                                        title="Franchise Endpoints"
                                        type="franchise"
                                        items={hierarchy.franchises}
                                        selected={formData.selectedFranchises}
                                        fullWidth
                                    />
                                </div>
                            </div>

                            {/* Action Bar inside form */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <AnimatePresence>
                                    {message.text && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className={`px-6 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-lg ${message.type === 'success'
                                                ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20'
                                                : 'bg-rose-500 border-rose-400 text-white shadow-rose-500/20'
                                                }`}
                                        >
                                            <CheckCircle2 size={16} />
                                            {message.text}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login-master')}
                                        className="flex-1 sm:flex-none px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 sm:flex-none px-12 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                                    >
                                        {loading ? 'Processing...' : (
                                            <>
                                                {isEdit ? 'Commit Updates' : 'Authorize Deployment'}
                                                <Save size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default LoginMasterForm;

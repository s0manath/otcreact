import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Search,
    Filter,
    Plus,
    Edit2,
    Trash2,
    MoreVertical,
    Shield,
    Lock
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const LoginMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [logins, setLogins] = useState<any[]>([]);
    const [searchParams, setSearchParams] = useState({
        field: 'None',
        startWith: '',
        lockedUser: false
    });
    const [loading, setLoading] = useState(false);

    const fetchLogins = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/LoginMaster/search', searchParams);
            setLogins(response.data);
        } catch (error) {
            console.error('Error fetching logins:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogins();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchLogins();
    };

    return (
        <div className="p-8 lg:p-12 bg-slate-50/30 min-h-screen selection:bg-primary-500/20">
            <div className="max-w-7xl mx-auto">
                {/* Enhanced Page Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 relative">
                    <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-100/40 blur-3xl rounded-full"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-1 h-1 bg-primary-600 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-600">Administrative Cluster</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
                            Login <span className="text-primary-600">Masters.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-sm max-w-lg leading-relaxed">
                            Orchestrate system access hierarchies, manage cryptographic credentials, and monitor secure identity lifecycles.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 relative z-10"
                    >
                        <button
                            onClick={() => navigate('/login-master/add')}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-900/20 flex items-center gap-3 group"
                        >
                            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                                <Plus size={14} strokeWidth={3} />
                            </div>
                            New Access Node
                        </button>
                    </motion.div>
                </div>

                {/* Search Panel */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 mb-8 bg-gradient-to-br from-white to-slate-50/50">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Search Field</label>
                            <select
                                value={searchParams.field}
                                onChange={(e) => setSearchParams({ ...searchParams, field: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all appearance-none"
                            >
                                <option value="None">None</option>
                                <option value="Uname">User Name</option>
                                <option value="Utype">User Type</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Starts With</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    value={searchParams.startWith}
                                    onChange={(e) => setSearchParams({ ...searchParams, startWith: e.target.value })}
                                    placeholder="Search value..."
                                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-3 ml-2">
                            <input
                                type="checkbox"
                                id="locked"
                                checked={searchParams.lockedUser}
                                onChange={(e) => setSearchParams({ ...searchParams, lockedUser: e.target.checked })}
                                className="w-4 h-4 text-primary-600 border-slate-200 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="locked" className="text-xs font-bold text-slate-600 cursor-pointer flex items-center gap-2">
                                <Lock size={12} className="text-slate-400" />
                                Locked Users Only
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-slate-900 border border-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                        >
                            <Filter size={14} />
                            Apply Search
                        </button>
                    </form>
                </div>

                {/* Grid */}
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User Details</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User Type</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-[0.2em] italic">
                                            Processing Request...
                                        </td>
                                    </tr>
                                ) : logins.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 font-bold text-xs uppercase tracking-[0.2em] italic">
                                            No matching records found.
                                        </td>
                                    </tr>
                                ) : (
                                    logins.map((login, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={login.username}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 group-hover:from-primary-50 group-hover:to-indigo-50 group-hover:text-primary-600 transition-all duration-300">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <span className="block font-black text-slate-800 text-sm">{login.username}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">ID: #{Math.floor(Math.random() * 9000) + 1000}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                                    <span className="font-bold text-slate-600 text-xs">{login.userType}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{login.role}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                {login.locked ? (
                                                    <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit border border-rose-100">
                                                        <Lock size={10} />
                                                        Locked
                                                    </span>
                                                ) : (
                                                    <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit border border-emerald-100">
                                                        <Shield size={10} />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                    <button
                                                        onClick={() => navigate(`/login-master/edit/${login.username}`)}
                                                        className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all shadow-sm bg-white border border-slate-100">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>Analysis of {logins.length} Secure Profiles</span>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 opacity-50 cursor-not-allowed transition-all">Previous</button>
                            <button className="px-5 py-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/30">1</button>
                            <button className="px-4 py-2 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginMasterList;

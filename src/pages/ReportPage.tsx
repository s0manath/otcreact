import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Search,
    Calendar,
    Filter,
    RefreshCcw,
    Download,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import api from '../services/api';
import ReportGrid from '../components/ReportGrid';

const REPORT_INFO: Record<string, { title: string, subtitle: string, icon: any }> = {
    'scheduled': { title: 'Scheduled Details Report', subtitle: 'Operations / Resource Planning', icon: Calendar },
    'route-details': { title: 'Route Mapped Report', subtitle: 'Logistics / Fleet Overview', icon: FileText },
    'otc-checkout': { title: 'OTC Checkout Report', subtitle: 'Operations / Compliance', icon: FileText },
    'otc-activity': { title: 'OTC Activity Detail Report', subtitle: 'Audit / Performance', icon: RefreshCcw },
    'audit': { title: 'Audit Logs Report', subtitle: 'Security / Traceability', icon: FileText },
};

const ReportPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const reportKey = type || 'scheduled';
    const info = REPORT_INFO[reportKey] || { title: 'System Report', subtitle: 'General / Intelligence', icon: FileText };

    // Filters
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterField, setFilterField] = useState('None');
    const [filterValue, setFilterValue] = useState('');
    const [franchiseCode, setFranchiseCode] = useState('');
    const [franchises, setFranchises] = useState<any[]>([]);

    // Data
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    useEffect(() => {
        fetchFranchises();
        fetchData();
    }, [type]);

    const fetchFranchises = async () => {
        try {
            const res = await api.post('/report/franchises');
            setFranchises(res.data);
        } catch (err) {
            console.error('Failed to fetch franchises');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.post('/report/data', {
                reportType: reportKey,
                fromDate,
                toDate,
                filterField,
                filterValue,
                franchiseCode,
                username: 'admin'
            });
            setColumns(res.data.columns);
            setData(res.data.data);
        } catch (err) {
            console.error('Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Header Action Bar */}
            <div className="px-8 pt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{info.title}</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{info.subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isFilterOpen
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm'}`}
                    >
                        <Filter size={16} />
                        Filter Data
                        {isFilterOpen ? <ChevronUp size={14} className="ml-1 opacity-60" /> : <ChevronDown size={14} className="ml-1 opacity-60" />}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:border-slate-300 shadow-sm transition-all group">
                        <Download size={16} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Collapsible Filter Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 overflow-hidden"
                    >
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date From</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date To</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Franchise</label>
                                <select
                                    value={franchiseCode}
                                    onChange={(e) => setFranchiseCode(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="">All Franchises</option>
                                    {franchises.map(f => (
                                        <option key={f.code} value={f.code}>{f.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Search Field</label>
                                <select
                                    value={filterField}
                                    onChange={(e) => setFilterField(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                >
                                    <option value="None">None</option>
                                    <option value="ATM_Schedule.ATMID">ATM ID</option>
                                    <option value="ATM_Schedule.Activity_Type">Activity Type</option>
                                </select>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Filter Value</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Type key..."
                                            value={filterValue}
                                            onChange={(e) => setFilterValue(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex justify-end">
                                <button
                                    onClick={fetchData}
                                    className="bg-primary-600 text-white rounded-xl py-2.5 px-8 text-xs font-black shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border border-primary-500/30 flex items-center gap-2"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="px-8">
                <ReportGrid columns={columns} data={data} isLoading={loading} />
            </div>
        </div>
    );
};

export default ReportPage;

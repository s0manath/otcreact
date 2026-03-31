import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    Monitor,
    CheckCircle2,
    RefreshCw,
    Clock,
    Route,
    TrendingUp,
    Search,
    MapPin,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Dashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>({ stats: [], performance: [] });

    useEffect(() => {
        fetchDashboardData();
    }, [selectedDate]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.post('/dashboard/data', { 
                date: selectedDate,
                username: 'admin' 
            });
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Fallback to empty data if error
            setDashboardData({ stats: [], performance: [] });
        } finally {
            setLoading(false);
        }
    };

    const stats = dashboardData.stats.length > 0 ? dashboardData.stats : [
        { label: 'ATM Schedule', value: '0', change: '+0%', icon: <CalendarIcon size={20} />, color: 'bg-[#24b8dd]' },
        { label: 'OTC Completed', value: '0', change: '+0%', icon: <CheckCircle2 size={20} />, color: 'bg-[#1bcf8d]' },
        { label: 'OTC Reset & Completed', value: '0', change: '+0%', icon: <RefreshCw size={20} />, color: 'bg-[#e9494c]' },
        { label: 'OTC Pending', value: '0', change: '+0%', icon: <Clock size={20} />, color: 'bg-[#6258ff]' },
        { label: 'Total ATMs', value: '0', change: '+0%', icon: <Monitor size={20} />, color: 'bg-amber-500' },
        { label: 'Active Routes', value: '0', change: '+0', icon: <Route size={20} />, color: 'bg-slate-700' },
    ];

    // Map icons and colors to stats
    const iconMap: any = {
        'ATM Schedule': <CalendarIcon size={20} />,
        'OTC Completed': <CheckCircle2 size={20} />,
        'OTC Reset & Completed': <RefreshCw size={20} />,
        'OTC Pending': <Clock size={20} />,
        'Total ATMs': <Monitor size={20} />,
        'Active Routes': <Route size={20} />
    };

    const districtData = dashboardData.performance;

    const Card = ({ label, value, change, color }: any) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${color}/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`} />

            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                    {iconMap[label] || <Monitor size={20} />}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'} bg-slate-50 px-2 py-1 rounded-full`}>
                    {change.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {change}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
        </motion.div >
    );

    return (
        <div className="p-8 space-y-8 min-h-full bg-[#f8fafc]">
            {/* Top Section: Date & Main Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Enhanced Calendar Context */}
                <div className="lg:col-span-4 transition-all">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 h-full flex flex-col items-center">
                        <div className="w-full mb-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">System Calendar</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Viewing Operations for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>

                        {/* Custom Pure React Calendar Placeholder (Styled) */}
                        <div className="w-full grid grid-cols-7 gap-1 text-center mb-8 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] font-black text-slate-300 py-2">{d}</div>)}
                            {Array.from({ length: 31 }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(`2026-02-${String(i + 1).padStart(2, '0')}`)}
                                    className={`py-2 text-xs font-bold rounded-xl transition-all ${i + 1 === parseInt(selectedDate.split('-')[2]) ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <div className="w-full mt-auto space-y-4">
                            <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20 font-black">
                                    <TrendingUp size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Efficiency Rate</p>
                                    <p className="text-sm font-black text-primary-900">94.2% Verified</p>
                                </div>
                            </div>
                            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-[0.98]">
                                Sync Live Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: 6 Stats Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
                            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                        </div>
                    )}
                    {stats.map((stat: any, idx: number) => (
                        <Card key={idx} {...stat} />
                    ))}
                </div>
            </div>

            {/* Bottom Section: Details & Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                )}
                {/* District Table */}
                <div className="xl:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-8 pb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">District Performance</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Regional drill-down details</p>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                            <Search size={14} className="text-slate-400" />
                            <input type="text" placeholder="Filter region..." className="bg-transparent border-none text-[10px] font-bold focus:outline-none w-32" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">District Name</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reset</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {districtData.map((district: any, idx: number) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                    <MapPin size={14} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{district.districtName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-slate-500">{district.total}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-bold text-slate-700">{district.completed}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-700">{district.reset}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">{district.pending}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pie Chart Insight */}
                <div className="xl:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Completed vs Pending</h2>

                    <div className="flex-1 flex items-center justify-center relative">
                        {/* Custom SVG Donut Chart with Framer Motion */}
                        <svg className="w-64 h-64 transform -rotate-90">
                            <circle cx="128" cy="128" r="100" fill="transparent" stroke="#f1f5f9" strokeWidth="24" />
                            <motion.circle
                                cx="128" cy="128" r="100"
                                fill="transparent" stroke="#3b7ddd" strokeWidth="24"
                                strokeDasharray="628"
                                initial={{ strokeDashoffset: 628 }}
                                animate={{ strokeDashoffset: 628 - (628 * 0.75) }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                            <circle cx="128" cy="128" r="100" fill="transparent" stroke="#1bcf8d" strokeWidth="24" strokeDasharray="628" strokeDashoffset={628 - (628 * 0.45)} className="opacity-40" />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <h4 className="text-3xl font-black text-slate-900">
                                {districtData.length > 0 ? Math.round((districtData.reduce((acc: number, curr: any) => acc + curr.completed, 0) / districtData.reduce((acc: number, curr: any) => acc + curr.total, 0)) * 100) : 0}%
                            </h4>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Efficiency</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed</p>
                            <p className="text-lg font-black text-[#1bcf8d]">
                                {districtData.reduce((acc: number, curr: any) => acc + curr.completed, 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending</p>
                            <p className="text-lg font-black text-[#6258ff]">
                                {districtData.reduce((acc: number, curr: any) => acc + curr.pending, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

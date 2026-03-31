import React, { useState, useEffect } from 'react';
import MasterPage from '../components/MasterPage';
import {
    Calendar,
    Monitor,
    User,
    MessageSquare,
    Hash,
    Plus,
    Upload,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    Loader2,
    Trash2,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ScheduleVisit: React.FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
    const [searchField, setSearchField] = useState('None');
    const [startWith, setStartWith] = useState('');
    const [loading, setLoading] = useState(true);
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [activityTypes, setActivityTypes] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newSchedule, setNewSchedule] = useState({
        atmid: '',
        activityType: '',
        scheduleDate: new Date().toISOString().split('T')[0],
        comment: ''
    });

    useEffect(() => {
        fetchScheduleData();
        fetchActivityTypes();
    }, []);

    const fetchScheduleData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/schedule/list', {
                params: {
                    fromDate: dateFrom,
                    toDate: dateTo,
                    searchField: searchField,
                    startWith: startWith
                }
            });
            setScheduleData(response.data);
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityTypes = async () => {
        try {
            const response = await api.get('/schedule/activity-types');
            setActivityTypes(response.data);
        } catch (error) {
            console.error('Error fetching activity types:', error);
        }
    };

    const handleAddSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/schedule', {
                atmid: newSchedule.atmid,
                activityType: newSchedule.activityType,
                scheduleDate: newSchedule.scheduleDate,
                username: 'admin' // Should be from auth context
            });
            setIsAddModalOpen(false);
            setNewSchedule({ atmid: '', activityType: '', scheduleDate: new Date().toISOString().split('T')[0], comment: '' });
            fetchScheduleData();
        } catch (error: any) {
            alert('Error adding schedule: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this schedule?')) return;
        try {
            await api.delete(`/schedule/${id}`);
            fetchScheduleData();
        } catch (error: any) {
            alert('Error deleting schedule: ' + (error.response?.data?.message || error.message));
        }
    };

    const columns = [
        {
            header: 'Scheduled ID',
            key: 'schedule_Id',
            render: (val: any) => (
                <button className="text-primary-600 font-black text-xs hover:underline flex items-center gap-1 group">
                    <Hash size={10} className="text-primary-400 group-hover:text-primary-600" />
                    {val}
                </button>
            )
        },
        {
            header: 'ATM ID',
            key: 'atmid',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Monitor size={14} />
                    </div>
                    <span className="font-bold text-slate-800 text-sm tracking-tight">{val}</span>
                </div>
            )
        },
        {
            header: 'Activity Type',
            key: 'activity_Type',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${val?.includes('Repair') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        val?.includes('Cash') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-primary-50 text-primary-600 border-primary-100'
                        }`}>
                        {val}
                    </div>
                </div>
            )
        },
        {
            header: 'Schedule Date',
            key: 'schedule_Date',
            render: (val: any) => (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Calendar size={12} className="text-slate-400" />
                    {val}
                </div>
            )
        },
        {
            header: 'Created By',
            key: 'createdBy',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={12} />
                    </div>
                    <span className="text-xs font-semibold text-slate-600">{val}</span>
                </div>
            )
        },
        {
            header: 'Created Date',
            key: 'createdDate',
            render: (val: any) => (
                <span className="text-[10px] font-bold text-slate-400">{val}</span>
            )
        },
        {
            header: 'Comment',
            key: 'comment',
            render: (val: any) => (
                <div className="flex items-start gap-2 max-w-[200px]">
                    <MessageSquare size={12} className="text-slate-300 mt-1 flex-shrink-0" />
                    <span className="text-[11px] font-medium text-slate-500 leading-relaxed truncate hover:whitespace-normal transition-all">{val}</span>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Action Bar */}
            <div className="px-8 pt-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Schedule Visit</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Operations / Scheduling</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isFilterOpen
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm'
                            }`}
                    >
                        <Filter size={16} />
                        Filter Data
                        {isFilterOpen ? <ChevronUp size={14} className="ml-1 opacity-60" /> : <ChevronDown size={14} className="ml-1 opacity-60" />}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:border-slate-300 shadow-sm transition-all group">
                        <Upload size={16} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                        Bulk Upload
                    </button>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-95"
                    >
                        <Plus size={16} />
                        Add Schedule
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date To</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Search Field</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                    value={searchField}
                                    onChange={(e) => setSearchField(e.target.value)}
                                >
                                    <option value="None">None</option>
                                    <option value="ATM_Schedule.ATMID">ATM ID</option>
                                    <option value="ATM_Schedule.Activity_Type">Activity Type</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Starts With</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Type key..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white outline-none transition-all"
                                        value={startWith}
                                        onChange={(e) => setStartWith(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={fetchScheduleData}
                                className="bg-primary-600 text-white rounded-xl py-2.5 px-6 text-xs font-black shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                            >
                                View Report
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid Section */}
            <div className="px-8 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                )}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/30">
                                    {columns.map(col => (
                                        <th key={col.key} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{col.header}</th>
                                    ))}
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduleData.map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-none">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-8 py-5">
                                                {col.render ? col.render(row[col.key as keyof typeof row]) : (
                                                    <span className="text-sm font-semibold text-slate-700">{row[col.key as keyof typeof row]}</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDelete(row.schedule_Id)}
                                                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Modern Pager */}
                    <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Records: <span className="text-slate-900">{scheduleData.length}</span></span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">First</button>
                            <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Prev</button>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl">
                                <span className="text-xs font-black text-slate-900">1</span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">of 5</span>
                            </div>
                            <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-900">Next</button>
                            <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-900">Last</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Schedule Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100"
                        >
                            <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900">Add New Schedule</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Operations / Manual Scheduling</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleAddSchedule} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ATM ID</label>
                                    <div className="relative">
                                        <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter ATM ID (e.g. ATM00124)"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-600/5 transition-all outline-none"
                                            value={newSchedule.atmid}
                                            onChange={(e) => setNewSchedule({ ...newSchedule, atmid: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Activity Type</label>
                                        <select
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                            value={newSchedule.activityType}
                                            onChange={(e) => setNewSchedule({ ...newSchedule, activityType: e.target.value })}
                                        >
                                            <option value="">Select Activity</option>
                                            {activityTypes.map((type: any, i: number) => (
                                                <option key={i} value={type.name}>{type.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Schedule Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="date"
                                                required
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none"
                                                value={newSchedule.scheduleDate}
                                                onChange={(e) => setNewSchedule({ ...newSchedule, scheduleDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Internal Comments</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Add any specific instructions for the visit..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none resize-none"
                                        value={newSchedule.comment}
                                        onChange={(e) => setNewSchedule({ ...newSchedule, comment: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all"
                                >
                                    Confirm Schedule
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScheduleVisit;

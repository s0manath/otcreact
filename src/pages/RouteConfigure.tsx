import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Monitor,
    MapPin,
    Plus,
    Filter,
    ChevronDown,
    ChevronUp,
    Loader2,
    Settings2,
    CheckCircle2,
    Clock,
    Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import RouteConfigureModal from '../components/RouteConfigureModal';

const RouteConfigure: React.FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [routeData, setRouteData] = useState<any[]>([]);
    const [filters, setFilters] = useState({
        dateFrom: new Date().toISOString().split('T')[0],
        dateTo: new Date().toISOString().split('T')[0],
        region: '',
        district: '',
        franchise: '',
        zom: '',
        activityType: '',
        status: '',
        chkConfig: '',
        searchField: 'None',
        searchValue: ''
    });

    const [filterOptions, setFilterOptions] = useState<any>({
        regions: [],
        districts: [],
        franchises: [],
        zoms: [],
        activityTypes: []
    });

    const [selectedRoute, setSelectedRoute] = useState<{ id: string, atmid: string } | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchFilterOptions();
        fetchRouteData();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const response = await api.post('/route/filters');
            setFilterOptions(response.data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const fetchRouteData = async () => {
        setLoading(true);
        try {
            const response = await api.post('/route/list', {
                fromDate: filters.dateFrom,
                toDate: filters.dateTo,
                region: filters.region,
                district: filters.district,
                franchise: filters.franchise,
                zom: filters.zom,
                activityType: filters.activityType,
                status: filters.status,
                chkConfig: filters.chkConfig,
                searchField: filters.searchField,
                searchValue: filters.searchValue,
                username: 'admin'
            });
            setRouteData(response.data);
        } catch (error) {
            console.error('Error fetching route data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (scheduleId: string, atmid: string) => {
        setSelectedRoute({ id: scheduleId, atmid });
        setIsEditModalOpen(true);
    };

    const columns = [
        {
            header: 'ID',
            key: 'id',
            render: (val: any) => (
                <span className="text-primary-600 font-black text-xs">{val}</span>
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
            header: 'Activity',
            key: 'activity_Type',
            render: (val: any) => (
                <span className="px-2 py-1 rounded-lg bg-primary-50 text-primary-600 text-[10px] font-black uppercase border border-primary-100">{val}</span>
            )
        },
        {
            header: 'Schedule Date',
            key: 'schedule_Date',
            render: (val: any) => (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Calendar size={12} className="text-slate-400" />
                    {val}
                </div>
            )
        },
        {
            header: 'Region/District',
            key: 'region',
            render: (val: any, row: any) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 italic">
                        <MapPin size={10} className="text-primary-400" />
                        {val}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 ml-4">{row.district}</div>
                </div>
            )
        },
        {
            header: 'Route Details',
            key: 'routeKey',
            render: (val: any, row: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 italic">K</div>
                        <span className="text-[11px] font-black text-slate-800 tracking-tight">{val || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                        <div className="w-4 h-4 rounded bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 italic">C1</div>
                        <span className="text-[10px] font-bold text-slate-600">{row.custodian1 || 'Unassigned'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Status',
            key: 'status',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    {val === 'Completed' ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic transition-all shadow-sm shadow-emerald-600/5">
                            <CheckCircle2 size={12} className="stroke-[3]" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 italic transition-all shadow-sm shadow-amber-600/5">
                            <Clock size={12} className="stroke-[3]" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Pending</span>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="px-8 pt-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Route Configure</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">Operations / Managed Routes</p>
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
                        Filter View
                        {isFilterOpen ? <ChevronUp size={14} className="ml-1 opacity-60" /> : <ChevronDown size={14} className="ml-1 opacity-60" />}
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-95">
                        <Plus size={16} />
                        Bulk Upload
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 overflow-hidden"
                    >
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Date From</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Date To</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Region</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none appearance-none"
                                    value={filters.region}
                                    onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                                >
                                    <option value="">All Regions</option>
                                    {filterOptions.regions.map((opt: any) => <option key={opt.code} value={opt.code}>{opt.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">District</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none appearance-none"
                                    value={filters.district}
                                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                >
                                    <option value="">All Districts</option>
                                    {filterOptions.districts.map((opt: any) => <option key={opt.code} value={opt.code}>{opt.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Franchise</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none appearance-none"
                                    value={filters.franchise}
                                    onChange={(e) => setFilters({ ...filters, franchise: e.target.value })}
                                >
                                    <option value="">All Franchises</option>
                                    {filterOptions.franchises.map((opt: any) => <option key={opt.code} value={opt.code}>{opt.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Activity</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none appearance-none"
                                    value={filters.activityType}
                                    onChange={(e) => setFilters({ ...filters, activityType: e.target.value })}
                                >
                                    <option value="">All Activities</option>
                                    {filterOptions.activityTypes.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Search</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none appearance-none"
                                        value={filters.searchField}
                                        onChange={(e) => setFilters({ ...filters, searchField: e.target.value })}
                                    >
                                        <option value="None">None</option>
                                        <option value="ID">Schedule ID</option>
                                        <option value="ATMID">ATM ID</option>
                                        <option value="RouteKey">Route Key</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Value..."
                                        className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 focus:bg-white outline-none"
                                        value={filters.searchValue}
                                        onChange={(e) => setFilters({ ...filters, searchValue: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={fetchRouteData}
                                    className="flex-1 bg-primary-600 text-white rounded-xl py-2.5 px-6 text-xs font-black shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    Refresh List
                                </button>
                                <div className="flex items-center gap-2 p-1">
                                    <input
                                        type="checkbox"
                                        id="chkConfig"
                                        className="w-4 h-4 rounded border-slate-300 text-primary-600"
                                        checked={filters.chkConfig === 'Yes'}
                                        onChange={(e) => setFilters({ ...filters, chkConfig: e.target.checked ? 'Yes' : '' })}
                                    />
                                    <label htmlFor="chkConfig" className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Not Configured Only</label>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="px-8 relative mb-12">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                )}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                    <div className="overflow-x-auto">
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
                                {routeData.map((row, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-none">
                                        {columns.map(col => (
                                            <td key={col.key} className="px-8 py-5">
                                                {col.render ? col.render(row[col.key as keyof typeof row], row) : (
                                                    <span className="text-sm font-semibold text-slate-700 italic tracking-tight">{row[col.key as keyof typeof row]}</span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleEdit(row.id, row.atmid)}
                                                className="p-2.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all group"
                                                title="Configure Route"
                                            >
                                                <Settings2 size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {routeData.length === 0 && !loading && (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
                            <Tag size={48} className="opacity-10 rotate-12" />
                            <p className="text-xs font-black uppercase tracking-widest italic">No routes found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>

            <RouteConfigureModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                scheduleId={selectedRoute?.id || ''}
                atmid={selectedRoute?.atmid || ''}
                onSuccess={fetchRouteData}
            />
        </div>
    );
};

export default RouteConfigure;

import React, { useState, useEffect } from 'react';
import { Map, Search, CheckSquare, Square, ArrowRight, Monitor } from 'lucide-react';
import api from '../services/api';
import masterService from '../services/masterService';

const RouteMappingUtility: React.FC = () => {
    const [atms, setAtms] = useState<any[]>([]);
    const [selectedAtmIds, setSelectedAtmIds] = useState<string[]>([]);
    const [routeKeys, setRouteKeys] = useState<{ id: string; name: string }[]>([]);
    const [selectedRouteKey, setSelectedRouteKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [atmRes, keyRes] = await Promise.all([
                api.post('/master/atms-list'),
                masterService.getRouteKeys()
            ]);
            setAtms(atmRes.data);
            setRouteKeys(keyRes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAtm = (id: string) => {
        setSelectedAtmIds(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleBulkUpdate = async () => {
        if (selectedAtmIds.length === 0 || !selectedRouteKey) {
            alert('Please select ATMs and a Route Key');
            return;
        }

        try {
            setSaveLoading(true);
            await api.post('/AdminMaster/bulk-update-route-keys', { 
                atmIds: selectedAtmIds, 
                routeKey: selectedRouteKey 
            });
            alert('Successfully updated route keys for selected ATMs');
            setSelectedAtmIds([]);
            setSelectedRouteKey('');
            await fetchData();
        } catch (error) {
            console.error(error);
        } finally {
            setSaveLoading(false);
        }
    };

    const filteredAtms = atms.filter(a =>
        a.atmId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.bank.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Route <span className="text-blue-600">Mapper.</span></h1>
                        <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Logistical Orchestration Utility</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ATM Selection */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[700px]">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div className="relative w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search ATM ID or Bank..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                    />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                    {selectedAtmIds.length} Assets Selected
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {loading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    filteredAtms.map(atm => (
                                        <button
                                            key={atm.atmId}
                                            onClick={() => toggleAtm(atm.atmId)}
                                            className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${selectedAtmIds.includes(atm.atmId) ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedAtmIds.includes(atm.atmId) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Monitor size={20} />
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="text-sm font-black text-slate-900 tracking-tight">{atm.atmId}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{atm.bank} | {atm.city}</span>
                                                </div>
                                            </div>
                                            {selectedAtmIds.includes(atm.atmId) ? <CheckSquare className="text-blue-600" size={20} /> : <Square className="text-slate-200" size={20} />}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mapping Control */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />

                            <div className="relative z-10 space-y-8">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <Map size={32} className="text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight leading-tight">Assign Master <br />Route Key.</h2>

                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Route Key</label>
                                        <select
                                            value={selectedRouteKey}
                                            onChange={e => setSelectedRouteKey(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                                        >
                                            <option value="" className="bg-slate-900">Select Master Key</option>
                                            {routeKeys.map(k => <option key={k.id} value={k.name} className="bg-slate-900">{k.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-8 flex flex-col gap-4">
                                    <button
                                        onClick={handleBulkUpdate}
                                        disabled={saveLoading || selectedAtmIds.length === 0}
                                        className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saveLoading ? 'Orchestrating...' : 'Commit Mapping'}
                                        <ArrowRight size={18} />
                                    </button>
                                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest italic opacity-60">This action will override current configurations for all selected assets</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Summary</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-400">Selected Terminals</span>
                                    <span className="text-slate-900">{selectedAtmIds.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-slate-400">Master Route</span>
                                    <span className="text-blue-600">{selectedRouteKey || 'Not Specified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteMappingUtility;

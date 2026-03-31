import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import masterService, { type StateMaster, type MasterDropdownItem } from '../services/masterService';

const StateMasterForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;

    const [form, setForm] = useState<StateMaster>({
        id: 0,
        stateName: '',
        regionId: undefined,
        isActive: true
    });

    const [regions, setRegions] = useState<MasterDropdownItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const regionData = await masterService.getLocations(); // Assuming regions are here for now
            setRegions(regionData);

            if (isEdit) {
                const data = await masterService.getState(parseInt(id!));
                setForm(data);
            }
        } catch (error) {
            console.error('Error loading state data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await masterService.saveState(form);
            navigate('/masters/states');
        } catch (error) {
            console.error('Error saving state:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading State Node...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => navigate('/masters/states')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-orange-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-orange-600">Back to Hierarchy</span>
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            {isEdit ? 'Refine' : 'Add'} <span className="text-orange-600 px-2 py-1 bg-orange-50 rounded-2xl">State Node.</span>
                        </h1>
                    </motion.div>
                </div>

                <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">State Formal Name</label>
                            <input
                                type="text"
                                required
                                value={form.stateName}
                                onChange={e => setForm({ ...form, stateName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all"
                                placeholder="Enter state name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Parent Region</label>
                            <div className="relative">
                                <select
                                    value={form.regionId || ''}
                                    onChange={e => setForm({ ...form, regionId: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all appearance-none"
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                                <ChevronRight size={14} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Node Visibility</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control if this state is selectable in other modules</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                            className={`w-14 h-8 rounded-full relative transition-all ${form.isActive ? 'bg-orange-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/masters/states')}
                            className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={saveLoading}
                            className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center gap-3"
                        >
                            {saveLoading ? 'Syncing...' : 'Commit Node'}
                            <Save size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StateMasterForm;

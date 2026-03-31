import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { adminMasterService, type RegionMaster } from '../services/adminMasterService';

const RegionMasterForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;

    const [form, setForm] = useState<Partial<RegionMaster>>({
        id: 0,
        regionCode: '',
        regionName: '',
        isActive: true
    });

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (isEdit) loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await adminMasterService.getRegions();
            const current = data.find(r => r.id === parseInt(id!));
            if (current) setForm(current);
        } catch (error) {
            console.error('Error loading region data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await adminMasterService.saveRegion(form);
            navigate('/masters/regions');
        } catch (error) {
            console.error('Error saving region:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Region Matrix...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => navigate('/masters/regions')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-indigo-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-600">Back to Regions</span>
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            {isEdit ? 'Update' : 'Define'} <span className="text-indigo-600 px-2 py-1 bg-indigo-50 rounded-2xl">Geozone.</span>
                        </h1>
                    </motion.div>
                </div>

                <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Region Code</label>
                            <input
                                type="text"
                                required
                                value={form.regionCode}
                                onChange={e => setForm({ ...form, regionCode: e.target.value.toUpperCase() })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all font-mono"
                                placeholder="e.g. REG-NORTH"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Region Name</label>
                            <input
                                type="text"
                                required
                                value={form.regionName}
                                onChange={e => setForm({ ...form, regionName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all"
                                placeholder="e.g. Northern Operations"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Zone Visibility</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enable or restrict this region from governance hierarchy</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                            className={`w-14 h-8 rounded-full relative transition-all ${form.isActive ? 'bg-indigo-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/masters/regions')}
                            className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={saveLoading}
                            className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center gap-3"
                        >
                            {saveLoading ? 'Syncing...' : 'Commit Zone'}
                            <Save size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegionMasterForm;

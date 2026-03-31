import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { adminMasterService, type LocationMaster, type RegionMaster } from '../services/adminMasterService';

const LocationMasterForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;

    const [form, setForm] = useState<Partial<LocationMaster>>({
        id: 0,
        locationName: '',
        regionCode: '',
        regionName: '',
        isActive: true
    });

    const [regions, setRegions] = useState<RegionMaster[]>([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const regData = await adminMasterService.getRegions();
            setRegions(regData);

            if (isEdit) {
                const data = await adminMasterService.getLocations();
                const current = data.find(l => l.id === parseInt(id!));
                if (current) setForm(current);
            }
        } catch (error) {
            console.error('Error loading location data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await adminMasterService.saveLocation(form);
            navigate('/masters/locations');
        } catch (error) {
            console.error('Error saving location:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Hub Registry...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => navigate('/masters/locations')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-sky-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-sky-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-sky-600">Back to Locations</span>
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            {isEdit ? 'Refine' : 'Establish'} <span className="text-sky-600 px-2 py-1 bg-sky-50 rounded-2xl">Hub Point.</span>
                        </h1>
                    </motion.div>
                </div>

                <form onSubmit={handleSave} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location Name</label>
                            <input
                                type="text"
                                required
                                value={form.locationName}
                                onChange={e => setForm({ ...form, locationName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-400 transition-all"
                                placeholder="e.g. South Cluster 01"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Administrative Region</label>
                            <div className="relative">
                                <select
                                    required
                                    value={form.regionCode}
                                    onChange={e => {
                                        const reg = regions.find(r => r.regionCode === e.target.value);
                                        setForm({ ...form, regionCode: e.target.value, regionName: reg?.regionName || '' });
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-400 transition-all appearance-none"
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(r => <option key={r.id} value={r.regionCode}>{r.regionName}</option>)}
                                </select>
                                <ChevronRight size={14} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                        <div className="flex-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Hub Status</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operational availability for resource mapping</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, isActive: !form.isActive })}
                            className={`w-14 h-8 rounded-full relative transition-all ${form.isActive ? 'bg-sky-600' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/masters/locations')}
                            className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveLoading}
                            className="px-12 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center gap-3"
                        >
                            {saveLoading ? 'Syncing...' : 'Register Hub'}
                            <Save size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationMasterForm;

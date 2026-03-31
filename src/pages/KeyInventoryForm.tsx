import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { adminMasterService, type KeyInventoryMaster } from '../services/adminMasterService';

const KeyInventoryForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;

    const [form, setForm] = useState<Partial<KeyInventoryMaster>>({
        id: 0,
        keySerialNumber: '',
        keyType: '',
        keyMake: '',
        keyModel: '',
        atmid: '',
        imagePath: '',
        isActive: true
    });

    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await adminMasterService.getKeys();
            const current = data.find(k => k.id === parseInt(id!));
            if (current) {
                setForm(current);
                if (current.imagePath) setPreviewImage(current.imagePath);
            }
        } catch (error) {
            console.error('Error loading key data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setForm({ ...form, imagePath: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await adminMasterService.saveKey(form);
            navigate('/masters/keys');
        } catch (error) {
            console.error('Error saving key:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inspecting Hardware Vault...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => navigate('/masters/keys')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-amber-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-amber-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-amber-600">Inventory Dashboard</span>
                        </button>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            {isEdit ? 'Certify' : 'Enroll'} <span className="text-amber-600 px-2 py-1 bg-amber-50 rounded-2xl">Hardware Token.</span>
                        </h1>
                    </motion.div>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Serial Number</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.keySerialNumber}
                                        onChange={e => setForm({ ...form, keySerialNumber: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all font-mono"
                                        placeholder="K-XXXX-XXXX"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Key Classification</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={form.keyType}
                                            onChange={e => setForm({ ...form, keyType: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all appearance-none"
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Mechanical">Mechanical</option>
                                            <option value="Electronic">Electronic</option>
                                            <option value="Smart Key">Smart Key</option>
                                            <option value="Emergency">Emergency</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Manufacturer</label>
                                    <input
                                        type="text"
                                        value={form.keyMake}
                                        onChange={e => setForm({ ...form, keyMake: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all"
                                        placeholder="e.g. Godrej, SecureKey"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Model Version</label>
                                    <input
                                        type="text"
                                        value={form.keyModel}
                                        onChange={e => setForm({ ...form, keyModel: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all"
                                        placeholder="e.g. V2.1 Dual Lock"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Assigned ATM/Terminal ID</label>
                                <input
                                    type="text"
                                    value={form.atmid}
                                    onChange={e => setForm({ ...form, atmid: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all font-mono"
                                    placeholder="ATM-XXXXXXX"
                                />
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1 italic">Leave blank if the token is in the logistics pool</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg p-8">
                            <div className="flex items-center gap-6">
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hardware Integrity</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unset if the physical key is damaged or lost</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                    className={`w-16 h-8 rounded-full relative transition-all ${form.isActive ? 'bg-amber-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'left-9' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Visual Identity</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Proof of physical asset status</p>
                            </div>
                            <div className="p-8">
                                <div className="relative aspect-square rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center group overflow-hidden">
                                    {previewImage ? (
                                        <>
                                            <img src={previewImage} alt="Key Proof" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => { setPreviewImage(null); setForm({ ...form, imagePath: '' }); }}
                                                className="absolute top-4 right-4 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-slate-400">
                                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                                <ImageIcon size={32} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest">No Image Linked</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 pointer-events-none">
                                        <Upload className="text-white" size={24} />
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Capture</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                disabled={saveLoading}
                                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                {saveLoading ? 'Vaulting...' : 'Register Asset'}
                                <Save size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/masters/keys')}
                                className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-mono"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default KeyInventoryForm;

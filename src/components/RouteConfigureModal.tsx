import React, { useState, useEffect } from 'react';
import { X, User, Key, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

interface RouteConfigureModalProps {
    isOpen: boolean;
    onClose: () => void;
    scheduleId: string;
    atmId: string;
    onSuccess: () => void;
}

const RouteConfigureModal: React.FC<RouteConfigureModalProps> = ({ isOpen, onClose, scheduleId, atmId, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [custodians, setCustodians] = useState<any[]>([]);
    const [routeKey, setRouteKey] = useState('');
    const [custodian1, setCustodian1] = useState('');
    const [custodian2, setCustodian2] = useState('');
    const [updateAll, setUpdateAll] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen && scheduleId) {
            fetchInitialData();
        }
    }, [isOpen, scheduleId]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [custResponse, detailsResponse] = await Promise.all([
                api.post('/route/custodians', { id: scheduleId }),
                api.post('/route/details', { id: scheduleId })
            ]);

            setCustodians(custResponse.data);

            if (detailsResponse.data) {
                setRouteKey(detailsResponse.data.routeKey || '');
                setCustodian1(detailsResponse.data.custodian1 || '');
                setCustodian2(detailsResponse.data.custodian2 || '');
            }
        } catch (error) {
            console.error('Error fetching modal data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/route/save', {
                scheduleId,
                atmId,
                routeKey,
                custodian1,
                custodian2,
                updateAll,
                username: 'admin' // Should be from auth context
            });
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Error saving route: ' + (error.response?.data?.message || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
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
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">Configure Route</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Operations / Route Assignment</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                                <Loader2 className="animate-spin" size={32} />
                                <span className="text-xs font-bold uppercase tracking-widest">Loading Details...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Route Key</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter Route Key"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-600/5 transition-all outline-none"
                                            value={routeKey}
                                            onChange={(e) => setRouteKey(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Custodian 1</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <select
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                            value={custodian1}
                                            onChange={(e) => setCustodian1(e.target.value)}
                                        >
                                            <option value="">Select Custodian 1</option>
                                            {custodians.map(c => (
                                                <option key={c.custodianCode} value={c.custodianCode}>{c.custodianName} ({c.custodianCode})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Custodian 2 (Optional)</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
                                            value={custodian2}
                                            onChange={(e) => setCustodian2(e.target.value)}
                                        >
                                            <option value="">Select Custodian 2</option>
                                            {custodians.map(c => (
                                                <option key={c.custodianCode} value={c.custodianCode}>{c.custodianName} ({c.custodianCode})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-1">
                                    <input
                                        type="checkbox"
                                        id="updateAll"
                                        className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        checked={updateAll}
                                        onChange={(e) => setUpdateAll(e.target.checked)}
                                    />
                                    <label htmlFor="updateAll" className="text-xs font-bold text-slate-600 cursor-pointer">Update for all scheduled visits today</label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-primary-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Confirm Configuration
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RouteConfigureModal;

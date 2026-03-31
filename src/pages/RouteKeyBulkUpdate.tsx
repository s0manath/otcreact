import React, { useState, useRef } from 'react';
import {
    Key,
    CheckCircle2,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import masterService, { type BulkUploadResponse } from '../services/masterService';

const RouteKeyBulkUpdate: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<BulkUploadResponse | null>(null);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setStatus('uploading');
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                setStatus('processing');
                const base64 = (reader.result as string).split(',')[1];
                const res = await masterService.updateRouteKeyBulk(file.name, base64);
                setResult(res);
                setStatus('success');
            };
        } catch (error) {
            console.error('Update failed:', error);
            setStatus('error');
        }
    };

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans selection:bg-orange-500/20">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-500/5 blur-[100px] rounded-full"></div>

                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                        <button
                            onClick={() => navigate('/masters/atms')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-orange-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-orange-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-orange-600">Back to Terminal Control</span>
                        </button>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            Route Key <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 text-6xl">Propagation.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-lg max-w-xl">
                            Mass synchronize cryptographic route keys across distributed terminal nodes. Ensure alignment with security matrices.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    <div className="lg:col-span-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-12 overflow-hidden relative"
                        >
                            {status === 'idle' || status === 'uploading' || status === 'processing' ? (
                                <div
                                    className={`relative z-10 border-4 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center transition-all ${dragging ? 'border-orange-500 bg-orange-50/50 scale-[0.98]' : 'border-slate-100'}`}
                                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                                    onDragLeave={() => setDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".xlsx,.xls"
                                    />

                                    <div className="w-24 h-24 rounded-3xl bg-orange-900 flex items-center justify-center text-white shadow-2xl shadow-orange-900/40 mb-8 animate-pulse">
                                        <Key size={40} strokeWidth={2.5} />
                                    </div>

                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{file.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-8">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for cryptographic sync
                                            </p>
                                            <button
                                                onClick={handleUpload}
                                                disabled={status !== 'idle'}
                                                className="px-12 py-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                                            >
                                                {status === 'idle' ? 'Commence Sync' : 'Processing...'}
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Drop Key Manifest</h3>
                                            <p className="text-slate-400 font-bold mb-8">Select .xlsx file with [ATM ID] and [New Route Key] mappings</p>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-8 py-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all font-sans"
                                            >
                                                Browse Local Nodes
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : status === 'success' && result ? (
                                <div className="relative z-10 flex flex-col">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                            <CheckCircle2 size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Sync Realized.</h2>
                                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-none">Status: {result.message}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keys Processed</p>
                                            <p className="text-4xl font-black text-slate-900">{result.totalRecords}</p>
                                        </div>
                                        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Integrity Verified</p>
                                            <p className="text-4xl font-black text-emerald-700">{result.validRecords}</p>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
                                        <button
                                            onClick={reset}
                                            className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3"
                                        >
                                            Relaunch Protocol
                                        </button>
                                        <button
                                            onClick={() => navigate('/masters/atms')}
                                            className="px-12 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex-1"
                                        >
                                            Return to Controller
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouteKeyBulkUpdate;

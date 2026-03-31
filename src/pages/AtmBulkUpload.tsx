import React, { useState, useRef } from 'react';
import {
    Upload,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    ArrowLeft,
    Download,
    History
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import masterService, { type BulkUploadResponse } from '../services/masterService';

const AtmBulkUpload: React.FC = () => {
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
            // Mock file reading to base64 for simulation
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                setStatus('processing');
                const base64 = (reader.result as string).split(',')[1];
                const res = await masterService.uploadAtmBulk(file.name, base64);
                setResult(res);
                setStatus('success');
            };
        } catch (error) {
            console.error('Upload failed:', error);
            setStatus('error');
        }
    };

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans selection:bg-primary-500/20">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/5 blur-[100px] rounded-full"></div>

                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="relative z-10">
                        <button
                            onClick={() => navigate('/masters/atms')}
                            className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-primary-500 transition-all mb-6"
                        >
                            <ArrowLeft size={14} className="text-slate-400 group-hover:text-primary-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary-600">Back to Terminal Control</span>
                        </button>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                            Bulk <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 text-6xl">Initialization.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-lg max-w-xl">
                            Synchronize multiple terminal nodes via standard Excel protocol. Validate hierarchy and connectivity in real-time.
                        </p>
                    </motion.div>

                    <div className="flex gap-4 relative z-10">
                        <button className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 rounded-2xl transition-all shadow-sm group">
                            <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                        </button>
                        <button className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-primary-600 rounded-2xl transition-all shadow-sm group">
                            <History size={20} className="group-active:rotate-180 transition-transform duration-500" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    {/* Left: Upload Zone */}
                    <div className="lg:col-span-12">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-12 overflow-hidden relative"
                        >
                            {status === 'idle' || status === 'uploading' || status === 'processing' ? (
                                <div
                                    className={`relative z-10 border-4 border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center transition-all ${dragging ? 'border-primary-500 bg-primary-50/50 scale-[0.98]' : 'border-slate-100'}`}
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

                                    <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-900/40 mb-8 animate-bounce">
                                        <Upload size={40} strokeWidth={2.5} />
                                    </div>

                                    {file ? (
                                        <div className="text-center">
                                            <p className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{file.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-8">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for ingestion
                                            </p>
                                            <button
                                                onClick={handleUpload}
                                                disabled={status !== 'idle'}
                                                className="px-12 py-5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
                                            >
                                                {status === 'idle' ? 'Start Protocol' : 'Processing...'}
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Drop Manifest File</h3>
                                            <p className="text-slate-400 font-bold mb-8">Select .xlsx or .xls file containing ATM node descriptors</p>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-8 py-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all font-sans"
                                            >
                                                Browse Local Node
                                            </button>
                                        </div>
                                    )}

                                    {status === 'processing' && (
                                        <div className="absolute inset-x-20 bottom-12">
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: '100%' }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="h-full bg-gradient-to-r from-primary-500 to-indigo-500"
                                                />
                                            </div>
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
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Ingestion Segmented.</h2>
                                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-none">Status: {result.message}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Scanned</p>
                                            <p className="text-4xl font-black text-slate-900">{result.totalRecords}</p>
                                        </div>
                                        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Authenticated</p>
                                            <p className="text-4xl font-black text-emerald-700">{result.validRecords}</p>
                                        </div>
                                        <div className="bg-rose-50 rounded-3xl p-8 border border-rose-100">
                                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Rejected</p>
                                            <p className="text-4xl font-black text-rose-700">{result.invalidRecords}</p>
                                        </div>
                                    </div>

                                    {result.errors.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic ml-1 mb-4">Conflict Logs</h4>
                                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                                {result.errors.map((error, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                                                <AlertCircle size={16} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Row {error.rowNumber} • {error.columnName}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{error.errorMessage}</p>
                                                            </div>
                                                        </div>
                                                        <XCircle size={16} className="text-rose-200" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
                                        <button
                                            onClick={reset}
                                            className="px-8 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3"
                                        >
                                            Restart Protocol
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

export default AtmBulkUpload;

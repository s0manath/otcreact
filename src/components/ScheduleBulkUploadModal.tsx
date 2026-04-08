import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    Upload, 
    FileText, 
    Download, 
    Loader2, 
    CheckCircle2, 
    FileSpreadsheet,
    AlertCircle
} from 'lucide-react';
import api from '../services/api';

interface BulkError {
    rowNumber: number;
    columnName: string;
    errorMessage: string;
}

interface BulkUploadResult {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    errors: BulkError[];
    resultFileBase64?: string;
}

interface ScheduleBulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const ScheduleBulkUploadModal: React.FC<ScheduleBulkUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<BulkUploadResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', 'Likhith'); // Replace with auth context ideally

        try {
            const response = await api.post('/schedule/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setResult(response.data);
            if (response.data.success) {
                setStatus('success');
                onSuccess();
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Bulk upload error:', error);
            setStatus('error');
        }
    };

    const handleDownloadFormat = async () => {
        try {
            const response = await api.get('/schedule/download-template', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Schedule_Template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download template error:', error);
            alert('Failed to download template');
        }
    };

    const downloadResultReport = () => {
        if (!result?.resultFileBase64) return;
        
        const byteCharacters = atob(result.resultFileBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Upload_Result_Report.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl relative z-10 border border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-8 pb-6 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bulk Scheduling</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">Manifest Protocol / Automation</p>
                            </div>
                            <button 
                                onClick={onClose} 
                                className="p-2 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-200"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {status === 'success' || status === 'error' && result ? (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 shadow-xl ${status === 'success' && result.invalidRecords === 0 ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-amber-500 shadow-amber-500/20'}`}>
                                            {status === 'success' && result.invalidRecords === 0 ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                                        </div>
                                        <h3 className="text-lg font-black text-slate-900">
                                            {status === 'success' && result.invalidRecords === 0 ? 'Upload Complete!' : 'Processing Finished'}
                                        </h3>
                                        <div className="mt-4 grid grid-cols-3 gap-8 w-full">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Total</p>
                                                <p className="text-xl font-black text-slate-900">{result.totalRecords}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">Success</p>
                                                <p className="text-xl font-black text-emerald-600">{result.validRecords}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 italic">Errors</p>
                                                <p className="text-xl font-black text-rose-600">{result.invalidRecords}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {result.resultFileBase64 && (
                                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">Result Report</p>
                                                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest italic">Includes Error Details</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={downloadResultReport}
                                                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-amber-700 transition-all"
                                            >
                                                <Download size={12} />
                                                Report
                                            </button>
                                        </div>
                                    )}

                                    <button 
                                        onClick={onClose}
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Close Portal
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Download Action */}
                                    <div className="bg-primary-50/50 border border-primary-100 rounded-[2rem] p-6 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-primary-200 flex items-center justify-center text-primary-600 shadow-sm">
                                                <FileSpreadsheet size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">Standard Format</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excel Manifest Template</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleDownloadFormat}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-primary-600/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Download size={14} />
                                            Download
                                        </button>
                                    </div>

                                    {/* Upload Zone */}
                                    <div 
                                        onClick={() => status === 'idle' && fileInputRef.current?.click()}
                                        className={`
                                            relative border-2 border-dashed rounded-[2rem] p-12 transition-all cursor-pointer group
                                            ${file ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-100 bg-slate-50/50 hover:border-primary-200 hover:bg-primary-50/20'}
                                            ${status === 'uploading' ? 'pointer-events-none opacity-60' : ''}
                                        `}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            className="hidden" 
                                            accept=".xlsx,.xls" 
                                        />

                                        <div className="flex flex-col items-center text-center">
                                            <div className={`
                                                w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all
                                                ${file ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-900 text-white group-hover:bg-primary-600'}
                                            `}>
                                                <Upload size={28} />
                                            </div>
                                            
                                            {file ? (
                                                <>
                                                    <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Ready for synchronization</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm font-black text-slate-800">Drop Manifest File</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
                                                        Select .xlsx or .xls protocol <br/> from local terminal node
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex gap-4 pt-4">
                                        <button 
                                            onClick={onClose}
                                            className="flex-1 px-8 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all border-b-4 active:border-b-0 active:translate-y-1"
                                        >
                                            Abort
                                        </button>
                                        <button 
                                            disabled={!file || status !== 'idle'}
                                            onClick={handleUpload}
                                            className={`
                                                flex-[2] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border-b-4 active:border-b-0 active:translate-y-1
                                                ${!file || status !== 'idle' 
                                                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                                    : 'bg-primary-600 text-white border-primary-800 shadow-xl shadow-primary-600/20 hover:scale-[1.02]'}
                                            `}
                                        >
                                            {status === 'uploading' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                                            {status === 'uploading' ? 'Ingesting Nodes...' : 'Confirm & Upload'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ScheduleBulkUploadModal;

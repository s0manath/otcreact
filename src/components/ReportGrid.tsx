import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Loader2 } from 'lucide-react';

interface ReportGridProps {
    columns: string[];
    data: any[];
    isLoading: boolean;
}

const ReportGrid: React.FC<ReportGridProps> = ({ columns, data, isLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // Reset page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [data]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400 italic font-sans">Fetching system intelligence...</p>
            </div>
        );
    }

    if (!columns || columns.length === 0 || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                <Database className="w-12 h-12 text-slate-200 mb-4" />
                <p className="text-xl font-black text-slate-900 tracking-tight font-sans">No report data found</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic mt-2 font-sans">Try adjusting your filters for better results</p>
            </div>
        );
    }

    const totalRecords = data.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const pagedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col font-sans"
        >
            <div className="overflow-x-auto custom-scrollbar max-h-[600px]">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/30 sticky top-0 z-10 backdrop-blur-sm">
                            {columns.map((col) => (
                               <th key={col}className="px-8 py-6 text-[13px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
  {pagedData.map((row, idx) => (
    <tr
      key={idx}
      className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-none"
    >
      {columns.map((col) => (
        <td key={`${idx}-${col}`} className="px-8 py-5">
          <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
            {row[col]?.toString() || '-'}
          </span>
        </td>
      ))}
    </tr>
  ))}
</tbody>
                </table>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Records: <span className="text-slate-900 font-black italic">{totalRecords}</span>
                    </span>
                    <div className="h-4 w-px bg-slate-200 hidden sm:block" />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">
                        Generated at {new Date().toLocaleTimeString()}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        First
                    </button>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Prev
                    </button>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <span className="text-xs font-black text-slate-900">{currentPage}</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">of {totalPages || 1}</span>
                    </div>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                    <button 
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Last
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportGrid;

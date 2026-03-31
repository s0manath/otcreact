import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Download, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface MasterPageProps {
    title: string;
    subtitle?: string;
    data: any[];
    columns: { header: string; key: string; render?: (val: any, row: any) => React.ReactNode }[];
    onAdd?: () => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    loading?: boolean;
    extraActions?: React.ReactNode;
}

const MasterPage: React.FC<MasterPageProps> = ({ title, subtitle, data, columns, onAdd, onEdit, onDelete, loading, extraActions }) => {
    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h1>
                    {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                        <Download size={14} />
                        Export
                    </button>
                    <div className="flex gap-4">
                        {extraActions}
                        {onAdd && (
                            <button
                                onClick={onAdd}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:scale-105 transition-all flex items-center gap-3"
                            >
                                <Plus size={16} strokeWidth={3} />
                                New Record
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder={`Search ${title.toLowerCase()}...`}
                            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            <Filter size={14} />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                {columns.map((col, i) => (
                                    <th key={i} className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {col.header}
                                    </th>
                                ))}
                                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        {columns.map((_, j) => (
                                            <td key={j} className="py-8 px-6">
                                                <div className="h-2 bg-slate-100 rounded-full w-2/3"></div>
                                            </td>
                                        ))}
                                        <td className="py-8 px-6 text-right">
                                            <div className="h-6 w-6 bg-slate-50 rounded-lg ml-auto"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                                                <Search size={32} />
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-widest text-slate-300">No matching records found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {data.map((row, idx) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={idx}
                                            className="hover:bg-slate-50/50 transition-colors group"
                                        >
                                            {columns.map((col, i) => (
                                                <td key={i} className="py-4 px-6 text-sm">
                                                    {col.render ? col.render(row[col.key], row) : <span className="font-semibold text-slate-700">{row[col.key]}</span>}
                                                </td>
                                            ))}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => onEdit(row)}
                                                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(row)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Showing {data.length} entries</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 opacity-50 cursor-not-allowed">Prev</button>
                        <button className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg border border-primary-100">1</button>
                        <button className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MasterPage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Search,
    Calendar,
    Filter,
    RefreshCcw,
    Download,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import api from '../services/api';
import ReportGrid from '../components/ReportGrid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import JSZip from "jszip";

const REPORT_INFO: Record<string, { title: string, subtitle: string, icon: any }> = {
    'scheduled': { title: 'Scheduled Details Report', subtitle: 'Operations / Resource Planning', icon: Calendar },
    'route-details': { title: 'Route Mapped Report', subtitle: 'Logistics / Fleet Overview', icon: FileText },
    'otc-checkout': { title: 'OTC Checkout Report', subtitle: 'Operations / Compliance', icon: FileText },
    'otc-activity': { title: 'OTC Activity Detail Report', subtitle: 'Audit / Performance', icon: RefreshCcw },
    'audit': { title: 'Audit Logs Report', subtitle: 'Security / Traceability', icon: FileText },
    'atm-detail': { title: 'ATM Detail Report', subtitle: 'Inventory / Asset Registry', icon: FileText },
    'custodian-wise': { title: 'Custodian Wise Report', subtitle: 'Performance / Analytics', icon: RefreshCcw },
    'otc-reset': { title: 'OTC Reset Report', subtitle: 'Security / Access Control', icon: RefreshCcw },
};

const ReportPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const reportKey = type || 'scheduled';
    const info = REPORT_INFO[reportKey] || { title: 'System Report', subtitle: 'General / Intelligence', icon: FileText };

    // Filters
    const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

    // Data
    const [columns, setColumns] = useState<string[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, [type]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.post('/report/data', {
                reportType: reportKey,
                fromDate,
                toDate,
                username: 'admin'
            });
            setColumns(res.data.columns);
            setData(res.data.data);
        } catch (err) {
            console.error('Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    };

   
const handleExport = async () => {
  setLoading(true);

  try {
    if (!data || data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const totalRows = data.length;
    const today = new Date().toISOString().split("T")[0];

    /* =========================
       < 50K → SINGLE XLSX
    ========================= */
    if (totalRows < 50000) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");

      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buffer]), `${reportKey}_${today}.xlsx`);
      return;
    }

    /* =========================
       50K–200K → MULTI-SHEET XLSX
    ========================= */
    if (totalRows <= 200000) {
      const wb = XLSX.utils.book_new();
      const CHUNK = 50000;

      for (let i = 0; i < totalRows; i += CHUNK) {
        const ws = XLSX.utils.json_to_sheet(data.slice(i, i + CHUNK));
        XLSX.utils.book_append_sheet(wb, ws, `Sheet_${i / CHUNK + 1}`);
      }

      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(new Blob([buffer]), `${reportKey}_${today}.xlsx`);
      return;
    }

    /* =========================
       200K–500K → CSV ZIP ✅
    ========================= */
    if (totalRows <= 800000) {
      const zip = new JSZip();
      const headers = Object.keys(data[0]);
      const ROWS_PER_FILE = 100000;

      const escape = (v) =>
        `"${String(v ?? "").replace(/"/g, '""')}"`;

      for (let i = 0; i < totalRows; i += ROWS_PER_FILE) {
        let csv = headers.join(",") + "\n";
        const chunk = data.slice(i, i + ROWS_PER_FILE);

        for (let row of chunk) {
          csv += headers.map(h => escape(row[h])).join(",") + "\n";
        }

        zip.file(
          `${reportKey}_part_${i / ROWS_PER_FILE + 1}.csv`,
          csv
        );

        // Prevent browser freeze
        await new Promise(res => setTimeout(res, 0));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `${reportKey}_${today}_CSV.zip`);
      return;
    }

    /* =========================
       > 500K → BLOCK
    ========================= */
    alert(
      `Total Records: ${totalRows}. Please use backend export.`
    );

  } catch (err) {
    console.error(err);
    alert(`Failed to export report data. Total Records: ${data.length}`);
  } finally {
    setLoading(false);
  }
};


    return (
        <div className="space-y-6 pb-12 font-sans">
            {/* Header Action Bar */}
            <div className="px-8 pt-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                        <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{info.title}</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">{info.subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isFilterOpen
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm'}`}
                    >
                        <Filter size={16} />
                        Filter Data
                        {isFilterOpen ? <ChevronUp size={14} className="ml-1 opacity-60" /> : <ChevronDown size={14} className="ml-1 opacity-60" />}
                    </button>

                    <button
                        onClick={handleExport}
                        disabled={loading || data.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:border-slate-300 shadow-sm transition-all group disabled:opacity-50"
                    >
                        <Download size={16} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Collapsible Filter Panel */}
            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 overflow-hidden"
                    >
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date From</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date To</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quick Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search in results..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => fetchData()}
                                    className="w-full bg-primary-600 text-white rounded-xl py-2.5 px-8 text-xs font-black shadow-lg shadow-primary-600/30 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border border-primary-500/30 flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Generate
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="px-8">
                <ReportGrid
                    columns={columns}
                    data={data.filter(row => 
                        Object.values(row).some(val => 
                            String(val || '').toLowerCase().includes(searchTerm.toLowerCase())
                        )
                    )}
                    isLoading={loading}
                />
            </div>
        </div>
    );
};

export default ReportPage;

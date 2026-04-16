/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Monitor,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader2,
  Settings2,
  CheckCircle2,
  Clock,
  Tag,
  Eye,
  CloudDownload,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import RouteConfigureModal from "../components/RouteConfigureModal";
import Toast from "../components/Toast";
import { decrypt, encrypt } from "../utils/crypto-utils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RouteConfigure: React.FC = () => {
  const [isRangePopupOpen, setIsRangePopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString(),
  );
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const [filters, setFilters] = useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    region: "",
    district: "",
    franchise: "",
    zom: "",
    activityType: "",
    status: "",
    chkConfig: "",
    searchField: "None",
    searchValue: "",
  });

  const [selectedRoute, setSelectedRoute] = useState<{
    scheduleId: string;
    atmId: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Global filter and Pagination states
  const [globalSearch, setGlobalSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  useEffect(() => {
    fetchRouteData();
  }, []);

  const fetchRouteData = async () => {
    // --- Validation Logic ---
    const start = new Date(filters.dateFrom);
    const end = new Date(filters.dateTo);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Allow today

    // 1. Future Date Check
    if (start > today || end > today) {
      setToast({
        isVisible: true,
        message:
          "Future dates are not permitted. Please select a date on or before today.",
        type: "error",
      });
      return;
    }

    // 2. Date Range Check (max 1 month)
    const diffInMs = end.getTime() - start.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays > 31) {
      setToast({
        isVisible: true,
        message:
          "Date range cannot exceed 1 month (31 days). Please refine your search.",
        type: "error",
      });
      return;
    }

    if (diffInDays < 0) {
      setToast({
        isVisible: true,
        message: "To Date cannot be before From Date.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/route/list", {
        fromDate: filters.dateFrom,
        toDate: filters.dateTo,
        region: "",
        district: "",
        franchise: "",
        zom: "",
        activityType: "",
        status: "",
        chkConfig: "",
        searchField: "None",
        searchValue: "",
        username: "Likhith",
      });
      console.log("Fetched route data:", response.data);
      console.log("Applied filters:", decrypt(encrypt(filters)));
      setRouteData(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRangePopupOpen(false); // Close popup on success
    } catch (error) {
      console.error("Error fetching route data:", error);
      setToast({
        isVisible: true,
        message: "An error occurred while fetching route data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setLoading(true);

    try {
      console.log("Export API called with filters:", filters);

      const response = await api.post("/route/list", {
        fromDate: filters.dateFrom,
        toDate: filters.dateTo,
        region: "",
        district: "",
        franchise: "",
        zom: "",
        activityType: "",
        status: "",
        chkConfig: "",
        searchField: "None",
        searchValue: "",
        username: "Likhith",
      });

      const data = response.data;

      console.log("Export Data:", data);

      if (!data || data.length === 0) {
        setToast({
          isVisible: true,
          message: "No data available to export.",
          type: "error",
        });
        return;
      }

      const formattedData = data.map((item: any) => ({
        "Schedule ID": item.scheduleId,
        "ATM ID": item.atmId,
        "Activity Type": item.activityType,
        "Schedule Date": item.scheduleDate,
        Region: item.region,
        District: item.districtName,
        "Route Key": item.routeKey,
        Franchise: item.franchiseName,
        ZOM: item.zom,
        Status: item.status,
        "Custodian 1": item.custodian1,
        "Custodian 2": item.custodian2,
        "Cro Type": item.croType,
        "Created By": item.createdBy,
        "Created Date": item.createdDate,
        Comment: item.comment,
      }));
      console.log("Formatted Data for Excel:", formattedData);
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Routes");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const getFileName = () => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, "0");
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        return `Route_List_${dd}${mm}${yyyy}-${hh}${min}${ss}.xlsx`;
      };

      const fileName = getFileName();

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, fileName);

      console.log("Excel Export Successful");

      setToast({
        isVisible: true,
        message: "Excel exported successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Export Error:", error);

      setToast({
        isVisible: true,
        message: "Failed to export data.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "Schedule ID",
      key: "scheduleId",
      render: (val: any, _row: any) => (
        <span className="font-bold text-slate-800 text-sm tracking-tight capitalize">
          {val}
        </span>
      ),
    },
    {
      header: "ATM ID",
      key: "atmId",
      render: (val: any, _row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
            <Monitor size={14} />
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight">
            {val}
          </span>
        </div>
      ),
    },
    { header: "Activity Type", key: "activityType" },
    {
      header: "Schedule Date",
      key: "scheduleDate",
      render: (val: any, _row: any) => (
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 italic">
          <Calendar size={10} className="text-slate-300" />
          {val}
        </div>
      ),
    },
    { header: "District Name", key: "districtName" },
    {
      header: "Route Key",
      key: "routeKey",
      render: (val: any, _row: any) => (
        <span className="text-[11px] font-black text-slate-900 border border-slate-100 bg-slate-50 px-2 py-0.5 rounded uppercase tracking-widest">
          {val || "N/A"}
        </span>
      ),
    },
    {
      header: "Custodian 1",
      key: "custodian1",
      render: (val: any, _row: any) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">
            {val || "Unassigned"}
          </span>
        </div>
      ),
    },
    {
      header: "Custodian 2",
      key: "custodian2",
      render: (val: any, _row: any) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[100px]">
            {val || "Unassigned"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (val: any, _row: any) => (
        <div className="flex items-center gap-2">
          {val === "OTC Checkout" ? (
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic transition-all">
              <CheckCircle2 size={10} className="stroke-[3]" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                {val}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 italic transition-all">
              <Clock size={10} className="stroke-[3]" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                {val}
              </span>
            </div>
          )}
        </div>
      ),
    },
    { header: "CRO Type", key: "croType" },
  ];

  // Global filtering and Pagination logic
  const filteredData = routeData.filter((item) => {
    const searchStr =
      `${item.scheduleId} ${item.atmId} ${item.activityType} ${item.scheduleDate} ${item.croType} {} ${item.routeKey} ${item.custodian1} ${item.custodian2}  ${item.districtName}`.toLowerCase();
    return searchStr.includes(globalSearch.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDownload = (row: any) => {
    console.log("Downloading attachment for:", row.atmId);
    alert(
      `Downloading attachment for ATM: ${row.atmId} (Available in Production)`,
    );
  };

  const handlePreview = (row: any) => {
    console.log("Previewing:", row.atmId);
    alert(`Opening Preview for ATM: ${row.atmId} (Implemented for Production)`);
  };

  const handleEdit = (scheduleId: string, atmId: string) => {
    setSelectedRoute({ scheduleId, atmId });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="px-8 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Route Configure
            </h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
              Operations / Managed Routes
            </p>
          </div>
          <button
            onClick={fetchRouteData}
            className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-white hover:border-primary-500 transition-all active:scale-95 shadow-sm"
            title="Resync Data"
          >
            <div
              className={`w-2 h-2 rounded-full bg-emerald-500 ${loading ? "animate-pulse" : ""}`}
            />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary-600">
              Last Sync: {lastUpdated}
            </span>
            <Loader2
              size={10}
              className={`text-slate-400 group-hover:text-primary-500 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
              <Filter size={14} />
            </div>
            <input
              type="text"
              placeholder="Global Search..."
              className="bg-white border border-slate-200 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold text-slate-700 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 transition-all w-64 shadow-sm"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:border-slate-300 shadow-sm transition-all active:scale-95"
          >
            <FileText size={16} className="text-emerald-500" />
            Export
          </button>

          <div className="relative">
            <button
              onClick={() => setIsRangePopupOpen(!isRangePopupOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                isRangePopupOpen
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <Calendar
                size={16}
                className={
                  isRangePopupOpen ? "text-primary-400" : "text-slate-400"
                }
              />
              Date Range
              {isRangePopupOpen ? (
                <ChevronUp size={14} className="ml-1 opacity-60" />
              ) : (
                <ChevronDown size={14} className="ml-1 opacity-60" />
              )}
            </button>

            <AnimatePresence>
              {isRangePopupOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">
                        From
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={14}
                        />
                        <input
                          type="date"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white outline-none"
                          value={filters.dateFrom}
                          onChange={(e) =>
                            setFilters({ ...filters, dateFrom: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">
                        To
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={14}
                        />
                        <input
                          type="date"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-700 focus:bg-white outline-none"
                          value={filters.dateTo}
                          onChange={(e) =>
                            setFilters({ ...filters, dateTo: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={fetchRouteData}
                      className="w-full bg-primary-600 text-white rounded-xl py-3 text-xs font-black uppercase tracking-widest hover:bg-primary-700 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <Loader2
                        size={14}
                        className={loading ? "animate-spin" : "hidden"}
                      />
                      Apply Filter
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-black shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-95">
            <Plus size={16} />
            Bulk Upload
          </button>
        </div>
      </div>

      <div className="px-8 relative mb-6">
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        )}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse min-w-[1400px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right sticky right-0 bg-slate-50/30 backdrop-blur-md border-l border-slate-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-slate-50/50 transition-all border-b border-slate-50 last:border-none"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                        {col.render ? (
                          col.render(row[col.key as keyof typeof row], row)
                        ) : (
                          <span className="text-[11px] font-bold text-slate-600 tracking-tight">
                            {row[col.key as keyof typeof row] || "-"}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right sticky right-0 bg-white/80 group-hover:bg-slate-50/80 backdrop-blur-md border-l border-slate-100 shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handlePreview(row)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(row)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Download"
                        >
                          <CloudDownload size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(row.scheduleId, row.atmId)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Configure"
                        >
                          <Settings2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginatedData.length === 0 && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-400 gap-4">
              <Tag size={48} className="opacity-10 rotate-12" />
              <p className="text-xs font-black uppercase tracking-widest italic text-center">
                No routes found matching your filters
                <br />
                <span className="text-[10px] opacity-60">
                  Try adjusting your search or advanced filters
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-8 pb-12 flex items-center justify-between">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Basic logic to show only relevant page numbers if many
                if (
                  totalPages > 5 &&
                  Math.abs(pageNum - currentPage) > 2 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages
                )
                  return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${
                      currentPage === pageNum
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <RouteConfigureModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        scheduleId={selectedRoute?.scheduleId || ""}
        atmId={selectedRoute?.atmId || ""}
        onSuccess={fetchRouteData}
      />

      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default RouteConfigure;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

import {
  Calendar as CalendarIcon,
  Monitor,
  CheckCircle2,
  RefreshCw,
  Clock,
  Route,
  TrendingUp,
  Search,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import api from "../services/api";

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [viewDate, setViewDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [districtReport, setDistrictReport] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchAllData();
  }, [selectedDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const params = { date: selectedDate, username: "Likhith" };
      const [summaryRes, chartRes, reportRes] = await Promise.all([
        api.get("/dashboard/summary", { params }),
        api.get("/dashboard/chart", { params }),
        api.get("/dashboard/district-report", { params }),
      ]);

      setSummary(summaryRes.data);
      setChartData(chartRes.data);
      setDistrictReport(reportRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "ATM Schedule",
      value: summary?.total || 0,
      icon: <CalendarIcon size={20} />,
      color: "bg-[#24b8dd]",
    },
    {
      label: "OTC Completed",
      value: summary?.completed || 0,
      icon: <CheckCircle2 size={20} />,
      color: "bg-[#1bcf8d]",
    },
    {
      label: "OTC Reset & Completed",
      value: summary?.reset || 0,
      icon: <RefreshCw size={20} />,
      color: "bg-[#e9494c]",
    },
    {
      label: "OTC Pending",
      value: summary?.pending || 0,
      icon: <Clock size={20} />,
      color: "bg-[#6258ff]",
    },
  ];

  const filteredReport = districtReport.filter((item) =>
    item["District Name"]?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // pagination logic
  const totalPages = Math.ceil(filteredReport.length / itemsPerPage);

  const paginatedData = filteredReport.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const COLORS = ["#6366f1", "#ec4899", "#22c55e", "#f59e0b"];

  // Prepare chart data (important)

  const Card = ({ label, value, icon, color }: any) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group cursor-pointer"
    >
      <div
        className={`absolute top-0 right-0 w-32 h-32 ${color}/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110`}
      />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-current/20`}
        >
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
          {label}
        </p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 space-y-8 min-h-full bg-[#f8fafc]">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Calendar */}
        <div className="lg:col-span-4 translate-z-0">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 h-full flex flex-col items-center">
            <div className="w-full mb-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                System Calendar
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                Viewing Operations for{" "}
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="w-full flex items-center justify-between mb-4 px-2">
              <button
                onClick={() =>
                  setViewDate(
                    new Date(
                      viewDate.getFullYear(),
                      viewDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                {viewDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() =>
                  setViewDate(
                    new Date(
                      viewDate.getFullYear(),
                      viewDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="w-full grid grid-cols-7 gap-1 text-center mb-8 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
              {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                <div
                  key={d}
                  className="text-[10px] font-black text-slate-300 py-2"
                >
                  {d}
                </div>
              ))}
              {(() => {
                const year = viewDate.getFullYear();
                const month = viewDate.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();

                const days = [];
                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`pad-${i}`} />);
                }
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                  const isSelected = selectedDate === dateStr;
                  const isToday =
                    new Date().toISOString().split("T")[0] === dateStr;

                  days.push(
                    <button
                      key={d}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                                                relative py-2.5 text-xs font-bold rounded-xl transition-all
                                                ${
                                                  isSelected
                                                    ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-110 z-10"
                                                    : "text-slate-600 hover:bg-white hover:text-primary-600"
                                                }
                                            `}
                    >
                      {d}
                      {isToday && !isSelected && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                      )}
                    </button>,
                  );
                }
                return days;
              })()}
            </div>

            <button
              onClick={fetchAllData}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <TrendingUp size={16} />
              Refresh Live Data
            </button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[2.5rem]">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          )}
          {stats.map((stat, idx) => (
            <Card key={idx} {...stat} />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12">
        {/* District Table */}
        <div className="xl:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          )}
          <div className="p-8 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                District Performance
              </h2>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                Regional drill-down details
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter district..."
                className="bg-transparent border-none text-[10px] font-bold focus:outline-none w-32"
              />
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    District Name
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Total
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Completed
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Reset
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Pending
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((district: any, idx: number) => (
                  <tr
                    key={idx}
                    className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          <MapPin size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {district["District Name"]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-black text-slate-500">
                        {district.Total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-emerald-600">
                        {district.Completed}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-amber-600">
                        {district["Reset and Completed"]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                        {district.Skipped}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-xs font-bold bg-slate-100 rounded-lg disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-xs font-bold bg-slate-100 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="xl:col-span-4 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col relative min-h-[400px]">
          {/* Loader */}
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">
            System Distribution
          </h2>

          {/* Chart Container */}
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Pie */}
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="Value"
                >
                  {chartData.map((entry, index) => {
                    const colorMap: any = {
                      Completed: "#10b981", // green
                      Pending: "#f59e0b", // amber
                    };

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colorMap[entry.Name] || COLORS[index % COLORS.length]
                        }
                      />
                    );
                  })}
                </Pie>

                {/* Tooltip */}
                <Tooltip
                  formatter={(value: any, _name: any, props: any) => [
                    `${value}`,
                    props.payload.Name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />

                {/* Legend */}
                <Legend
                  verticalAlign="bottom"
                  formatter={(value: any, entry: any) => (
                    <span className="text-xs font-semibold text-slate-600">
                      {entry.payload.Name}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">
                {summary?.total || 0}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                Total
              </span>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Overall Efficiency
                </p>
                <p className="text-2xl font-black text-slate-900">
                  {summary?.total
                    ? Math.round((summary.completed / summary.total) * 100)
                    : 0}
                  %
                </p>
              </div>

              <div className="text-emerald-500 bg-emerald-50 p-2 rounded-lg">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

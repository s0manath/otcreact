import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Monitor,
  LogOut,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Settings,
  MapPin,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const MenuLink = ({ icon, label, path }: any) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
          active
            ? "bg-primary-50 text-primary-600 border border-primary-100 shadow-sm"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`}
      >
        {icon}
        <span className={`font-medium text-sm ${active ? "font-bold" : ""}`}>
          {label}
        </span>
      </button>
    );
  };

  const SubMenuLink = ({ label, path }: { label: string; path: string }) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2 text-xs font-semibold tracking-wide transition-colors ml-9 border-l-2 ${
          active
            ? "text-primary-600 border-primary-400"
            : "text-slate-500 hover:text-primary-600 border-slate-100"
        }`}
      >
        <span>{label}</span>
        {active && <ChevronRight size={10} />}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen overflow-y-auto hide-scrollbar">
        <div className="p-6 flex items-center gap-3 border-b border-slate-50 mb-4 sticky top-0 bg-white z-10 font-black italic">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Monitor className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">
            OTC Portal
          </span>
        </div>

        <div className="flex-1 px-4 py-2 space-y-6">
          <div>
            {/* <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 italic">Navigation</p> */}
            <div className="space-y-1">
              <MenuLink
                icon={<LayoutDashboard size={18} />}
                label="Home Dashboard"
                path="/dashboard"
              />
              <MenuLink
                icon={<TrendingUp size={18} />}
                label="Schedule Visit"
                path="/schedule"
              />
              <MenuLink
                icon={<MapPin size={18} />}
                label="Route Configure"
                path="/route"
              />
            </div>
          </div>

          <div>
            {/* <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 italic">Reporting</p> */}
            <div className="space-y-1">
              <button
                onClick={() => setIsReportsOpen(!isReportsOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isReportsOpen ? "text-slate-900 font-black" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span className="text-sm uppercase tracking-wide">
                    System Reports
                  </span>
                </div>
                {isReportsOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>

              <AnimatePresence>
                {isReportsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <SubMenuLink
                      label="ATM Detail Report"
                      path="/reports/atm-detail"
                    />
                    <SubMenuLink
                      label="Scheduled Details Report"
                      path="/reports/scheduled"
                    />
                    <SubMenuLink
                      label="Route Details Report"
                      path="/reports/route-details"
                    />
                    <SubMenuLink
                      label="OTC Checkout Report"
                      path="/reports/otc-checkout"
                    />
                    <SubMenuLink
                      label="OTC Activity Report"
                      path="/reports/otc-activity"
                    />
                    <SubMenuLink
                      label="Custodian Wise Report"
                      path="/reports/custodian-wise"
                    />
                    <SubMenuLink label="Audit Report" path="/reports/audit" />
                    <SubMenuLink
                      label="OTC Reset Report"
                      path="/reports/otc-reset"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div>
            {/* <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 italic">Administration</p> */}
            <div className="space-y-1">
              <button
                onClick={() => setIsAdminOpen(!isAdminOpen)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isAdminOpen ? "text-slate-900 font-black" : "text-slate-500 hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="text-sm uppercase tracking-wide">
                    Admin Masters
                  </span>
                </div>
                {isAdminOpen ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </button>

              <AnimatePresence>
                {isAdminOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <SubMenuLink label="Bank Master" path="/bank-master" />
                    <SubMenuLink label="Login Master" path="/login-master" />
                    <SubMenuLink label="Role Master" path="/masters/roles" />
                    <SubMenuLink
                      label="Custodian Master"
                      path="/masters/custodians"
                    />
                    <SubMenuLink label="ATM Master" path="/masters/atms" />
                    <SubMenuLink
                      label="Location Master"
                      path="/masters/locations"
                    />
                    <SubMenuLink
                      label="Franchise Master"
                      path="/masters/franchises"
                    />
                    <SubMenuLink label="State Master" path="/masters/states" />
                    <SubMenuLink
                      label="District Master"
                      path="/masters/districts"
                    />
                    <SubMenuLink label="ZOM Master" path="/masters/zoms" />
                    <SubMenuLink
                      label="Region Master"
                      path="/masters/regions"
                    />
                    <SubMenuLink
                      label="Route Master (Admin)"
                      path="/masters/route-admin"
                    />
                    <SubMenuLink label="Key Inventory" path="/masters/keys" />
                    <SubMenuLink
                      label="One Line Master"
                      path="/masters/one-line"
                    />
                    <SubMenuLink
                      label="Site Access Master"
                      path="/masters/site-access"
                    />
                    <SubMenuLink
                      label="Custodian Mappings"
                      path="/masters/mappings/custodian"
                    />
                    <SubMenuLink
                      label="ZOM Mappings"
                      path="/masters/mappings/zom"
                    />
                    <SubMenuLink
                      label="Login Requests"
                      path="/masters/requests"
                    />
                    <SubMenuLink
                      label="Route Mapping Utility"
                      path="/masters/route-mapping"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-50 mt-auto bg-slate-50/50">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden flex flex-col">
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              OTC Modern Intelligence
            </h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
              System v2.1.0-Stable
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden lg:flex items-center bg-slate-50 rounded-full px-4 py-2 border border-slate-200 w-80 shadow-inner group">
              <Search
                size={16}
                className="text-slate-400 mr-2 group-focus-within:text-primary-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Search parameters..."
                className="bg-transparent border-none focus:outline-none text-xs w-full text-slate-700 font-semibold"
              />
            </div>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="flex flex-col items-end mr-3">
                <span className="text-xs font-black text-slate-900">
                  Administrator
                </span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  Online
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>
      </main>
    </div>
  );
};

export default Layout;

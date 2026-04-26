import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Phone,
  Hash,
  Shield,
  Users,
  CheckCircle2,
  X,
  ChevronRight,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import masterService, {
  type FranchiseMaster,
  type MasterDropdownItem,
} from "../services/masterService";

const FranchiseMasterForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<FranchiseMaster>({
    id: 0,
    franchiseName: "",
    mobileNumber: "",
    emailId: "",
    sapCode: "",
    secondaryCustodianRequire: false,
    stateId: undefined,
    districtId: undefined,
    isActive: true,
  });

  const [states, setStates] = useState<MasterDropdownItem[]>([]);
  const [districts, setDistricts] = useState<MasterDropdownItem[]>([]);
  const [loading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadStates();
    if (isEdit) {
      // loadFranchise();
    }
  }, [id]);

  const loadStates = async () => {
    try {
      const data = await masterService.getStates();
      setStates(data);
    } catch (error) {
      console.error("Error loading states:", error);
    }
  };

  // const loadFranchise = async () => {
  //     try {
  //         setLoading(true);
  //         const data = await masterService.getFranchise(parseInt(id!));
  //         setForm(data);
  //         if (data.stateId) {
  //             loadDistricts(data.stateId);
  //         }
  //     } catch (error) {
  //         console.error('Error loading franchise:', error);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const loadDistricts = async (stateId: number) => {
    try {
      const data = await masterService.getDistricts(stateId);
      setDistricts(data);
    } catch (error) {
      console.error("Error loading districts:", error);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = parseInt(e.target.value);
    setForm({ ...form, stateId, districtId: undefined });
    if (stateId) {
      loadDistricts(stateId);
    } else {
      setDistricts([]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      await masterService.saveFranchise(form);
      navigate("/masters/franchises");
    } catch (error) {
      console.error("Error saving franchise:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Loading Node Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full"></div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate("/masters/franchises")}
                className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-indigo-500 transition-all"
              >
                <ArrowLeft
                  size={14}
                  className="text-slate-400 group-hover:text-indigo-500 transition-colors"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-600">
                  Franchise Inventory
                </span>
              </button>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              {isEdit ? "Reconfigure" : "Authorize"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Regional Franchise.
              </span>
            </h1>
            <p className="text-slate-500 font-bold text-lg max-w-xl">
              {isEdit
                ? `Updating organizational parameters for: ${form.franchiseName}`
                : "Establish a new regional node to expand operational jurisdiction."}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/masters/franchises")}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-sm flex items-center gap-3 z-10 group"
          >
            <span
              className="text-xs font-black uppercase tracking-widest"
              title="Exit without saving"
            >
              Discard
            </span>
            <X size={20} />
          </motion.button>
        </div>

        <form
          onSubmit={handleSave}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Primary Configuration */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                  <Building2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Organization Profile
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 01 / Legal Entity
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Franchise Designation
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                      <Building2 size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.franchiseName}
                      onChange={(e) =>
                        setForm({ ...form, franchiseName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all placeholder:text-slate-300 uppercase"
                      placeholder="Enter Legal Entity Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    SAP ERP Code
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                      <Hash size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.sapCode}
                      onChange={(e) =>
                        setForm({ ...form, sapCode: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all placeholder:text-slate-300"
                      placeholder="SAP_XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Official Hotline
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      required
                      value={form.mobileNumber}
                      onChange={(e) =>
                        setForm({ ...form, mobileNumber: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all placeholder:text-slate-300"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Digital Protocol (Email)
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={form.emailId}
                      onChange={(e) =>
                        setForm({ ...form, emailId: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all placeholder:text-slate-300"
                      placeholder="admin@node.local"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Globe size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Jurisdictional Mapping
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 02 / Geography
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    State Node
                  </label>
                  <div className="relative">
                    <select
                      value={form.stateId || ""}
                      onChange={handleStateChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all appearance-none"
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    District Node
                  </label>
                  <div className="relative">
                    <select
                      value={form.districtId || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          districtId: parseInt(e.target.value),
                        })
                      }
                      disabled={!form.stateId}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all appearance-none disabled:opacity-40 shadow-inner"
                    >
                      <option value="">Select District</option>
                      {districts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {dist.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Operational Protocols */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 h-full flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <Shield size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Logic Control
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 03 / Protocol & State
                  </p>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div
                  onClick={() =>
                    setForm({
                      ...form,
                      secondaryCustodianRequire:
                        !form.secondaryCustodianRequire,
                    })
                  }
                  className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col gap-4 group ${
                    form.secondaryCustodianRequire
                      ? "bg-amber-50 border-amber-200 shadow-inner"
                      : "bg-white border-slate-100 hover:border-amber-200 hover:bg-amber-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.secondaryCustodianRequire ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400 group-hover:text-amber-500"}`}
                    >
                      <Users size={20} />
                    </div>
                    {form.secondaryCustodianRequire && (
                      <CheckCircle2 size={16} className="text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      Dual-Auth Mode
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Requires secondary custodian signature
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col gap-4 group ${
                    form.isActive
                      ? "bg-emerald-50 border-emerald-200 shadow-inner"
                      : "bg-rose-50 border-rose-200 shadow-inner"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.isActive ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}
                    >
                      <Shield size={20} />
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full relative transition-all ${form.isActive ? "bg-emerald-200" : "bg-rose-200"}`}
                    >
                      <div
                        className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${form.isActive ? "right-1" : "left-1"}`}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900 uppercase tracking-widest">
                      Operational State
                    </div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${form.isActive ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {form.isActive
                        ? "Live / Distributed"
                        : "Offline / Restricted"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {saveLoading ? (
                    "Syncing..."
                  ) : (
                    <>
                      {isEdit ? "Authorize Changes" : "Execute Creation"}
                      <Save size={18} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/masters/franchises")}
                  className="w-full py-4 text-slate-400 hover:text-slate-600 text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  Cancel Operations
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FranchiseMasterForm;

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Clock,
  Key,
  Image as ImageIcon,
  ChevronRight,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import masterService, {
  type CustodianMaster,
  type MasterDropdownItem,
} from "../services/masterService";

const CustodianMasterForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState<CustodianMaster>({
    id: 0,
    custodianName: "",
    mobileNumber: "",
    emailId: "",
    locationId: undefined,
    zomId: undefined,
    franchiseId: undefined,
    custodianCode: "",
    touchKeyId: "",
    accessFrom: "",
    accessTo: "",
    iemiNo: "",
    profileImage: "",
    isActive: true,
  });

  const [locations, setLocations] = useState<MasterDropdownItem[]>([]);
  const [zoms, setZoms] = useState<MasterDropdownItem[]>([]);
  const [franchises, setFranchises] = useState<MasterDropdownItem[]>([]);
  const [routeKeys, setRouteKeys] = useState<MasterDropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    loadDropdowns();
    if (isEdit) {
      loadCustodian();
    }
  }, [id]);

  const loadDropdowns = async () => {
    try {
      const [locData, zomData, franData, routeKeyData] = await Promise.all([
        masterService.getLocations(),
        masterService.getZoms(),
        masterService.getFranchisesDropdown(),
        masterService.getCustodianRouteKeys(),
      ]);
      setLocations(locData);
      setZoms(zomData);
      setFranchises(franData);
      setRouteKeys(routeKeyData);
    } catch (error) {
      console.error("Error loading dropdowns:", error);
    }
  };

  const loadCustodian = async () => {
    try {
      setLoading(true);
      const data = await masterService.getCustodian(parseInt(id!));
      console.log(data);
      // setForm(data);
    } catch (error) {
      console.error("Error loading custodian:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveLoading(true);
      await masterService.saveCustodian(form);
      navigate("/masters/custodians");
    } catch (error) {
      console.error("Error saving custodian:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Loading Entity Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans selection:bg-primary-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/5 blur-[100px] rounded-full"></div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate("/masters/custodians")}
                className="group flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-primary-500 transition-all"
              >
                <ArrowLeft
                  size={14}
                  className="text-slate-400 group-hover:text-primary-500 transition-colors"
                />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-primary-600">
                  Back to Analytics
                </span>
              </button>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
              {isEdit ? "Refine" : "Initialize"} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                Custodian Profile.
              </span>
            </h1>
            <p className="text-slate-500 font-bold text-lg max-w-xl">
              {isEdit
                ? `Updating operational credentials for: ${form.custodianName}`
                : "Establish a new field operative within the central management node."}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/masters/custodians")}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 rounded-2xl transition-all shadow-sm flex items-center gap-3 z-10 group"
          >
            <span className="text-xs font-black uppercase tracking-widest">
              Discard
            </span>
            <X size={20} />
          </motion.button>
        </div>

        <form
          onSubmit={handleSave}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Panel: Primary Context */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                  <User size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Core Identity
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 01 / Basic Data
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Operative Name
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.custodianName}
                      onChange={(e) =>
                        setForm({ ...form, custodianName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="Full legal name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Contact Link (Mobile)
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      required
                      value={form.mobileNumber}
                      onChange={(e) =>
                        setForm({ ...form, mobileNumber: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Digital Protocol (Email)
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={form.emailId}
                      onChange={(e) =>
                        setForm({ ...form, emailId: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="auth@node.local"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Terminal Link (UUID)
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                      <Shield size={18} />
                    </div>
                    <input
                      type="text"
                      value={form.iemiNo}
                      onChange={(e) =>
                        setForm({ ...form, iemiNo: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="IEMI / UUID Node"
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
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Node Associations
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 02 / Territory
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Location Node
                  </label>
                  <div className="relative">
                    <select
                      value={form.locationId || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          locationId: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all appearance-none"
                    >
                      <option value="">Select Node</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
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
                    Zone Manager
                  </label>
                  <div className="relative">
                    <select
                      value={form.zomId || ""}
                      onChange={(e) =>
                        setForm({ ...form, zomId: parseInt(e.target.value) })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all appearance-none"
                    >
                      <option value="">Select ZOM</option>
                      {zoms.map((zom) => (
                        <option key={zom.id} value={zom.id}>
                          {zom.name}
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
                    Route Key Selection (Helper)
                  </label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const [_rk, cid, tk] = val.split("|");
                        setForm({
                          ...form,
                          custodianCode: cid,
                          touchKeyId: tk,
                        });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all appearance-none"
                    >
                      <option value="">Quick Select...</option>
                      {routeKeys.map((rk) => (
                        <option key={rk.id} value={rk.id}>
                          {rk.name}
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
                    Parent Franchise
                  </label>
                  <div className="relative">
                    <select
                      value={form.franchiseId || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          franchiseId: parseInt(e.target.value),
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all appearance-none"
                    >
                      <option value="">Select Franchise</option>
                      {franchises.map((fran) => (
                        <option key={fran.id} value={fran.id}>
                          {fran.name}
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
                    Operative ID (CID)
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                      <Shield size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      value={form.custodianCode}
                      onChange={(e) =>
                        setForm({ ...form, custodianCode: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="CID_XXXX"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Panel: Supplementary Data */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 h-full flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <Key size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                    Digital Auth Tools
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Step 03 / Hardware & Time
                  </p>
                </div>
              </div>

              <div className="space-y-8 flex-1">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    Hardware ID (Touch Key)
                  </label>
                  <div className="group/input relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                      <Key size={18} />
                    </div>
                    <input
                      type="text"
                      value={form.touchKeyId}
                      onChange={(e) =>
                        setForm({ ...form, touchKeyId: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all placeholder:text-slate-300"
                      placeholder="TK_ID_XXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Access Start
                    </label>
                    <div className="group/input relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                        <Clock size={16} />
                      </div>
                      <input
                        type="datetime-local"
                        value={form.accessFrom}
                        onChange={(e) =>
                          setForm({ ...form, accessFrom: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Access Termination
                    </label>
                    <div className="group/input relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-primary-500 transition-colors">
                        <Clock size={16} />
                      </div>
                      <input
                        type="datetime-local"
                        value={form.accessTo}
                        onChange={(e) =>
                          setForm({ ...form, accessTo: e.target.value })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-4 block">
                    Visual Profile
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:border-primary-300 shadow-inner">
                      {form.profileImage ? (
                        <img
                          src={form.profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-slate-200 group-hover:text-primary-300 transition-colors" />
                        </>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title="Upload operater photo"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                        Biometric Photo
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        PNG/JPG up to 2MB
                      </p>
                      <div className="flex gap-4 mt-3">
                        <button
                          type="button"
                          className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-700"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-6">
                <button
                  type="button"
                  onClick={() => navigate("/masters/custodians")}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-1 px-12 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                >
                  {saveLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      {isEdit ? "Commit Updates" : "Authorize Deployment"}
                      <Save
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustodianMasterForm;

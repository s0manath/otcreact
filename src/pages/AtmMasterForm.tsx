import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Building,
    MapPin,
    Calendar,
    Settings,
    Shield,
    Activity,
    Database,
    ChevronRight,
    Monitor,
    Cpu,
    Lock,
    MessageSquare,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import masterService, { type AtmMaster, type MasterDropdownItem } from '../services/masterService';

const AtmMasterForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;

    const [form, setForm] = useState<AtmMaster>({
        atmId: '',
        aliasAtmId: '',
        bank: '',
        siteId: '',
        site: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        region: '',
        location: '',
        installDate: '',
        atmCategory: '',
        model: '',
        loiCode: '',
        keyNumber: '',
        serialNo: '',
        comments: '',
        atmStatus: 'In Service',
        atmType: 'Standard',
        franchise: '',
        latitude: '',
        longitude: '',
        zom: '',
        custodian1: '',
        custodian2: '',
        custodian3: '',
        routeKey: '',
        croType: '',
        geoTagRequired: false,
        isActive: true
    });

    const [locations, setLocations] = useState<MasterDropdownItem[]>([]);
    const [zoms, setZoms] = useState<MasterDropdownItem[]>([]);
    const [franchises, setFranchises] = useState<MasterDropdownItem[]>([]);
    const [routeKeys, setRouteKeys] = useState<MasterDropdownItem[]>([]);
    const [croTypes, setCroTypes] = useState<MasterDropdownItem[]>([]);
    const [states, setStates] = useState<MasterDropdownItem[]>([]);
    const [custodians, setCustodians] = useState<MasterDropdownItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'site' | 'hardware' | 'mapping'>('site');

    useEffect(() => {
        loadDropdowns();
        if (isEdit) {
            loadAtm();
        }
    }, [id]);

    const loadDropdowns = async () => {
        try {
            const [locData, zomData, franData, routeKeyData, stateData, croData, custData] = await Promise.all([
                masterService.getLocations(),
                masterService.getZoms(),
                masterService.getFranchisesDropdown(),
                masterService.getRouteKeys(),
                masterService.getStates(),
                masterService.getCroTypes(),
                masterService.getCustodiansDropdown()
            ]);
            setLocations(locData);
            setZoms(zomData);
            setFranchises(franData);
            setRouteKeys(routeKeyData);
            setStates(stateData);
            setCroTypes(croData);
            setCustodians(custData);
        } catch (error) {
            console.error('Error loading dropdowns:', error);
        }
    };

    const loadAtm = async () => {
        try {
            setLoading(true);
            const data = await masterService.getAtm(id!);
            setForm(data);
        } catch (error) {
            console.error('Error loading ATM:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaveLoading(true);
            await masterService.saveAtm(form);
            navigate('/masters/atms');
        } catch (error) {
            console.error('Error saving ATM:', error);
        } finally {
            setSaveLoading(false);
        }
    };

    const tabs = [
        { id: 'site', label: 'Site Profile', icon: Building, detail: 'Location & Identity' },
        { id: 'hardware', label: 'Hardware Spec', icon: Cpu, detail: 'Device Configuration' },
        { id: 'mapping', label: 'Network Mapping', icon: Zap, detail: 'Logic & Service' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Syncing Terminal Node...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 lg:p-12 font-sans selection:bg-blue-500/30">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 relative">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full"></div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative z-10 flex-1"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => navigate('/masters/atms')}
                                className="group flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm hover:border-blue-500 transition-all font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-blue-600"
                            >
                                <ArrowLeft size={14} className="text-slate-400 group-hover:-translate-x-1 transition-all" />
                                Back to Hub
                            </button>
                            <div className="h-1 w-8 bg-slate-200 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Terminal ID: {form.atmId || 'NEW_NODE'}</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                            {isEdit ? 'Re-Engineer' : 'Initialize'} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Terminal Node.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-lg max-w-2xl leading-relaxed">
                            {isEdit ? `Modifying architectural parameters for terminal link: ${form.atmId}` : 'Register a new endpoint into the primary distribution network.'}
                        </p>
                    </motion.div>

                    {/* Desktop Tabs */}
                    <div className="hidden lg:flex items-center gap-2 bg-white p-2 border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-200/40 relative z-10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-[1.8rem] transition-all relative overflow-hidden group ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                                    : 'text-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon size={20} strokeWidth={2.5} className={activeTab === tab.id ? 'text-blue-400' : 'text-slate-300 group-hover:text-slate-900 transition-colors'} />
                                <div className="text-left">
                                    <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{tab.label}</div>
                                    <div className={`text-[8px] font-bold uppercase tracking-widest opacity-40 ${activeTab === tab.id ? 'text-blue-200' : 'text-slate-400'}`}>{tab.detail}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Mobile Tabs */}
                    <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 relative z-10 scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-full whitespace-nowrap border transition-all ${activeTab === tab.id
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20'
                                    : 'bg-white border-slate-200 text-slate-500'
                                    }`}
                            >
                                <tab.icon size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSave} className="relative z-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'site' && (
                            <motion.div
                                key="site"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >
                                {/* Site ID & Identity */}
                                <div className="lg:col-span-12">
                                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                                                <Monitor size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Site Identity</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Architectural Node Context</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Terminal ID</label>
                                                <input
                                                    type="text"
                                                    required
                                                    disabled={isEdit}
                                                    value={form.atmId}
                                                    onChange={e => setForm({ ...form, atmId: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all placeholder:text-slate-300 uppercase disabled:opacity-40"
                                                    placeholder="TID_XXX"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Alias ID</label>
                                                <input
                                                    type="text"
                                                    value={form.aliasAtmId}
                                                    onChange={e => setForm({ ...form, aliasAtmId: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all placeholder:text-slate-300"
                                                    placeholder="Secondary Link"
                                                />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Financial Institute (Bank)</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-500 transition-colors">
                                                        <Building size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={form.bank}
                                                        onChange={e => setForm({ ...form, bank: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all placeholder:text-slate-300"
                                                        placeholder="Enter Bank Name"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Geographic Information */}
                                <div className="lg:col-span-12">
                                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 mt-4">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                                <MapPin size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Geographic Link</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical Deployment Data</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                            <div className="lg:col-span-2 space-y-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Site Designation</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={form.site}
                                                        onChange={e => setForm({ ...form, site: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all placeholder:text-slate-300"
                                                        placeholder="Functional site name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Precise Terminal Locality (Address)</label>
                                                    <textarea
                                                        rows={4}
                                                        required
                                                        value={form.address}
                                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] py-4 px-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all placeholder:text-slate-300"
                                                        placeholder="Full legal deployment address..."
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2 col-span-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">State Node</label>
                                                        <div className="relative">
                                                            <select
                                                                value={form.state}
                                                                onChange={e => setForm({ ...form, state: e.target.value })}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all appearance-none"
                                                            >
                                                                <option value="">Select State</option>
                                                                {states.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                                <ChevronRight size={14} className="rotate-90" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">City Node</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={form.city}
                                                            onChange={e => setForm({ ...form, city: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800"
                                                            placeholder="City"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Pincode</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={form.pincode}
                                                            onChange={e => setForm({ ...form, pincode: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-bold text-slate-800"
                                                            placeholder="600001"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t border-slate-100">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Biometric Positioning (Coordinates)</label>
                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <input
                                                            type="text"
                                                            value={form.latitude}
                                                            onChange={e => setForm({ ...form, latitude: e.target.value })}
                                                            className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[10px] font-black text-slate-600 focus:outline-none focus:border-blue-400 transition-all"
                                                            placeholder="Lat: 0.0000"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={form.longitude}
                                                            onChange={e => setForm({ ...form, longitude: e.target.value })}
                                                            className="bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[10px] font-black text-slate-600 focus:outline-none focus:border-blue-400 transition-all"
                                                            placeholder="Lng: 0.0000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'hardware' && (
                            <motion.div
                                key="hardware"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >
                                <div className="lg:col-span-12">
                                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                                <Cpu size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hardware Specifications</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical Module Parameters</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 pb-12 border-b border-slate-100">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Deployment Activation Date</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                                                        <Calendar size={18} />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={form.installDate}
                                                        onChange={e => setForm({ ...form, installDate: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-800"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Model / Manufacturer (OEM)</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                                                        <Settings size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={form.model}
                                                        onChange={e => setForm({ ...form, model: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-800"
                                                        placeholder="NCR / Diebold / OKI..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Functional Category</label>
                                                <div className="relative">
                                                    <select
                                                        value={form.atmCategory}
                                                        onChange={e => setForm({ ...form, atmCategory: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 appearance-none"
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="Offsite">Offsite / External</option>
                                                        <option value="Onsite">Onsite / In-Branch</option>
                                                        <option value="Mobile">Mobile Node</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight size={14} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Chassis Serial (S/N)</label>
                                                <input
                                                    type="text"
                                                    value={form.serialNo}
                                                    onChange={e => setForm({ ...form, serialNo: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[11px] font-black text-slate-700 tracking-wider"
                                                    placeholder="HW_SN_X00Y"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Master Lock Key #</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-500 transition-colors">
                                                        <Lock size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={form.keyNumber}
                                                        onChange={e => setForm({ ...form, keyNumber: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black text-slate-700"
                                                        placeholder="KEY_REF_XXX"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Authorization Code (LOI)</label>
                                                <div className="relative group/input">
                                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-500 transition-colors">
                                                        <Shield size={16} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={form.loiCode}
                                                        onChange={e => setForm({ ...form, loiCode: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black text-slate-700"
                                                        placeholder="LOI_XXXX"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Current Node State</label>
                                                <div className="relative">
                                                    <select
                                                        value={form.atmStatus}
                                                        onChange={e => setForm({ ...form, atmStatus: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[11px] font-black text-slate-700 uppercase tracking-widest appearance-none"
                                                    >
                                                        <option value="In Service">Live / In Service</option>
                                                        <option value="Out of Service">Offline / Fault</option>
                                                        <option value="Decommissioned">Retired / Closed</option>
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <Activity size={16} className={form.atmStatus === 'In Service' ? 'text-emerald-500' : 'text-rose-500'} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'mapping' && (
                            <motion.div
                                key="mapping"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                            >
                                {/* Ownership & Supervision */}
                                <div className="lg:col-span-12">
                                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 relative overflow-hidden group">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
                                                <Database size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ownership & Supervision</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logic Control & Assignment</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Franchise Parent</label>
                                                <div className="relative">
                                                    <select
                                                        required
                                                        value={form.franchise}
                                                        onChange={e => setForm({ ...form, franchise: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 appearance-none transition-all focus:ring-4 focus:ring-amber-500/5"
                                                    >
                                                        <option value="">Choose Node</option>
                                                        {franchises.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight size={14} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Zone Manager (ZOM)</label>
                                                <div className="relative">
                                                    <select
                                                        required
                                                        value={form.zom}
                                                        onChange={e => setForm({ ...form, zom: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 appearance-none transition-all focus:ring-4 focus:ring-amber-500/5"
                                                    >
                                                        <option value="">Choose ZOM</option>
                                                        {zoms.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight size={14} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Operational Cluster</label>
                                                <div className="relative">
                                                    <select
                                                        value={form.location}
                                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 appearance-none transition-all focus:ring-4 focus:ring-amber-500/5"
                                                    >
                                                        <option value="">Choose Cluster</option>
                                                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                                    </select>
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                        <ChevronRight size={14} className="rotate-90" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logistics & Network Mapping */}
                                <div className="lg:col-span-12">
                                    <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-10 mt-4">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                                                <Zap size={24} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Network Cryptography</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security & Protocol Link</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Central Route Key</label>
                                                    <div className="relative group/input">
                                                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within/input:text-blue-500 transition-colors">
                                                            <Database size={18} />
                                                        </div>
                                                        <select
                                                            value={form.routeKey}
                                                            onChange={e => setForm({ ...form, routeKey: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-800 appearance-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                                        >
                                                            <option value="">Primary Logic Key</option>
                                                            {routeKeys.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <ChevronRight size={14} className="rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 pt-4 border-t border-slate-100/50">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Custodian Personnel Assignments</h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Primary Custodian (C1)</label>
                                                            <select
                                                                value={form.custodian1}
                                                                onChange={e => setForm({ ...form, custodian1: e.target.value })}
                                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 appearance-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                                            >
                                                                <option value="">Choose Custodian</option>
                                                                {custodians.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Secondary (C2)</label>
                                                                <select
                                                                    value={form.custodian2}
                                                                    onChange={e => setForm({ ...form, custodian2: e.target.value })}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 appearance-none transition-all"
                                                                >
                                                                    <option value="">Choose...</option>
                                                                    {custodians.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Tertiary (C3)</label>
                                                                <select
                                                                    value={form.custodian3}
                                                                    onChange={e => setForm({ ...form, custodian3: e.target.value })}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 appearance-none transition-all"
                                                                >
                                                                    <option value="">Choose...</option>
                                                                    {custodians.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">CRO Type</label>
                                                    <div className="relative">
                                                        <select
                                                            value={form.croType}
                                                            onChange={e => setForm({ ...form, croType: e.target.value })}
                                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold text-slate-800 appearance-none transition-all focus:ring-4 focus:ring-blue-500/5"
                                                        >
                                                            <option value="">Choose CRO Type</option>
                                                            {croTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                                            <ChevronRight size={14} className="rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() => setForm({ ...form, geoTagRequired: !form.geoTagRequired })}
                                                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${form.geoTagRequired ? 'bg-indigo-50 border-indigo-200 shadow-inner' : 'bg-white border-slate-100 hover:border-indigo-100'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${form.geoTagRequired ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                            <MapPin size={16} />
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">Geo Tag Required</div>
                                                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Enforce spatial verification</div>
                                                        </div>
                                                    </div>
                                                    <div className={`w-10 h-5 rounded-full relative transition-all ${form.geoTagRequired ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${form.geoTagRequired ? 'right-1' : 'left-1'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Node Analytics & Comments</label>
                                            <div className="relative group/input">
                                                <div className="absolute top-4 left-5 pointer-events-none text-slate-300 group-focus-within/input:text-blue-500 transition-colors">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <textarea
                                                    rows={5}
                                                    value={form.comments}
                                                    onChange={e => setForm({ ...form, comments: e.target.value })}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all placeholder:text-slate-300"
                                                    placeholder="Log architectural variance or operational history..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Universal Actions */}
                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-4 flex-1 md:flex-none">
                            <button
                                type="button"
                                onClick={() => navigate('/masters/atms')}
                                className="px-8 py-5 bg-white border border-slate-200 text-slate-400 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-[0.98]"
                            >
                                Discard Node
                            </button>
                            <button
                                type="submit"
                                disabled={saveLoading}
                                className="flex-1 md:px-16 py-5 bg-slate-900 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98] group"
                            >
                                {saveLoading ? 'Syncing...' : (
                                    <>
                                        {isEdit ? 'Authorize Refinement' : 'Deploy Node'}
                                        <Save size={18} className="group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AtmMasterForm;

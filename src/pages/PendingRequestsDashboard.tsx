import React, { useState, useEffect } from 'react';
import { UserCog, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import MasterPage from '../components/MasterPage';
import { adminMasterService, type PendingLoginRequest } from '../services/adminMasterService';

const PendingRequestsDashboard: React.FC = () => {
    const [requests, setRequests] = useState<PendingLoginRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await adminMasterService.getPendingRequests();
            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async (id: number, approved: boolean) => {
        try {
            setProcessingId(id);
            const comments = prompt(approved ? "Add Approval Comments:" : "Reason for Rejection:");
            if (comments !== null) {
                await adminMasterService.processRequest(id, approved, comments);
                await fetchRequests();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    const columns = [
        {
            header: 'Requester',
            key: 'username',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
                        <UserCog size={18} />
                    </div>
                    <div className="flex flex-col">
                        <div className="font-black text-slate-900 tracking-tight text-sm uppercase">{val}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.custodianOrZomName}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Request Intel',
            key: 'requestFor',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className={`text-[10px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded self-start ${val === 'Login' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        {val}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 tracking-widest">
                        {new Date(row.requestDate).toLocaleDateString()}
                    </div>
                </div>
            )
        },
        {
            header: 'Device Signature',
            key: 'mobileInfo',
            render: (val: any) => (
                <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
                    <Smartphone size={12} className="text-slate-400 shrink-0" />
                    <span className="text-[10px] font-bold text-slate-600 line-clamp-1 italic">{val}</span>
                </div>
            )
        },
        {
            header: 'Actions',
            key: 'id',
            render: (val: any, row: any) => (
                <div className="flex items-center gap-2">
                    {row.status === 'Pending' ? (
                        <>
                            <button
                                onClick={() => handleProcess(val, true)}
                                disabled={processingId !== null}
                                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"
                            >
                                <CheckCircle2 size={16} />
                            </button>
                            <button
                                onClick={() => handleProcess(val, false)}
                                disabled={processingId !== null}
                                className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                            >
                                <XCircle size={16} />
                            </button>
                        </>
                    ) : (
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${row.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {row.status}
                        </div>
                    )
                    }
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Access Approvals"
            subtitle="Audit and authorized cryptographic identity requests from edge devices"
            data={requests}
            columns={columns as any}
            loading={loading}
        />
    );
};

export default PendingRequestsDashboard;

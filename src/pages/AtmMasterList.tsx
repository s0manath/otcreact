/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Monitor,
  Building,
  MapPin,
  Activity,
  Server,
  Database,
  Calendar,
  Upload,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MasterPage from "../components/MasterPage";
import masterService, { type AtmMaster } from "../services/masterService";

const AtmMasterList: React.FC = () => {
  const navigate = useNavigate();
  const [atms, setAtms] = useState<AtmMaster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAtms();
  }, []);

  const fetchAtms = async () => {
    try {
      setLoading(true);
      const data = await masterService.getAtms();
      setAtms(data);
    } catch (error) {
      console.error("Error fetching ATMs:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: "ATM ID",
      key: "atmId",
      render: (val: string, row: ATMRow) => (
        <div className="flex items-center gap-3">
          <Monitor size={16} className="text-blue-500" />
          <div>
            <div className="font-bold text-sm">{val || "N/A"}</div>
            <div className="text-[10px] text-slate-400 uppercase">
              {row.bank || "Unknown"}
            </div>
          </div>
        </div>
      ),
    },

    {
      header: "Bank",
      key: "bank",
      render: (val: string) => (
        <div className="text-sm font-semibold text-slate-700">
          {val || "N/A"}
        </div>
      ),
    },

    {
      header: "Site",
      key: "site",
      render: (val: string) => (
        <div className="text-sm text-slate-600">{val || "N/A"}</div>
      ),
    },

    {
      header: "Site ID",
      key: "siteId",
      render: (val: string) => (
        <div className="flex items-center gap-2 text-sm">
          <Server size={12} className="text-slate-400" />
          {val || "N/A"}
        </div>
      ),
    },

    {
      header: "District",
      key: "district",
      render: (val: string) => (
        <div className="text-sm text-slate-600">{val || "N/A"}</div>
      ),
    },

    {
      header: "State",
      key: "state",
      render: (val: string) => (
        <div className="text-sm text-slate-600">{val || "N/A"}</div>
      ),
    },

    {
      header: "ATM Category",
      key: "atmCategory",
      render: (val: string) => (
        <div className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-700 inline-block">
          {val || "N/A"}
        </div>
      ),
    },

    {
      header: "LOI Code",
      key: "loiCode",
      render: (val: string) => (
        <div className="text-sm font-mono text-slate-600">{val || "N/A"}</div>
      ),
    },

    {
      header: "Route Key",
      key: "routeKey",
      render: (val: string) => (
        <div className="text-sm text-slate-600">{val || "N/A"}</div>
      ),
    },

    {
      header: "Franchise Name",
      key: "franchiseName",
      render: (val: string) => (
        <div className="text-sm font-semibold text-slate-700">
          {val || "N/A"}
        </div>
      ),
    },

    {
      header: "ZOM Name",
      key: "zomName",
      render: (val: string) => (
        <div className="text-sm text-slate-600">{val || "N/A"}</div>
      ),
    },

    {
      header: "CRO Type",
      key: "croType",
      render: (val: string) => (
        <div className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 inline-block">
          {val || "N/A"}
        </div>
      ),
    },

    {
      header: "ATM Status",
      key: "atmStatus",
      render: (val: string) => {
        const isActive = val?.toLowerCase() === "in service";

        return (
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                isActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {val || "Unknown"}
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <MasterPage
      title="ATM / Terminal Master"
      subtitle="Centralized inventory for terminal configuration and health."
      data={atms}
      columns={columns as any}
      onAdd={() => navigate("/masters/atms/new")}
      onEdit={(row) => navigate(`/masters/atms/edit/${row.atmId}`)}
      loading={loading}
      extraActions={
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/masters/atms/route-key")}
            className="px-6 py-4 bg-white border border-slate-200 text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-all flex items-center gap-3"
          >
            <Key size={16} />
            Sync Route Keys
          </button>
          <button
            onClick={() => navigate("/masters/atms/bulk")}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3"
          >
            <Upload size={16} />
            Bulk Upload
          </button>
        </div>
      }
    />
  );
};

export default AtmMasterList;

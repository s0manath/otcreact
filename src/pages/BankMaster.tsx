/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import MasterPage from "../components/MasterPage";
import { Building2 } from "lucide-react";
// import { head, header } from "framer-motion/client";

const BankMaster: React.FC = () => {
  const bankData = [
    {
      id: 1,
      name: "Bank of OTC",
      code: "BOTC001",
      address: "MG Road Branch",
      site: "ATM-001",
      contactPerson: "Rahul Sharma",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      region: "South",
      location: "MG Road",
      updated: "2026-02-23",
    },
    {
      id: 2,
      name: "National ATM Bank",
      code: "NATM002",
      address: "Brigade Road Hub",
      site: "ATM-002",
      contactPerson: "Anita Verma",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560025",
      region: "South",
      location: "Brigade Road",
      updated: "2026-02-22",
    },
    {
      id: 3,
      name: "Reserve Finance Corp",
      code: "RFC003",
      address: "Connaught Place",
      site: "ATM-003",
      contactPerson: "Vikas Mehta",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      region: "North",
      location: "CP",
      updated: "2026-02-20",
    },
    {
      id: 4,
      name: "Global Asset Bank",
      code: "GAB004",
      address: "Bandra West",
      site: "ATM-004",
      contactPerson: "Sneha Patil",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      region: "West",
      location: "Bandra",
      updated: "2026-02-19",
    },
    {
      id: 5,
      name: "Union Data Services",
      code: "UDS005",
      address: "Salt Lake Sector V",
      site: "ATM-005",
      contactPerson: "Arindam Roy",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700091",
      region: "East",
      location: "Salt Lake",
      updated: "2026-02-18",
    },
    {
      id: 6,
      name: "Metro Finance Bank",
      code: "MFB006",
      address: "T Nagar Branch",
      site: "ATM-006",
      contactPerson: "Karthik R",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
      region: "South",
      location: "T Nagar",
      updated: "2026-02-17",
    },
    {
      id: 7,
      name: "Prime Credit Bank",
      code: "PCB007",
      address: "Hitech City",
      site: "ATM-007",
      contactPerson: "Ravi Teja",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500081",
      region: "South",
      location: "Hitech City",
      updated: "2026-02-16",
    },
    {
      id: 8,
      name: "Secure Trust Bank",
      code: "STB008",
      address: "Sector 18",
      site: "ATM-008",
      contactPerson: "Pooja Singh",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      region: "North",
      location: "Sector 18",
      updated: "2026-02-15",
    },
    {
      id: 9,
      name: "Digital Payments Bank",
      code: "DPB009",
      address: "Cyber Hub",
      site: "ATM-009",
      contactPerson: "Amit Khanna",
      city: "Gurgaon",
      state: "Haryana",
      pincode: "122002",
      region: "North",
      location: "DLF Cyber City",
      updated: "2026-02-14",
    },
    {
      id: 10,
      name: "Capital Growth Bank",
      code: "CGB010",
      address: "FC Road",
      site: "ATM-010",
      contactPerson: "Neha Joshi",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
      region: "West",
      location: "FC Road",
      updated: "2026-02-13",
    },

    // 🔥 Add more if needed (same pattern)
    {
      id: 11,
      name: "Infinity Banking Corp",
      code: "IBC011",
      address: "Indiranagar",
      site: "ATM-011",
      contactPerson: "Manish Gupta",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
      region: "South",
      location: "Indiranagar",
      updated: "2026-02-12",
    },
    {
      id: 12,
      name: "NextGen Finance",
      code: "NGF012",
      address: "Whitefield",
      site: "ATM-012",
      contactPerson: "Priya Nair",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560066",
      region: "South",
      location: "Whitefield",
      updated: "2026-02-11",
    },
  ];

  const columns = [
    {
      header: "ID",
      key: "id",
      render: (val: any) => (
        <span className="font-black text-slate-400">#{val}</span>
      ),
    },
    {
      header: "Bank Name",
      key: "name",
      render: (val: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <Building2 size={16} />
          </div>
          <span className="font-bold text-slate-800">{val}</span>
        </div>
      ),
    },
    {
      header: "Site Id",
      key: "code",
      render: (val: any) => (
        <code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
          {val}
        </code>
      ),
    },
    {
      header: "Address",
      key: "address",
      render: (val: any) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${val === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
        >
          {val}
        </span>
      ),
    },
    { header: "Site", key: "site" },
    { header: "Contact Person", key: "contactPerson" },
    { header: "City", key: "city" },
    { header: "State", key: "state" },
    { header: "Pincode", key: "pincode" },
    { header: "Region", key: "region" },
    { header: "Location", key: "location" },
    { header: "Last Updated", key: "updated" },
  ];

  return (
    <MasterPage
      title="Bank Master"
      subtitle="Manage affiliated banking institutions and Swift codes."
      data={bankData}
      columns={columns}
      onAdd={() => alert("Add New Bank Modal")}
    />
  );
};

export default BankMaster;

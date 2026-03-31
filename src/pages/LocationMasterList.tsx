import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MasterPage from '../components/MasterPage';
import { adminMasterService, type LocationMaster } from '../services/adminMasterService';

const LocationMasterList: React.FC = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState<LocationMaster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const data = await adminMasterService.getLocations();
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Location Hub',
            key: 'locationName',
            render: (val: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100 shadow-sm">
                        <MapPin size={18} />
                    </div>
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">{val}</div>
                </div>
            )
        },
        {
            header: 'Regional Anchor',
            key: 'regionName',
            render: (val: any, row: any) => (
                <div className="flex flex-col gap-1">
                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{val || 'Global'}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code: {row.regionCode || 'N/A'}</div>
                </div>
            )
        },
        {
            header: 'Status',
            key: 'isActive',
            render: (val: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${val ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${val ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {val ? 'Active' : 'Archived'}
                    </span>
                </div>
            )
        }
    ];

    return (
        <MasterPage
            title="Location Master"
            subtitle="Manage operational hubs and map them to regional governance zones"
            data={locations}
            columns={columns as any}
            onAdd={() => navigate('/masters/locations/new')}
            onEdit={(row) => navigate(`/masters/locations/edit/${row.id}`)}
            loading={loading}
        />
    );
};

export default LocationMasterList;

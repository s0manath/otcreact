import api from './api';

export interface LocationMaster {
    id: number;
    locationName: string;
    regionCode: string;
    regionName: string;
    isActive: boolean;
}

export interface RegionMaster {
    id: number;
    regionCode: string;
    regionName: string;
    isActive: boolean;
}

export interface KeyInventoryMaster {
    id: number;
    keySerialNumber: string;
    keyType: string;
    keyMake: string;
    keyModel: string;
    atmid: string;
    imagePath: string;
    isActive: boolean;
}

export interface SiteAccessMaster {
    id: number;
    siteID: string;
    siteName: string;
    accessTimeFrom: string;
    accessTimeTo: string;
    availableDays: Record<string, boolean>;
    isActive: boolean;
}

export interface PendingLoginRequest {
    id: number;
    username: string;
    custodianOrZomName: string;
    requestDate: string;
    requestFor: string;
    mobileInfo: string;
    comments: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export const adminMasterService = {
    // Locations
    getLocations: async (query?: string) => {
        const response = await api.post<LocationMaster[]>('/AdminMaster/locations-list', { query });
        return response.data;
    },
    saveLocation: async (location: Partial<LocationMaster>) => {
        const response = await api.post('/AdminMaster/locations', location);
        return response.data;
    },

    // Regions
    getRegions: async (query?: string) => {
        const response = await api.post<RegionMaster[]>('/AdminMaster/regions-list', { query });
        return response.data;
    },
    saveRegion: async (region: Partial<RegionMaster>) => {
        const response = await api.post('/AdminMaster/regions', region);
        return response.data;
    },

    // Key Inventory
    getKeys: async (query?: string) => {
        const response = await api.post<KeyInventoryMaster[]>('/AdminMaster/key-inventory-list', { query });
        return response.data;
    },
    saveKey: async (key: Partial<KeyInventoryMaster>) => {
        const response = await api.post('/AdminMaster/key-inventory', key);
        return response.data;
    },

    // Pending Requests
    getPendingRequests: async () => {
        const response = await api.post<PendingLoginRequest[]>('/AdminMaster/pending-requests-list');
        return response.data;
    },
    processRequest: async (requestId: number, isApproved: boolean, comments: string) => {
        const response = await api.post('/AdminMaster/process-request', { requestId, isApproved, comments });
        return response.data;
    },

    // Mappings
    getCustodianMappings: async () => {
        const response = await api.post<any[]>('/AdminMaster/mappings/custodian-list');
        return response.data;
    },
    getZomMappings: async () => {
        const response = await api.post<any[]>('/AdminMaster/mappings/zom-list');
        return response.data;
    },

    // Bulk Utils
    bulkUpdateRouteKeys: async (atmIds: string[], routeKey: string) => {
        const response = await api.post('/AdminMaster/bulk-update-route-keys', { atmIds, routeKey });
        return response.data;
    }
};

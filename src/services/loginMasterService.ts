import api from "./api";

export interface LoginMasterListItem {
    username: string;
    userType: string;
    role: string;
    locked: boolean;
}

export interface HierarchyItem {
    id: string;
    name: string;
    parentId?: string;
}

export const loginMasterService = {
    searchLogins: async (searchTerm: string) => {
        const response = await api.post<LoginMasterListItem[]>('/LoginMaster/search', { searchTerm });
        return response.data;
    },
    getLoginById: async (username: string) => {
        const response = await api.get(`/LoginMaster/${username}`);
        return response.data;
    },
    saveLogin: async (data: any) => {
        const response = await api.post('/LoginMaster/save', data);
        return response.data;
    },
    lockLogin: async (username: string, lockedBy: string) => {
        const response = await api.post(`/LoginMaster/${username}/lock`, { lockedBy });
        return response.data;
    },
    unlockLogin: async (username: string) => {
        const response = await api.post(`/LoginMaster/${username}/unlock`);
        return response.data;
    },
    getHierarchy: async (type: string, parentId?: string) => {
        const url = `/LoginMaster/hierarchy/${type}${parentId ? `?parentId=${parentId}` : ''}`;
        const response = await api.get<HierarchyItem[]>(url);
        return response.data;
    }
};

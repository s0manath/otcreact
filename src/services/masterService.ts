import api from './api';

export interface CustodianMaster {
    id: number;
    custodianName: string;
    mobileNumber: string;
    emailId: string;
    locationId?: number;
    locationName?: string;
    zomId?: number;
    zomName?: string;
    franchiseId?: number;
    franchiseName?: string;
    routeKeyId?: number;
    routeKeyName?: string;
    touchKeyId?: string;
    custodianCode?: string;
    accessFrom?: string;
    accessTo?: string;
    iemiNo?: string;
    profileImage?: string;
    isActive: boolean;
}

export interface FranchiseMaster {
    id: number;
    franchiseName: string;
    mobileNumber: string;
    emailId: string;
    sapCode: string;
    secondaryCustodianRequire: boolean;
    stateId?: number;
    stateName?: string;
    districtId?: number;
    districtName?: string;
    isActive: boolean;
}

export interface AtmMaster {
    atmId: string;
    aliasAtmId: string;
    bank: string;
    siteId: string;
    site: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    region: string;
    location: string;
    installDate?: string;
    atmCategory: string;
    model: string;
    loiCode: string;
    keyNumber: string;
    serialNo: string;
    comments: string;
    atmStatus: string;
    atmType: string;
    franchise: string;
    latitude: string;
    longitude: string;
    zom: string;
    custodian1: string;
    custodian2: string;
    custodian3: string;
    routeKey: string;
    croType?: string;
    geoTagRequired?: boolean;
    isActive: boolean;
}

export interface ModuleAccess {
    moduleName: string;
    add: boolean;
    edit: boolean;
    view: boolean;
    delete: boolean;
}

export interface ReportAccess {
    reportName: string;
    view: boolean;
}

export interface RoleMaster {
    slNo: number;
    roleName: string;
    roleDescription: string;
    roleStatus?: number;
    privileges: ModuleAccess[];
    reportPrivileges: ReportAccess[];
    createdOn?: string;
    createdBy?: string;
}

export interface StateMaster {
    id: number;
    stateName: string;
    regionId?: number;
    regionName?: string;
    isActive: boolean;
}

export interface DistrictMaster {
    id: number;
    districtName: string;
    stateId?: number;
    stateName?: string;
    isActive: boolean;
}

export interface ZomMaster {
    id: number;
    zomName: string;
    regionId?: number;
    regionName?: string;
    locationId?: number;
    locationName?: string;
    isActive: boolean;
}

export interface BulkUploadResponse {
    success: boolean;
    message: string;
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    errors: Array<{
        rowNumber: number;
        columnName: string;
        errorMessage: string;
    }>;
}

export interface MasterDropdownItem {
    id: string;
    name: string;
}

const masterService = {
    // Roles
    getRoles: async (params?: any) => {
        const response = await api.post<RoleMaster[]>('/rolemaster/search', params);
        return response.data;
    },
    getRole: async (id: number) => {
        const response = await api.get<RoleMaster>(`/rolemaster/${id}`);
        return response.data;
    },
    saveRole: async (data: RoleMaster) => {
        const response = await api.post('/rolemaster/save', data);
        return response.data;
    },
    getModuleList: async () => {
        const response = await api.get<string[]>('/rolemaster/modules');
        return response.data;
    },

    // Regional Hierarchy
    getStatesList: async (params?: any) => {
        const response = await api.post<StateMaster[]>('/regionalmaster/states/search', params);
        return response.data;
    },
    getState: async (id: number) => {
        const response = await api.get<StateMaster>(`/regionalmaster/states/${id}`);
        return response.data;
    },
    saveState: async (data: StateMaster) => {
        const response = await api.post('/regionalmaster/states/save', data);
        return response.data;
    },

    getDistrictsList: async (params?: any) => {
        const response = await api.post<DistrictMaster[]>('/regionalmaster/districts/search', params);
        return response.data;
    },
    getDistrict: async (id: number) => {
        const response = await api.get<DistrictMaster>(`/regionalmaster/districts/${id}`);
        return response.data;
    },
    saveDistrict: async (data: DistrictMaster) => {
        const response = await api.post('/regionalmaster/districts/save', data);
        return response.data;
    },

    getZomsList: async (params?: any) => {
        const response = await api.post<ZomMaster[]>('/regionalmaster/zoms/search', params);
        return response.data;
    },
    getZom: async (id: number) => {
        const response = await api.get<ZomMaster>(`/regionalmaster/zoms/${id}`);
        return response.data;
    },
    saveZom: async (data: ZomMaster) => {
        const response = await api.post('/regionalmaster/zoms/save', data);
        return response.data;
    },

    // Bulk Utilities
    uploadAtmBulk: async (fileName: string, fileContent: string) => {
        const response = await api.post<BulkUploadResponse>('/bulkupload/atm', { fileName, fileContent });
        return response.data;
    },
    updateRouteKeyBulk: async (fileName: string, fileContent: string) => {
        const response = await api.post<BulkUploadResponse>('/bulkupload/route-key', { fileName, fileContent });
        return response.data;
    },

    // Custodians
    getCustodians: async (params?: any) => {
        const response = await api.get<CustodianMaster[]>('/master/custodians', { params });
        return response.data;
    },
    getCustodian: async (id: number) => {
        const response = await api.get<CustodianMaster>(`/master/custodians/${id}`);
        return response.data;
    },
    saveCustodian: async (data: CustodianMaster) => {
        const response = await api.post('/master/custodians', data);
        return response.data;
    },

    // Franchises
    getFranchises: async (params?: any) => {
        const response = await api.get<FranchiseMaster[]>('/master/franchises', { params });
        return response.data;
    },
    getFranchise: async (id: number) => {
        const response = await api.get<FranchiseMaster>(`/master/franchises/${id}`);
        return response.data;
    },
    saveFranchise: async (data: FranchiseMaster) => {
        const response = await api.post('/master/franchises', data);
        return response.data;
    },

    // ATMs
    getAtms: async () => {
        const response = await api.get<AtmMaster[]>('/master/atms');
        return response.data;
    },
    getAtm: async (id: string) => {
        const response = await api.get<AtmMaster>(`/master/atms/${id}`);
        return response.data;
    },
    saveAtm: async (data: AtmMaster) => {
        const response = await api.post('/master/atms', data);
        return response.data;
    },

    // Dropdowns
    getLocations: async () => (await api.get<MasterDropdownItem[]>('/master/dropdowns/locations')).data,
    getZoms: async () => (await api.get<MasterDropdownItem[]>('/master/dropdowns/zoms')).data,
    getFranchisesDropdown: async () => (await api.get<MasterDropdownItem[]>('/master/dropdowns/franchises')).data,
    getRouteKeys: async () => (await api.get<MasterDropdownItem[]>('/master/dropdowns/routekeys')).data,
    getStates: async () => (await api.get<MasterDropdownItem[]>('/master/dropdowns/states')).data,
    getDistricts: async (stateId: number) => (await api.get<MasterDropdownItem[]>(`/master/dropdowns/districts/${stateId}`)).data,
    getCroTypes: async () => [
        { id: 'India1', name: 'India1' },
        { id: 'Alternate', name: 'Alternate' },
        { id: 'PPM', name: 'PPM' }
    ],
    getCustodianRouteKeys: async () => [
        { id: 'RK001|CID101|TK_ABC', name: 'RK-SOUTH-01' },
        { id: 'RK002|CID102|TK_XYZ', name: 'RK-NORTH-02' }
    ],
};

export default masterService;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BankMaster from './pages/BankMaster';
import ScheduleVisit from './pages/ScheduleVisit';
import RouteConfigure from './pages/RouteConfigure';
import ReportPage from './pages/ReportPage';
import LoginMasterList from './pages/LoginMasterList';
import LoginMasterForm from './pages/LoginMasterForm';
import CustodianMasterList from './pages/CustodianMasterList';
import CustodianMasterForm from './pages/CustodianMasterForm';
import FranchiseMasterList from './pages/FranchiseMasterList';
import FranchiseMasterForm from './pages/FranchiseMasterForm';
import AtmMasterList from './pages/AtmMasterList';
import AtmMasterForm from './pages/AtmMasterForm';
import RoleMasterList from './pages/RoleMasterList';
import RoleMasterForm from './pages/RoleMasterForm';
import StateMasterList from './pages/StateMasterList';
import StateMasterForm from './pages/StateMasterForm';
import DistrictMasterList from './pages/DistrictMasterList';
import DistrictMasterForm from './pages/DistrictMasterForm';
import ZomMasterList from './pages/ZomMasterList';
import ZomMasterForm from './pages/ZomMasterForm';
import LocationMasterList from './pages/LocationMasterList';
import LocationMasterForm from './pages/LocationMasterForm';
import RegionMasterList from './pages/RegionMasterList';
import RegionMasterForm from './pages/RegionMasterForm';
import KeyInventoryList from './pages/KeyInventoryList';
import KeyInventoryForm from './pages/KeyInventoryForm';
import OneLineMasterList from './pages/OneLineMasterList';
import SiteAccessMasterList from './pages/SiteAccessMasterList';
import CustodianMappingList from './pages/CustodianMappingList';
import PendingRequestsDashboard from './pages/PendingRequestsDashboard';
import ZomMappingList from './pages/ZomMappingList';
import RouteMasterAdminList from './pages/RouteMasterAdminList';
import RouteMappingUtility from './pages/RouteMappingUtility';
import AtmBulkUpload from './pages/AtmBulkUpload';
import RouteKeyBulkUpdate from './pages/RouteKeyBulkUpdate';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <Layout>{children}</Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/bank-master" element={<ProtectedRoute><BankMaster /></ProtectedRoute>} />
        <Route path="/login-master" element={<ProtectedRoute><LoginMasterList /></ProtectedRoute>} />
        <Route path="/login-master/add" element={<ProtectedRoute><LoginMasterForm /></ProtectedRoute>} />
        <Route path="/login-master/edit/:username" element={<ProtectedRoute><LoginMasterForm /></ProtectedRoute>} />

        <Route path="/masters/custodians" element={<ProtectedRoute><CustodianMasterList /></ProtectedRoute>} />
        <Route path="/masters/custodians/new" element={<ProtectedRoute><CustodianMasterForm /></ProtectedRoute>} />
        <Route path="/masters/custodians/edit/:id" element={<ProtectedRoute><CustodianMasterForm /></ProtectedRoute>} />

        <Route path="/masters/franchises" element={<ProtectedRoute><FranchiseMasterList /></ProtectedRoute>} />
        <Route path="/masters/franchises/new" element={<ProtectedRoute><FranchiseMasterForm /></ProtectedRoute>} />
        <Route path="/masters/franchises/edit/:id" element={<ProtectedRoute><FranchiseMasterForm /></ProtectedRoute>} />

        <Route path="/masters/atms" element={<ProtectedRoute><AtmMasterList /></ProtectedRoute>} />
        <Route path="/masters/atms/new" element={<ProtectedRoute><AtmMasterForm /></ProtectedRoute>} />
        <Route path="/masters/atms/edit/:id" element={<ProtectedRoute><AtmMasterForm /></ProtectedRoute>} />
        <Route path="/masters/atms/bulk" element={<ProtectedRoute><AtmBulkUpload /></ProtectedRoute>} />
        <Route path="/masters/atms/route-key" element={<ProtectedRoute><RouteKeyBulkUpdate /></ProtectedRoute>} />

        <Route path="/masters/roles" element={<ProtectedRoute><RoleMasterList /></ProtectedRoute>} />
        <Route path="/masters/roles/new" element={<ProtectedRoute><RoleMasterForm /></ProtectedRoute>} />
        <Route path="/masters/roles/edit/:id" element={<ProtectedRoute><RoleMasterForm /></ProtectedRoute>} />

        <Route path="/masters/states" element={<ProtectedRoute><StateMasterList /></ProtectedRoute>} />
        <Route path="/masters/states/new" element={<ProtectedRoute><StateMasterForm /></ProtectedRoute>} />
        <Route path="/masters/states/edit/:id" element={<ProtectedRoute><StateMasterForm /></ProtectedRoute>} />

        <Route path="/masters/districts" element={<ProtectedRoute><DistrictMasterList /></ProtectedRoute>} />
        <Route path="/masters/districts/new" element={<ProtectedRoute><DistrictMasterForm /></ProtectedRoute>} />
        <Route path="/masters/districts/edit/:id" element={<ProtectedRoute><DistrictMasterForm /></ProtectedRoute>} />

        <Route path="/masters/zoms" element={<ProtectedRoute><ZomMasterList /></ProtectedRoute>} />
        <Route path="/masters/zoms/new" element={<ProtectedRoute><ZomMasterForm /></ProtectedRoute>} />
        <Route path="/masters/zoms/edit/:id" element={<ProtectedRoute><ZomMasterForm /></ProtectedRoute>} />

        <Route path="/masters/locations" element={<ProtectedRoute><LocationMasterList /></ProtectedRoute>} />
        <Route path="/masters/locations/new" element={<ProtectedRoute><LocationMasterForm /></ProtectedRoute>} />
        <Route path="/masters/locations/edit/:id" element={<ProtectedRoute><LocationMasterForm /></ProtectedRoute>} />

        <Route path="/masters/regions" element={<ProtectedRoute><RegionMasterList /></ProtectedRoute>} />
        <Route path="/masters/regions/new" element={<ProtectedRoute><RegionMasterForm /></ProtectedRoute>} />
        <Route path="/masters/regions/edit/:id" element={<ProtectedRoute><RegionMasterForm /></ProtectedRoute>} />

        <Route path="/masters/keys" element={<ProtectedRoute><KeyInventoryList /></ProtectedRoute>} />
        <Route path="/masters/keys/new" element={<ProtectedRoute><KeyInventoryForm /></ProtectedRoute>} />
        <Route path="/masters/keys/edit/:id" element={<ProtectedRoute><KeyInventoryForm /></ProtectedRoute>} />

        <Route path="/masters/one-line" element={<ProtectedRoute><OneLineMasterList /></ProtectedRoute>} />
        <Route path="/masters/site-access" element={<ProtectedRoute><SiteAccessMasterList /></ProtectedRoute>} />

        <Route path="/masters/mappings/custodian" element={<ProtectedRoute><CustodianMappingList /></ProtectedRoute>} />
        <Route path="/masters/requests" element={<ProtectedRoute><PendingRequestsDashboard /></ProtectedRoute>} />
        <Route path="/masters/mappings/zom" element={<ProtectedRoute><ZomMappingList /></ProtectedRoute>} />

        <Route path="/masters/route-admin" element={<ProtectedRoute><RouteMasterAdminList /></ProtectedRoute>} />
        <Route path="/masters/route-mapping" element={<ProtectedRoute><RouteMappingUtility /></ProtectedRoute>} />

        <Route path="/schedule" element={<ProtectedRoute><ScheduleVisit /></ProtectedRoute>} />
        <Route path="/route" element={<ProtectedRoute><RouteConfigure /></ProtectedRoute>} />
        <Route path="/reports/:type" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

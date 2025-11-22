import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import PatientDashboard from "./components/pages/DashboardScreen/PatientDashboard";
import GoalTracker from "./components/pages/GoalTracker/GoalTracker";
import AuditLogTable from "./components/pages/AuditLogTable/AuditLogTable";
import SideNavLayout from "./components/pages/SideNavLayout/SideNavLayout";
import DashboardReport from "./components/pages/DashboardScreen/DashboardReport"

function App() {
  return (
    <Router>
      <Routes>
        {/* everything below is protected + has sidenav */}
        <Route element={<ProtectedRoute />}>
          <Route element={<SideNavLayout />}>
            {/* default route inside layout */}
            <Route path="/" element={<PatientDashboard />} />
            <Route path="/goalTracker" element={<GoalTracker />} />
            <Route path="/auditLog" element={<AuditLogTable />} />
            <Route path="/patient-summary" element={<PatientDashboard />} />
            <Route path="/patient-dashboard" element={<DashboardReport />} />
          </Route>
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

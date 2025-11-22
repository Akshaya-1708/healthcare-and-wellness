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

function App() {
  return (
    <Router>
      <Routes>
        {/* public route */}
         {/* <Route path="/" element={<PatientDashboard />} /> */}
        <Route path="/" element={<GoalTracker />} />

        {/* private routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/auditLog" element={<AuditLogTable/>} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

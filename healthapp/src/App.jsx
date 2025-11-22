import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute";
import PatientDashboard from "./components/pages/DashboardScreen/PatientDashboard";
import DashboardReport from "./components/pages/DashboardScreen/DashboardReport";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* //configure public */}
          <Route path="/" element={<PatientDashboard />} />
          
          {/* // private routes */}
          <Route path="/" element={<ProtectedRoute />}>
            {" "}
            <Route path="/patient-summary" element={<PatientDashboard />} />
                        <Route path="/patient-dashboard" element={<DashboardReport />} />



          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    
    </>
  );
}

export default App;

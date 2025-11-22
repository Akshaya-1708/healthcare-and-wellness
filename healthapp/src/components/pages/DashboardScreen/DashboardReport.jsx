// DashboardReport.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

import patientData from "./mockJson/patientDetails.json";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384", "#36A2EB"];

const DashboardReport = () => {
  const { fullName, age, gender, profile, insurance, years, riskScores } = patientData;

  const wellnessData2025 = Object.entries(years["2025"].wellness.stepsMonthly).map(
    ([month, steps]) => ({ month, steps })
  );

  const coverageData = [
    { name: "Used", value: insurance.coverageDetails.usedAmount },
    { name: "Remaining", value: insurance.coverageDetails.remainingCoverage },
  ];

  const riskData = [
    { name: "Diabetes", score: riskScores.diabetesRisk === "High" ? 90 : riskScores.diabetesRisk === "Moderate" ? 60 : 30 },
    { name: "Cardiac", score: riskScores.cardiacRisk === "High" ? 90 : riskScores.cardiacRisk === "Moderate" ? 60 : 30 },
    { name: "Mental Health", score: riskScores.mentalHealthScore },
  ];

  const healthMetrics = [
    { name: "Sleep (hrs)", value: years["2025"].wellness.sleepHoursAvg },
    { name: "Water (L/day)", value: parseFloat(years["2025"].wellness.waterIntakeAvg) },
    { name: "Calories Burnt", value: years["2025"].wellness.caloriesBurntAvg },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Top Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 5px 0", color: "#333" }}>{fullName}</h1>
          <p style={{ margin: "2px 0", color: "#555" }}>
            Age: {age} | Gender: {gender} | Occupation: {profile.occupation}
          </p>
          <p style={{ margin: "2px 0", color: "#555" }}>Primary Physician: {profile.primaryPhysician}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>Insurance Coverage</h3>
          <p style={{ margin: "2px 0", color: "#555" }}>Plan: {insurance.planName}</p>
          <p style={{ margin: "2px 0", color: "#555" }}>
            Remaining: ₹{insurance.coverageDetails.remainingCoverage.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        {/* Row 1 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 400px", minWidth: 280, height: 300, padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Monthly Steps (2025)</h4>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={wellnessData2025}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="steps" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 400px", minWidth: 280, height: 300, padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Risk Scores</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 300px", minWidth: 250, height: 300, padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Insurance Used vs Remaining</h4>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={coverageData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {coverageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {healthMetrics.map((metric, idx) => (
            <div key={idx} style={{ flex: "1 1 200px", minWidth: 180, height: 250, padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
              <h4 style={{ textAlign: "center", marginBottom: "10px" }}>{metric.name}</h4>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={[
                      { name: metric.name, value: metric.value },
                      { name: "Remaining", value: 100 - metric.value },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    label
                  >
                    <Cell fill={COLORS[idx % COLORS.length]} />
                    <Cell fill="#eee" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>

        {/* Row 3 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 400px", minWidth: 280, height: 300, padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Medication Frequency</h4>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={years["2025"].appointments.upcoming.flatMap((appt) =>
                  appt.medications.map((med) => ({
                    name: med.name,
                    timesPerDay: med.frequency.includes("Twice") ? 2 : 1,
                  }))
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="timesPerDay" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: "1 1 400px", minWidth: 280, height: 300, padding: "15px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <h4 style={{ textAlign: "center", marginBottom: "10px" }}>Lab Reports Status</h4>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed", value: years["2025"].labReports.filter(r => r.status === "Completed").length },
                    { name: "Pending", value: years["2025"].labReports.filter(r => r.status !== "Completed").length },
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#0088FE" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReport;

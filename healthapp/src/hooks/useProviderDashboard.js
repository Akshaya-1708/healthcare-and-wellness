// src/hooks/useProviderDashboard.js
import { useEffect, useMemo, useState } from "react";

/**
 * useProviderDashboard
 * - Encapsulates data + business logic for ProviderDashboard
 * - Replace mock data and placeholder functions with real API calls as needed
 */
export default function useProviderDashboard(apiBase = "/api") {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | missed | met
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // load patients (mock -> replace with API)
  useEffect(() => {
    setLoading(true);
    // Simulate async fetch
    setTimeout(() => {
      setPatients([
        {
          id: 1,
          name: "Amita Sharma",
          email: "amita@example.com",
          age: 42,
          goals: [
            { type: "Steps", value: 8000, target: 10000 },
            { type: "Sleep (hrs)", value: 6.5, target: 8 },
          ],
          reminders: [
            { title: "Annual Blood Test", date: "2024-11-01", completed: false },
            { title: "Vaccination follow-up", date: "2024-08-12", completed: true },
          ],
          allergies: "Penicillin",
          medications: "Atorvastatin",
          lastVisit: "2024-09-12",
        },
        {
          id: 2,
          name: "Ravi Patel",
          email: "ravi@example.com",
          age: 58,
          goals: [{ type: "Steps", value: 12000, target: 10000 }],
          reminders: [{ title: "Cardio Check", date: "2024-10-01", completed: true }],
          allergies: "",
          medications: "Metformin",
          lastVisit: "2024-10-10",
        },
        {
          id: 3,
          name: "Neha Verma",
          email: "neha@example.com",
          age: 33,
          goals: [
            { type: "Water (cups)", value: 6, target: 8 },
            { type: "Steps", value: 5000, target: 10000 },
          ],
          reminders: [{ title: "Skin Check", date: "2024-11-10", completed: false }],
          allergies: "None",
          medications: "None",
          lastVisit: "2024-07-05",
        },
      ]);
      setLoading(false);
    }, 300);
  }, [apiBase]);

  // Helpers
  function getCompliance(patient) {
    const missed = (patient.reminders || []).some((r) => !r.completed);
    return missed ? "Missed Preventive Checkup" : "Goal Met";
  }

  function progressPercent(goal) {
    if (!goal || !goal.target) return 0;
    const percent = Math.round((goal.value / goal.target) * 100);
    return percent > 100 ? 100 : percent;
  }

  function initials(name = "") {
    return name
      .split(" ")
      .map((n) => n[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  // Filtering & search (memoized)
  const filtered = useMemo(() => {
    let list = [...patients];
    const q = (query || "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.email || "").toLowerCase().includes(q) ||
          (p.allergies || "").toLowerCase().includes(q)
      );
    }
    if (filter === "missed") {
      list = list.filter((p) => getCompliance(p) !== "Goal Met");
    } else if (filter === "met") {
      list = list.filter((p) => getCompliance(p) === "Goal Met");
    }
    return list;
  }, [patients, query, filter]);

  // Selected patient object
  const selected = useMemo(() => patients.find((p) => p.id === selectedId) || null, [patients, selectedId]);

  // Actions
  async function handleMarkReviewed(id) {
    // optimistic UI: mark reminders as completed locally
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, reminders: (p.reminders || []).map((r) => ({ ...r, completed: true })) } : p))
    );

    // placeholder: call backend to persist reviewed + audit log
    try {
      // await fetch(`${apiBase}/patients/${id}/reviewed`, { method: "POST", credentials: "include" })
      // await fetch(`${apiBase}/audit`, { method:'POST', body: JSON.stringify({ action:'mark_reviewed', targetId:id}) })
      // no-op for mock
    } catch (e) {
      console.warn("Mark reviewed failed", e);
      // revert optimistic change on error (omitted for brevity)
    }
  }

  function selectPatient(id) {
    setSelectedId(id);
    // placeholder audit log
    // fetch(`${apiBase}/audit`, { method:'POST', body: JSON.stringify({ action:'view_patient', targetId:id}) })
  }

  return {
    patients,
    filtered,
    selected,
    loading,
    query,
    setQuery,
    filter,
    setFilter,
    selectPatient,
    handleMarkReviewed,
    getCompliance,
    progressPercent,
    initials,
  };
}

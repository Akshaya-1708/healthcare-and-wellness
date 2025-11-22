// src/components/ProviderDashboard.jsx
import React, { Suspense, lazy, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useProviderDashboard from "../../../hooks/useProviderDashboard";
import ErrorBoundary from "./shared/ErrorBoundary"; // adjust path if needed

// Lazy-load heavy panels to reduce initial bundle size
const PatientList = lazy(() => import("./parts/PatientList"));
const PatientDetails = lazy(() => import("./parts/PatientDetails"));

/* -------------------------
  Animation variants (Framer Motion)
--------------------------*/
const kpiContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const kpiItem = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
};

const cardHover = { scale: 1.02, boxShadow: "0 8px 20px rgba(13,110,253,0.12)" };

const detailVariants = {
  hidden: { opacity: 0, x: 12 },
  enter: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 160, damping: 20 } },
  exit: { opacity: 0, x: -8, transition: { duration: 0.14 } },
};

function SmallLoading({ text }) {
  return <div className="text-muted small p-3">{text || "Loading…"}</div>;
}

function KPI({ title, value, delta, color }) {
  return (
    <motion.div variants={kpiItem} whileHover={cardHover} className="card border-0 shadow-sm" style={{ background: "linear-gradient(180deg,#fff, #fbfdff)" }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-start">
          <div className="me-3">
            <div style={{ width: 44, height: 44, borderRadius: 10, background: color, display: "grid", placeItems: "center", color: "#fff", fontWeight: 700 }}>
              {title[0]}
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="small text-muted">{title}</div>
            <div className="h5 mb-0" style={{ fontWeight: 700 }}>{value}</div>
            {typeof delta !== "undefined" && (
              <div className="small" style={{ color: delta >= 0 ? "#198754" : "#dc3545" }}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProviderDashboard() {
  const {
    filtered,
    selected,
    loading,
    error,
    refetch,
    query,
    setQuery,
    filter,
    setFilter,
    selectPatient,
    handleMarkReviewed,
    getCompliance,
    progressPercent,
    initials,
  } = useProviderDashboard("/api");

  // stable handlers (reduce prop churn)
  const onSearchChange = useCallback((e) => setQuery(e.target.value), [setQuery]);
  const onSetFilter = useCallback((f) => setFilter(f), [setFilter]);
  const onSelectPatient = useCallback((id) => selectPatient(id), [selectPatient]);
  const onMarkReviewed = useCallback((id) => handleMarkReviewed(id), [handleMarkReviewed]);

  const patientsCount = useMemo(() => (Array.isArray(filtered) ? filtered.length : 0), [filtered]);

  // Prefetch PatientDetails chunk on pointer enter for snappy details load
  const prefetchDetails = useCallback(() => {
    // dynamic import warms the chunk
    import("./parts/PatientDetails");
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#f4f8fb 0%, #ffffff 60%)" }} className="d-flex flex-column">
      {/* Top header */}
      <header style={{ background: `linear-gradient(90deg, #0d6efd, #0b5ed7)` }} className="py-3 text-white shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(255,255,255,0.12)", display: "grid", placeItems: "center", fontWeight: 700 }}>
              WH
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Wellness & Preventive Care</div>
              <div style={{ fontSize: 13, opacity: 0.95 }}>Provider Dashboard — assigned patients & compliance</div>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <div className="me-3 text-end" style={{ fontSize: 13 }}>
              <div className="text-white-50" style={{ fontSize: 12 }}>Signed in as</div>
              <div style={{ fontWeight: 700 }}>Dr. Priya</div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", color: "#0b5ed7", fontWeight: 700 }}>
              DP
            </motion.div>
          </div>
        </div>
      </header>

      {/* KPI Row with staggered entrance */}
      <div className="container my-4">
        <motion.div initial="hidden" animate="show" variants={kpiContainer} className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-4">
            <KPI title="Total Patients" value={patientsCount} delta={+3} color="#0d6efd" />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <KPI title="Missed" value={filtered.filter((p) => getCompliance(p) !== "Goal Met").length} delta={-2} color="#dc3545" />
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <KPI title="Goal Met" value={filtered.filter((p) => getCompliance(p) === "Goal Met").length} delta={+8} color="#198754" />
          </div>
          <div className="col-12 col-md-12 col-lg-4">
            <motion.div variants={kpiItem} whileHover={cardHover} className="card border-0 shadow-sm" style={{ background: "#fff" }}>
              <div className="card-body p-3 d-flex gap-3 align-items-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0b5ed7" strokeWidth="1.5"><path d="M12 22s8-4 8-10V6l-8-4-8 4v6c0 6 8 10 8 10z"/></svg>
                <div>
                  <div className="small text-muted">Clinic</div>
                  <div style={{ fontWeight: 700 }}>Downtown Wellness Center</div>
                </div>
                <div className="ms-auto small text-muted">Updated: {new Date().toLocaleDateString()}</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <main className="container mb-4">
        <div className="row gx-3">
          {/* Left column: controls + list */}
          <aside className="col-12 col-lg-4">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="card shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-2" style={{ width: 52, height: 52, borderRadius: 12, background: "#f4f7fb", display: "grid", placeItems: "center" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0b5ed7" strokeWidth="1.5"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="6"/></svg>
                  </div>
                  <div className="flex-grow-1">
                    <input
                      className="form-control form-control-lg"
                      placeholder="Search patients, email or allergy..."
                      value={query}
                      onChange={onSearchChange}
                      aria-label="search patients"
                    />
                    <div className="small text-muted mt-1">Tip: search by name, email, allergy or medication</div>
                  </div>
                </div>

                <div className="d-flex gap-2 mb-3 flex-wrap">
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => onSetFilter("all")} className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-secondary"}`}>All</motion.button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => onSetFilter("missed")} className={`btn btn-sm ${filter === "missed" ? "btn-danger" : "btn-outline-secondary"}`}>Missed</motion.button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => onSetFilter("met")} className={`btn btn-sm ${filter === "met" ? "btn-success" : "btn-outline-secondary"}`}>Goal Met</motion.button>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => refetch && refetch()} className="btn btn-sm btn-outline-info ms-auto">Refresh</motion.button>
                </div>

                <hr />

                <div style={{ maxHeight: 520, overflow: "auto" }} onPointerEnter={prefetchDetails}>
                  {error && (
                    <div className="alert alert-warning small">Failed to load patients. <button className="btn btn-sm btn-link" onClick={() => refetch && refetch()}>Retry</button></div>
                  )}

                  <Suspense fallback={<SmallLoading text="Loading patients…" />}>
                    <ErrorBoundary>
                      {/* PatientList is a separate component that maps items; it can add its own motion if desired */}
                      <PatientList
                        filtered={filtered}
                        loading={loading}
                        selectedId={selected?.id}
                        onSelect={onSelectPatient}
                        getCompliance={getCompliance}
                        initials={initials}
                      />
                    </ErrorBoundary>
                  </Suspense>
                </div>

                <div className="mt-3 small text-muted">Showing <strong>{patientsCount}</strong> patients</div>
              </div>
            </motion.div>
          </aside>

          {/* Right column: details */}
          <section className="col-12 col-lg-8">
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="card shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body" style={{ minHeight: 520 }}>
                <Suspense fallback={<SmallLoading text="Loading details…" />}>
                  <ErrorBoundary>
                    <AnimatePresence mode="wait" initial={false}>
                      {selected ? (
                        <motion.div
                          key={selected.id}
                          variants={detailVariants}
                          initial="hidden"
                          animate="enter"
                          exit="exit"
                        >
                          {/* The internals of the details UI are unchanged; they animate as the container transitions */}
                          <div className="row g-3">
                            <div className="col-12">
                              <div className="d-flex align-items-center gap-3">
                                <motion.div layoutId={`avatar-${selected.id}`} style={{ width: 80, height: 80, borderRadius: 14, background: "#0d6efd", color: "#fff", display: "grid", placeItems: "center", fontSize: 28, fontWeight: 800 }}>
                                  {initials(selected.name)}
                                </motion.div>
                                <div>
                                  <div style={{ fontSize: 20, fontWeight: 800 }}>{selected.name}</div>
                                  <div className="small text-muted">{selected.email} • Last visit: {selected.lastVisit}</div>
                                  <div className="mt-2">
                                    <span className={`badge ${getCompliance(selected) === "Goal Met" ? "bg-success" : "bg-danger"} me-2`}>{getCompliance(selected)}</span>
                                    <span className="small text-muted">Age: {selected.age || "—"}</span>
                                  </div>
                                </div>

                                <div className="ms-auto d-flex gap-2">
                                  <motion.button whileTap={{ scale: 0.98 }} className="btn btn-outline-secondary" onClick={() => alert("Open full record (not implemented)")}>Full record</motion.button>
                                  <motion.button whileTap={{ scale: 0.98 }} className="btn btn-primary" onClick={() => onMarkReviewed(selected.id)}>Mark Reviewed</motion.button>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 col-md-6">
                              <div className="d-flex gap-2 flex-wrap">
                                <div className="card p-2 flex-grow-1" style={{ minWidth: 150 }}>
                                  <div className="small text-muted">Allergies</div>
                                  <div style={{ fontWeight: 700 }}>{selected.allergies || "None"}</div>
                                </div>
                                <div className="card p-2 flex-grow-1" style={{ minWidth: 150 }}>
                                  <div className="small text-muted">Medications</div>
                                  <div style={{ fontWeight: 700 }}>{selected.medications || "None"}</div>
                                </div>
                                <div className="card p-2" style={{ minWidth: 120 }}>
                                  <div className="small text-muted">Age</div>
                                  <div style={{ fontWeight: 700 }}>{selected.age || "—"}</div>
                                </div>
                              </div>

                              <div className="mt-3">
                                <h6 className="mb-2">Recent Goals</h6>
                                {selected.goals && selected.goals.length > 0 ? (
                                  selected.goals.map((g, i) => {
                                    const pct = progressPercent(g);
                                    return (
                                      <div key={i} className="mb-2">
                                        <div className="d-flex justify-content-between small">
                                          <div>{g.type}</div>
                                          <div className="text-muted">{g.value}/{g.target}</div>
                                        </div>
                                        <div className="progress" style={{ height: 10, borderRadius: 6 }}>
                                          <div className={`progress-bar ${pct >= 100 ? "bg-success" : ""}`} role="progressbar" style={{ width: `${pct}%` }} aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" />
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-muted small">No goals logged yet.</div>
                                )}
                              </div>
                            </div>

                            <div className="col-12 col-md-6">
                              <h6 className="mb-2">Compliance History</h6>
                              <ul className="timeline list-unstyled">
                                {(selected.reminders || []).map((r, i) => (
                                  <li key={i} className="d-flex align-items-start mb-3">
                                    <div style={{ width: 12, height: 12, marginRight: 12, marginTop: 6, borderRadius: "50%", background: r.completed ? "#198754" : "#dc3545" }} />
                                    <div>
                                      <div style={{ fontWeight: 700 }}>{r.title}</div>
                                      <div className="small text-muted">{new Date(r.date).toLocaleDateString()}</div>
                                    </div>
                                    <div className="ms-auto">
                                      <span className={`badge ${r.completed ? "bg-success" : "bg-danger"}`}>{r.completed ? "Completed" : "Missed"}</span>
                                    </div>
                                  </li>
                                ))}
                                {(selected.reminders || []).length === 0 && <li className="text-muted small">No reminders recorded.</li>}
                              </ul>

                              <div className="mt-4 d-flex gap-2">
                                <motion.button whileTap={{ scale: 0.98 }} className="btn btn-outline-primary">Message Patient</motion.button>
                                <motion.button whileTap={{ scale: 0.98 }} className="btn btn-outline-secondary">Schedule Follow-up</motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="no-selection" variants={detailVariants} initial="hidden" animate="enter" exit="exit" className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-5">
                          <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5"><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4z"/><path d="M6.2 20a6 6 0 0 1 11.6 0"/></svg>
                          <h5 className="mt-3 mb-1">Select a patient</h5>
                          <p className="text-muted small px-3">Click any patient from the left to view goals, vitals and compliance history.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </ErrorBoundary>
                </Suspense>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3" style={{ background: "#fff" }}>
        <div className="container d-flex justify-content-between align-items-center small text-muted">
          <div>© {new Date().getFullYear()} Wellness & Preventive Care Portal</div>
          <div>Built with care — internal demo</div>
        </div>
      </footer>
    </div>
  );
}

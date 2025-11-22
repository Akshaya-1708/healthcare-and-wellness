// src/components/pages/ProviderDashboard/parts/PatientDetails.jsx
import React, { useCallback } from "react";
import PropTypes from "prop-types";

/**
 * PatientDetails
 *
 * Props:
 * - selected: full patient object (or null)
 * - onMarkReviewed(id): callback to mark reviewed (stable)
 * - getCompliance(patient): helper from hook
 * - progressPercent(goal): helper to compute progress percent
 *
 * Notes:
 * - Designed to be memoized by parent via stable props; still exported with React.memo.
 * - Handles errors from onMarkReviewed with try/catch and user-friendly message.
 */

function PatientDetailsInner({ selected, onMarkReviewed, getCompliance, progressPercent }) {
  const handleMark = useCallback(async () => {
    if (!selected) return;
    try {
      await onMarkReviewed(selected.id);
      // consider showing a non-blocking toast here (not implemented)
    } catch (err) {
      console.error("Mark reviewed failed:", err);
      // friendly fallback
      alert("Could not mark as reviewed. Please try again.");
    }
  }, [onMarkReviewed, selected]);

  if (!selected) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6c757d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4z"></path>
          <path d="M6.2 20a6 6 0 0 1 11.6 0"></path>
        </svg>
        <h5 className="mt-3 mb-1">Select a patient</h5>
        <p className="text-muted small px-3">Click any patient from the left to view goals, compliance history and basic health information.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h4 className="mb-0">{selected.name}</h4>
          <div className="small text-muted">{selected.email} • Last visit: {selected.lastVisit}</div>
        </div>

        <div className="text-end">
          <div className="small text-muted">Status</div>
          <div className="mt-1">
            <span className={`badge ${getCompliance(selected) === "Goal Met" ? "bg-success" : "bg-danger"} fs-6`}>{getCompliance(selected)}</span>
          </div>
        </div>
      </div>

      <hr />

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <h6>Recent Goals</h6>
          <div className="mb-3">
            {selected.goals && selected.goals.length > 0 ? (
              selected.goals.map((g, i) => {
                const pct = progressPercent(g);
                return (
                  <div key={i} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <div className="small">{g.type}</div>
                      <div className="small text-muted">{g.value}/{g.target}</div>
                    </div>
                    <div className="progress" style={{ height: 10 }}>
                      <div
                        className={`progress-bar ${pct >= 100 ? "bg-success" : ""}`}
                        role="progressbar"
                        style={{ width: `${pct}%` }}
                        aria-valuenow={pct}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-muted small">No goals logged yet.</div>
            )}
          </div>

          <h6>Compliance History</h6>
          <ul className="list-group mb-3">
            {(selected.reminders || []).map((r, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">{r.title}</div>
                  <div className="small text-muted">{new Date(r.date).toLocaleDateString()}</div>
                </div>
                <span className={`badge ${r.completed ? "bg-success" : "bg-danger"} align-self-center`}>{r.completed ? "Completed" : "Missed"}</span>
              </li>
            ))}
            {(selected.reminders || []).length === 0 && <li className="list-group-item text-muted small">No reminders recorded.</li>}
          </ul>
        </div>

        <div className="col-12 col-lg-4">
          <h6>Basic Health Info</h6>
          <div className="mb-3 small text-muted">
            <div><strong>Allergies:</strong> {selected.allergies || "None recorded"}</div>
            <div><strong>Medications:</strong> {selected.medications || "None recorded"}</div>
            <div><strong>Age:</strong> {selected.age || "—"}</div>
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-outline-primary" onClick={() => alert("Open full record (not implemented)")}>View Full Record</button>
            <button className="btn btn-primary" onClick={handleMark}>Mark as Reviewed</button>
          </div>

          <div className="mt-4 small text-muted">
            <div><strong>Audit:</strong> Viewing this patient will log an audit event (placeholder).</div>
          </div>
        </div>
      </div>
    </div>
  );
}

PatientDetailsInner.propTypes = {
  selected: PropTypes.object,
  onMarkReviewed: PropTypes.func, // kept for backward compat; actual prop name used is onMarkReviewed or onMark in parent
  getCompliance: PropTypes.func.isRequired,
  progressPercent: PropTypes.func.isRequired,
};

export default React.memo(PatientDetailsInner);

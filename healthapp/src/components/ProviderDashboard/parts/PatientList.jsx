// src/components/pages/ProviderDashboard/parts/PatientList.jsx
import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

/**
 * PatientList
 *
 * Props (kept minimal so parent can memoize and child re-renders are small):
 * - filtered: array of patient objects
 * - loading: boolean
 * - selectedId: currently selected patient id
 * - onSelect(id): callback to select a patient
 * - getCompliance(patient): returns compliance string
 * - initials(name): returns initials string
 *
 * Notes:
 * - This component is wrapped with React.memo at export to avoid re-renders when props are stable.
 * - For very large lists (>200 items) replace the mapped list with virtualization (react-window).
 */

function RowItem({ p, isSelected, onSelect, getCompliance, initials }) {
  const handleClick = useCallback(() => onSelect(p.id), [onSelect, p.id]);

  const status = getCompliance(p);
  const badgeClass = status === "Goal Met" ? "bg-success" : "bg-danger";

  return (
    <button
      type="button"
      className={`list-group-item list-group-item-action d-flex align-items-start gap-3 ${isSelected ? "active" : ""}`}
      onClick={handleClick}
    >
      <div
        className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
        style={{ width: 48, height: 48, fontWeight: 700 }}
        aria-hidden
      >
        {initials(p.name)}
      </div>

      <div className="flex-grow-1 text-start">
        <div className="d-flex justify-content-between align-items-center">
          <div className="fw-semibold">{p.name}</div>
          <small className="text-muted">{p.age ? `${p.age} yrs` : ""}</small>
        </div>
        <div className="small text-muted">{p.email}</div>
        <div className="mt-2">
          <span className={`badge ${badgeClass}`}>{status}</span>
        </div>
      </div>
    </button>
  );
}

RowItem.propTypes = {
  p: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  getCompliance: PropTypes.func.isRequired,
  initials: PropTypes.func.isRequired,
};

function PatientListInner({ filtered = [], loading = false, selectedId = null, onSelect, getCompliance, initials }) {
  // limit render to first N in non-virtualized mode (cheap pagination)
  const MAX_RENDER = 500; // safe guard, adjust as needed
  const showVirtualHint = filtered.length > 200;

  const visible = useMemo(() => filtered.slice(0, MAX_RENDER), [filtered]);

  return (
    <>
      {loading && <div className="text-muted small p-3">Loading patients…</div>}

      {!loading && filtered.length === 0 && <div className="p-3 text-center text-muted small">No patients match the current filters.</div>}

      {!loading && filtered.length > 0 && (
        <>
          {showVirtualHint && (
            <div className="small text-muted px-3 mb-2">Tip: enable list virtualization for large datasets (recommended).</div>
          )}

          {/* Simple mapped list (non-virtualized). If you have very large lists, replace this with react-window. */}
          <div>
            {visible.map((p) => (
              <RowItem
                key={p.id}
                p={p}
                isSelected={selectedId === p.id}
                onSelect={onSelect}
                getCompliance={getCompliance}
                initials={initials}
              />
            ))}

            {filtered.length > MAX_RENDER && (
              <div className="p-2 small text-muted text-center">Showing first {MAX_RENDER} patients. Narrow your search or enable virtualization.</div>
            )}
          </div>
        </>
      )}
    </>
  );
}

PatientListInner.propTypes = {
  filtered: PropTypes.array,
  loading: PropTypes.bool,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func.isRequired,
  getCompliance: PropTypes.func.isRequired,
  initials: PropTypes.func.isRequired,
};

/* ========= Virtualization hint (optional) =========
If you install react-window, you can replace the mapped list with something like:

import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }) => {
  const p = filtered[index];
  return (
    <div style={style}>
      <RowItem ... />
    </div>
  );
};

<List
  height={600}
  itemCount={filtered.length}
  itemSize={72}
  width="100%"
>
  {Row}
</List>

This reduces DOM nodes and greatly improves performance for very large lists.
================================================== */

export default React.memo(PatientListInner);

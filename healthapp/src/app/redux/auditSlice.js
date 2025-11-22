import { createSlice } from '@reduxjs/toolkit'

// Load from localStorage on startup
const loadLogsFromStorage = () => {
  try {
    const raw = localStorage.getItem('auditLogs')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (e) {
    console.error('Failed to parse auditLogs from localStorage', e)
    return []
  }
}

const initialState = {
  logs: loadLogsFromStorage(),
}

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    logEvent(state, action) {
      const { action: act, details } = action.payload
      const entry = {
        id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        timestamp: new Date().toISOString(),
        action: act,
        details,
      }

      // Push to Redux state
      state.logs.push(entry)

      // Persist to localStorage
      try {
        localStorage.setItem('auditLogs', JSON.stringify(state.logs))
      } catch (e) {
        console.error('Failed to save auditLogs to localStorage', e)
      }
    },
  },
})

export const { logEvent } = auditSlice.actions
export default auditSlice.reducer

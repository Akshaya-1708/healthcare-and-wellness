import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  goals: [
    {
      id: 'goal-steps',
      label: 'Daily Steps',
      type: 'steps',
      unit: 'steps',
      dailyTarget: 10000,
    },
    {
      id: 'goal-water',
      label: 'Water Intake',
      type: 'water',
      unit: 'glasses',
      dailyTarget: 8,
    },
    {
      id: 'goal-sleep',
      label: 'Sleep',
      type: 'sleep',
      unit: 'hours',
      dailyTarget: 8,
    },
  ],
  entries: JSON.parse(localStorage.getItem("goalEntries") || "{}") // normalized: entries[date][goalId] = value
}

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    saveEntry(state, action) {
  const { patientId, goalId, date, value } = action.payload

  if (!state.entries[date]) {
    state.entries[date] = {}
  }

  state.entries[date][goalId] = value

  // persist entries
  localStorage.setItem("goalEntries", JSON.stringify(state.entries))
}

  },
})

export const { saveEntry } = goalsSlice.actions
export default goalsSlice.reducer

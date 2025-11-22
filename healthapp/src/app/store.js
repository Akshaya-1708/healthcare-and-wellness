
import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { productApi } from '../app/service/patientDashboard.js'
import { patientApi } from './service/patientDetails.js'
import goalsReducer from "../app/redux/goalSlice.js"
import auditReducer from "../app/redux/auditSlice.js"

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [productApi.reducerPath]: productApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,

    goals: goalsReducer,
    audit: auditReducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
 middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware()
    .concat(productApi.middleware)
    .concat(patientApi.middleware),
 devTools: true, // alw
})


// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
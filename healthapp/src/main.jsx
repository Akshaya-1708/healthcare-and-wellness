import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { store } from './app/Store.js'// normal redux toolkit store import
import { Provider } from 'react-redux'
import { store } from './app/store.js' // updated store import with counter slice

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

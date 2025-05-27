import { Routes, Route } from 'react-router-dom'

import App from './App/App'
import Sso from './SSO/Sso'

export default function AppRoutes () {
  return (
    <Routes>
      <Route path="/Utilitario" element={<App />} />
      <Route path="/Utilitario/sso" element={<Sso />} />
    </Routes>
  )
}

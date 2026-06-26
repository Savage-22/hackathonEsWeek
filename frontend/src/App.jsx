import { Routes, Route } from 'react-router'

import FarmerGuard from './shared/guards/FarmerGuard.jsx'
import InstitutionalGuard from './shared/guards/InstitutionalGuard.jsx'
import FarmerLoginPage from './domains/farmer/auth/pages/FarmerLoginPage.jsx'
import FarmerHomePage from './domains/farmer/home/pages/FarmerHomePage.jsx'
import InstitutionalLoginPage from './domains/institutional/auth/pages/InstitutionalLoginPage.jsx'
import PanelHomePage from './domains/institutional/dashboard/pages/PanelHomePage.jsx'
import HealthCheckPage from './domains/system/health/pages/HealthCheckPage.jsx'

export default function App() {
    return (
        <Routes>
            {/* Agricultor (PWA) */}
            <Route path="/login" element={<FarmerLoginPage />} />
            <Route element={<FarmerGuard />}>
                <Route path="/" element={<FarmerHomePage />} />
            </Route>

            {/* Institucional (panel) */}
            <Route path="/panel/login" element={<InstitutionalLoginPage />} />
            <Route element={<InstitutionalGuard />}>
                <Route path="/panel" element={<PanelHomePage />} />
            </Route>

            <Route path="/health-check" element={<HealthCheckPage />} />
        </Routes>
    )
}

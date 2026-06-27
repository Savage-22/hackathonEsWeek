import { Routes, Route, Navigate } from 'react-router'

import FarmerGuard from './shared/guards/FarmerGuard.jsx'
import InstitutionalGuard from './shared/guards/InstitutionalGuard.jsx'
import LandingPage from './domains/public/landing/pages/LandingPage.jsx'
import FarmerLoginPage from './domains/farmer/auth/pages/FarmerLoginPage.jsx'
import FarmerRegisterPage from './domains/farmer/auth/pages/FarmerRegisterPage.jsx'
import FarmerHomePage from './domains/farmer/home/pages/FarmerHomePage.jsx'
import InstitutionalLoginPage from './domains/institutional/auth/pages/InstitutionalLoginPage.jsx'
import PanelHomePage from './domains/institutional/dashboard/pages/PanelHomePage.jsx'
import HealthCheckPage from './domains/system/health/pages/HealthCheckPage.jsx'

export default function App() {
    return (
        <Routes>
            {/* Landing pública */}
            <Route path="/" element={<LandingPage />} />

            {/* Agricultor (PWA) */}
            <Route path="/login" element={<FarmerLoginPage />} />
            <Route path="/registro" element={<FarmerRegisterPage />} />
            <Route element={<FarmerGuard />}>
                <Route path="/app" element={<FarmerHomePage />} />
            </Route>

            {/* Institucional (panel) */}
            <Route path="/panel/login" element={<InstitutionalLoginPage />} />
            <Route element={<InstitutionalGuard />}>
                <Route path="/panel" element={<PanelHomePage />} />
            </Route>

            <Route path="/health-check" element={<HealthCheckPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

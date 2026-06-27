import { Routes, Route, Navigate } from 'react-router'

import FarmerGuard from './shared/guards/FarmerGuard.jsx'
import InstitutionalGuard from './shared/guards/InstitutionalGuard.jsx'
import PublicLayout from './domains/public/landing/components/PublicLayout.jsx'
import HomePage from './domains/public/landing/pages/HomePage.jsx'
import HowItWorksPage from './domains/public/landing/pages/HowItWorksPage.jsx'
import FeaturesPage from './domains/public/landing/pages/FeaturesPage.jsx'
import TraceabilityPage from './domains/public/landing/pages/TraceabilityPage.jsx'
import IncentivesPage from './domains/public/landing/pages/IncentivesPage.jsx'
import ContactPage from './domains/public/landing/pages/ContactPage.jsx'
import FarmerLoginPage from './domains/farmer/auth/pages/FarmerLoginPage.jsx'
import FarmerRegisterPage from './domains/farmer/auth/pages/FarmerRegisterPage.jsx'
import FarmerHomePage from './domains/farmer/home/pages/FarmerHomePage.jsx'
import InstitutionalLoginPage from './domains/institutional/auth/pages/InstitutionalLoginPage.jsx'
import PanelHomePage from './domains/institutional/dashboard/pages/PanelHomePage.jsx'
import HealthCheckPage from './domains/system/health/pages/HealthCheckPage.jsx'

export default function App() {
    return (
        <Routes>
            {/* Vistas públicas (cada una con su ruta) */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/como-funciona" element={<HowItWorksPage />} />
                <Route path="/caracteristicas" element={<FeaturesPage />} />
                <Route path="/trazabilidad" element={<TraceabilityPage />} />
                <Route path="/incentivos" element={<IncentivesPage />} />
                <Route path="/contacto" element={<ContactPage />} />
            </Route>

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

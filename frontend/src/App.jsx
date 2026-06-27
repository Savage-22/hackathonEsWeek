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
import LoginPage from './domains/auth/pages/LoginPage.jsx'
import FarmerRegisterPage from './domains/farmer/auth/pages/FarmerRegisterPage.jsx'
import FarmerHomePage from './domains/farmer/home/pages/FarmerHomePage.jsx'
import FarmerProfilePage from './domains/farmer/profile/pages/FarmerProfilePage.jsx'
import FarmerPlotsPage from './domains/farmer/plots/pages/FarmerPlotsPage.jsx'
import FarmerApplicationsPage from './domains/farmer/applications/pages/FarmerApplicationsPage.jsx'
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

            {/* Acceso unificado: un solo login con selector de rol */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<FarmerRegisterPage />} />

            {/* Agricultor (PWA) */}
            <Route element={<FarmerGuard />}>
                <Route path="/app" element={<FarmerHomePage />} />
                <Route path="/app/perfil" element={<FarmerProfilePage />} />
                <Route path="/app/parcelas" element={<FarmerPlotsPage />} />
                <Route path="/app/parcelas/:plotLocalId" element={<FarmerApplicationsPage />} />
            </Route>

            {/* Institucional (panel) — mismo login con la pestaña institucional activa */}
            <Route path="/panel/login" element={<LoginPage defaultRole="institutional" />} />
            <Route element={<InstitutionalGuard />}>
                <Route path="/panel" element={<PanelHomePage />} />
            </Route>

            <Route path="/health-check" element={<HealthCheckPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

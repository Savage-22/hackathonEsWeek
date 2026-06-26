import { Routes, Route } from 'react-router'

import HealthCheckPage from './domains/system/health/pages/HealthCheckPage.jsx'

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<HealthCheckPage />} />
        </Routes>
    )
}

import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// Al cambiar de ruta pública, vuelve al inicio de la página.
function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

// Layout compartido por todas las vistas públicas: navbar + contenido + footer.
export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-cream font-sans text-ink">
            <ScrollToTop />
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

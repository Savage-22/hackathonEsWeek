import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

// Landing pública de AgroGuardian (#46): una sola página con secciones ancladas.
// Por ahora solo el shell (navbar + footer); las secciones se agregan por combos.
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-cream font-sans text-ink">
            <Navbar />
            <main id="inicio">
                {/* Secciones: hero, qué es, cadena, cómo funciona, características,
                    trazabilidad, incentivos, contacto — se construyen por combos. */}
            </main>
            <Footer />
        </div>
    )
}

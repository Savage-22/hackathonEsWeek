import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import HeroSection from '../components/HeroSection.jsx'
import WhatIsSection from '../components/WhatIsSection.jsx'
import ChainSection from '../components/ChainSection.jsx'
import HowItWorksSection from '../components/HowItWorksSection.jsx'
import FinalCtaSection from '../components/FinalCtaSection.jsx'

// Landing pública de AgroGuardian (#46): una sola página con secciones ancladas.
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-cream font-sans text-ink">
            <Navbar />
            <main id="inicio">
                <HeroSection />
                <WhatIsSection />
                <ChainSection />
                <HowItWorksSection />
                {/* Secciones características, trazabilidad, incentivos, contacto —
                    se construyen en los próximos combos. */}
                <FinalCtaSection />
            </main>
            <Footer />
        </div>
    )
}

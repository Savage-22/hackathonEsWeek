import HeroSection from '../components/HeroSection.jsx'
import WhatIsSection from '../components/WhatIsSection.jsx'
import ChainSection from '../components/ChainSection.jsx'
import FinalCtaSection from '../components/FinalCtaSection.jsx'

// Inicio (/): presentación general de AgroGuardian con accesos a las demás vistas.
export default function HomePage() {
    return (
        <>
            <HeroSection />
            <WhatIsSection />
            <ChainSection />
            <FinalCtaSection />
        </>
    )
}

import logo from '../../../../assets/logo.jpeg'

// Layout de autenticación con panel dividido: lado verde con identidad de marca
// (título, descripción y contenido inferior variable) + lado del formulario.
export default function AuthLayout({ title, subtitle, description, aside, children }) {
    return (
        <main className="grid min-h-screen place-items-center bg-cream p-4 font-sans">
            <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
                {/* Panel de marca */}
                <aside
                    className="relative flex flex-col overflow-hidden p-10 text-white"
                    style={{ background: 'linear-gradient(150deg, #1a5d36 0%, #0f3d24 100%)' }}
                >
                    <span className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/5" />

                    <div className="relative flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white">
                            <img src={logo} alt="" className="h-8 w-8 object-contain" />
                        </span>
                        <span className="font-display text-lg font-bold">AgroGuardian</span>
                    </div>

                    <div className="relative mt-10">
                        <h1 className="font-display text-3xl font-bold leading-tight">{title}</h1>
                        {subtitle && <p className="mt-1 text-xl text-white/90">{subtitle}</p>}
                        {description && <p className="mt-4 max-w-xs leading-relaxed text-white/70">{description}</p>}
                    </div>

                    {aside && <div className="relative mt-auto pt-10">{aside}</div>}
                </aside>

                {/* Panel del formulario */}
                <section className="p-8 sm:p-10">{children}</section>
            </div>
        </main>
    )
}

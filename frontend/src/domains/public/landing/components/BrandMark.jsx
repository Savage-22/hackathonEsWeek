import logo from '../../../../assets/logo.jpeg'

// Logo + wordmark de AgroGuardian. `tone` adapta el color del texto al fondo
// (claro sobre cream en la navbar, claro sobre verde en el footer).
export default function BrandMark({ tone = 'dark' }) {
    const title = tone === 'light' ? 'text-white' : 'text-ink'
    const subtitle = tone === 'light' ? 'text-white/60' : 'text-muted'

    return (
        <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white shadow-sm">
                <img src={logo} alt="" className="h-9 w-9 object-contain" />
            </span>
            <span className="leading-tight">
                <span className={`block font-display text-lg font-bold ${title}`}>AgroGuardian</span>
                <span className={`block text-[10px] font-medium tracking-[0.18em] ${subtitle}`}>
                    ALLPA · TIERRA SEGURA
                </span>
            </span>
        </div>
    )
}

// Placeholder de imagen con rayas diagonales (mientras no hay fotos reales).
// `base` y `stripe` permiten teñirlo por audiencia (verde, azul, ámbar...).
export default function StripedPlaceholder({
    base = 'rgba(20, 83, 45, 0.06)',
    stripe = 'rgba(20, 83, 45, 0.10)',
    className = '',
    children,
}) {
    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{
                backgroundColor: base,
                backgroundImage: `repeating-linear-gradient(45deg, ${stripe} 0 1px, transparent 1px 14px)`,
            }}
        >
            {children}
        </div>
    )
}

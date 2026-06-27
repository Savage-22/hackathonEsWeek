// Lista de barras horizontales reutilizable (#24): aplicaciones por distrito,
// pesticidas más usados, etc. Cada item: { label, value, hint? }. La barra se
// dimensiona contra el valor máximo para que la comparación sea visual.
export default function BarList({ title, icon: Icon, items, emptyText = 'Sin datos.' }) {
    const max = items.reduce((acc, item) => Math.max(acc, item.value), 0) || 1

    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {Icon && <Icon size={15} className="text-forest" />} {title}
            </h2>

            {items.length === 0 ? (
                <p className="text-sm text-muted">{emptyText}</p>
            ) : (
                <ul className="space-y-3">
                    {items.map((item) => (
                        <li key={item.label}>
                            <div className="flex items-baseline justify-between gap-2 text-sm">
                                <span className="truncate font-medium text-ink">{item.label}</span>
                                <span className="shrink-0 text-muted">
                                    {item.value}
                                    {item.hint && <span className="ml-1 text-xs">{item.hint}</span>}
                                </span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-beige">
                                <div
                                    className="h-full rounded-full bg-forest"
                                    style={{ width: `${Math.round((item.value / max) * 100)}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

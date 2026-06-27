import { useEffect, useRef } from 'react'
import { MapPinned } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Marcador HTML propio: evita el problema de rutas de iconos de Leaflet bajo
// bundlers (mismo enfoque que LocationPicker).
const pinIcon = L.divIcon({
    className: '',
    html: '<div style="font-size:24px;line-height:1;transform:translate(-50%,-100%)">📍</div>',
    iconSize: [0, 0],
})

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"]/g, (char) => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]
    ))
}

// Mapa de parcelas georreferenciadas (#24). Centra/ajusta el encuadre a todos
// los marcadores con coordenadas.
export default function PlotsMap({ plots }) {
    const mapElement = useRef(null)
    const mapRef = useRef(null)

    useEffect(() => {
        if (!mapElement.current || plots.length === 0) return

        if (!mapRef.current) {
            mapRef.current = L.map(mapElement.current, { attributionControl: false })
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapRef.current)
        }

        const markers = plots.map((plot) =>
            L.marker([plot.latitude, plot.longitude], { icon: pinIcon }).bindPopup(
                `<strong>${escapeHtml(plot.name)}</strong><br>${escapeHtml(plot.crop)}<br>` +
                `<span style="color:#5b6b60">${escapeHtml(plot.farmer)}${plot.district ? ' · ' + escapeHtml(plot.district) : ''}</span>`,
            ),
        )
        const layer = L.layerGroup(markers).addTo(mapRef.current)

        const bounds = L.latLngBounds(plots.map((plot) => [plot.latitude, plot.longitude]))
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
        setTimeout(() => mapRef.current?.invalidateSize(), 0)

        return () => { layer.remove() }
    }, [plots])

    // Limpia la instancia de Leaflet al desmontar.
    useEffect(() => () => {
        mapRef.current?.remove()
        mapRef.current = null
    }, [])

    return (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
                <MapPinned size={15} className="text-forest" /> Mapa de parcelas ({plots.length})
            </h2>

            {plots.length === 0 ? (
                <p className="text-sm text-muted">No hay parcelas con coordenadas registradas todavía.</p>
            ) : (
                <div ref={mapElement} className="h-80 w-full overflow-hidden rounded-xl" />
            )}
        </section>
    )
}

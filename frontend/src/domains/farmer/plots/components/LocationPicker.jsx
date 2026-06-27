import { useEffect, useRef, useState } from 'react'
import { MapPin, LocateFixed, LoaderCircle } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { useOnlineStatus } from '../../../../shared/hooks/useOnlineStatus.js'

// Pin propio: evita el problema clásico de las rutas de iconos de Leaflet bajo
// bundlers (los PNG por defecto no resuelven). Es un marcador HTML simple.
const pinIcon = L.divIcon({
    className: '',
    html: '<div style="font-size:28px;line-height:1;transform:translate(-50%,-100%)">📍</div>',
    iconSize: [0, 0],
})

// Captura la ubicación con la Geolocation API (funciona sin red: usa el GPS) y
// muestra un mini-mapa de confirmación cuando hay conexión para cargar las
// teselas de OpenStreetMap.
export default function LocationPicker({ value, onChange }) {
    const online = useOnlineStatus()
    const [status, setStatus] = useState('idle') // idle | locating | error
    const [errorMsg, setErrorMsg] = useState('')

    const mapElement = useRef(null)
    const mapRef = useRef(null)
    const markerRef = useRef(null)

    const capture = () => {
        if (!('geolocation' in navigator)) {
            setStatus('error')
            setErrorMsg('Este dispositivo no permite capturar la ubicación.')
            return
        }
        setStatus('locating')
        setErrorMsg('')
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords
                onChange({
                    latitude: Number(latitude.toFixed(7)),
                    longitude: Number(longitude.toFixed(7)),
                    accuracy: Math.round(accuracy),
                })
                setStatus('idle')
            },
            () => {
                setStatus('error')
                setErrorMsg('No pudimos obtener tu ubicación. Activa el GPS y otorga permiso.')
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        )
    }

    // Inicializa / actualiza el mini-mapa cuando hay coordenadas y conexión.
    useEffect(() => {
        const hasCoords = value?.latitude != null && value?.longitude != null
        if (!online || !hasCoords || !mapElement.current) return

        const center = [value.latitude, value.longitude]
        if (!mapRef.current) {
            mapRef.current = L.map(mapElement.current, {
                zoomControl: false,
                attributionControl: false,
            }).setView(center, 16)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(mapRef.current)
            markerRef.current = L.marker(center, { icon: pinIcon }).addTo(mapRef.current)
        } else {
            mapRef.current.setView(center, 16)
            markerRef.current.setLatLng(center)
        }
        // Recalcula tamaño tras montar (el contenedor parte oculto/0px).
        setTimeout(() => mapRef.current?.invalidateSize(), 0)
    }, [online, value?.latitude, value?.longitude])

    // Limpia el mapa al desmontar para no fugar instancias de Leaflet.
    useEffect(() => () => {
        mapRef.current?.remove()
        mapRef.current = null
    }, [])

    const hasCoords = value?.latitude != null && value?.longitude != null

    return (
        <div className="space-y-3">
            <button
                type="button"
                onClick={capture}
                disabled={status === 'locating'}
                className="inline-flex items-center gap-2 rounded-lg border border-forest/30 bg-forest/5 px-4 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-forest/10 disabled:opacity-60"
            >
                {status === 'locating' ? (
                    <LoaderCircle size={16} className="animate-spin" />
                ) : (
                    <LocateFixed size={16} />
                )}
                {status === 'locating' ? 'Capturando ubicación…' : hasCoords ? 'Volver a capturar' : 'Capturar ubicación GPS'}
            </button>

            {errorMsg && <p className="text-sm text-error">{errorMsg}</p>}

            {hasCoords && (
                <div className="rounded-lg border border-black/10 bg-white p-3">
                    <p className="flex items-center gap-2 text-sm text-ink">
                        <MapPin size={16} className="text-forest" />
                        {value.latitude}, {value.longitude}
                        {value.accuracy != null && (
                            <span className="text-muted">· ±{value.accuracy} m</span>
                        )}
                    </p>

                    {online ? (
                        <div ref={mapElement} className="mt-3 h-44 w-full overflow-hidden rounded-md" />
                    ) : (
                        <p className="mt-3 rounded-md bg-cream px-3 py-2 text-xs text-muted">
                            Ubicación guardada. El mapa de confirmación se mostrará al volver la conexión.
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

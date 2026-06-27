import { useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'

// Captura de foto con la cámara del dispositivo. Usa <input capture> (abre la
// cámara trasera en móvil) en vez de getUserMedia: más simple y funciona offline.
// Devuelve el File al padre para guardarlo como Blob en IndexedDB.
export default function PhotoCapture({ onChange }) {
    const inputRef = useRef(null)
    const [preview, setPreview] = useState(null)

    // Libera la URL del preview para no fugar memoria.
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const handleSelect = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        if (preview) URL.revokeObjectURL(preview)
        setPreview(URL.createObjectURL(file))
        onChange(file)
    }

    const clear = () => {
        if (preview) URL.revokeObjectURL(preview)
        setPreview(null)
        onChange(null)
        if (inputRef.current) inputRef.current.value = ''
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleSelect}
                className="hidden"
            />

            {preview ? (
                <div className="relative inline-block">
                    <img src={preview} alt="Evidencia" className="h-40 w-full rounded-lg object-cover" />
                    <button
                        type="button"
                        onClick={clear}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white"
                        aria-label="Quitar foto"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-forest/40 bg-forest/5 py-6 text-sm font-semibold text-forest"
                >
                    <Camera size={18} />
                    Tomar foto de evidencia
                </button>
            )}
        </div>
    )
}

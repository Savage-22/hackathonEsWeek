import { useEffect, useState } from 'react'
import { Leaf, LogOut, MapPin, SprayCan, ShieldCheck, RefreshCw } from 'lucide-react'

import { getUser } from '../../../../infrastructure/session.js'
import { useLogout } from '../../../../shared/hooks/useLogout.js'
import { loadDashboard } from '../services/dashboardService.js'
import KpiCards from '../components/KpiCards.jsx'
import BarList from '../components/BarList.jsx'
import FarmersTable from '../components/FarmersTable.jsx'
import PlotsMap from '../components/PlotsMap.jsx'

export default function PanelHomePage() {
    const user = getUser()
    const logout = useLogout('/panel/login')
    const [state, setState] = useState({ status: 'loading' })

    const load = () => {
        setState({ status: 'loading' })
        loadDashboard().then(setState)
    }

    useEffect(() => { load() }, [])

    return (
        <main className="min-h-screen bg-surface">
            <header className="border-b border-black/5 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Leaf size={20} className="text-forest" />
                        <span className="font-display font-bold text-ink">AgroGuardian · Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden text-sm text-muted sm:inline">
                            {user?.name} · {user?.role}
                        </span>
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-error"
                        >
                            <LogOut size={15} /> Salir
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-6xl px-5 py-6">
                {state.status === 'loading' && (
                    <p className="py-20 text-center text-muted">Cargando estadísticas…</p>
                )}

                {state.status === 'error' && (
                    <div className="py-20 text-center">
                        <p className="text-muted">No se pudieron cargar las estadísticas.</p>
                        <button
                            type="button"
                            onClick={load}
                            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-deep"
                        >
                            <RefreshCw size={15} /> Reintentar
                        </button>
                    </div>
                )}

                {state.status === 'ok' && (
                    <div className="space-y-6">
                        <KpiCards kpis={state.overview.kpis} />

                        <div className="grid gap-6 lg:grid-cols-3">
                            <BarList
                                title="Aplicaciones por distrito"
                                icon={MapPin}
                                items={state.overview.applicationsByDistrict.map((row) => ({
                                    label: row.district,
                                    value: row.count,
                                }))}
                            />
                            <BarList
                                title="Pesticidas más usados"
                                icon={SprayCan}
                                items={state.overview.topPesticides.map((row) => ({
                                    label: row.name,
                                    value: row.count,
                                }))}
                            />
                            <BarList
                                title="Certificados por distrito"
                                icon={ShieldCheck}
                                items={state.overview.complianceByDistrict.map((row) => ({
                                    label: row.district,
                                    value: row.certified,
                                    hint: `/ ${row.farmers}`,
                                }))}
                            />
                        </div>

                        <PlotsMap plots={state.plots} />

                        <FarmersTable farmers={state.farmers} />
                    </div>
                )}
            </div>
        </main>
    )
}

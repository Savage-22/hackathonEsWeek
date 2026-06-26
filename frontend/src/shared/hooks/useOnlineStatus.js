import { useSyncExternalStore } from 'react'

import { isOnline, onConnectivityChange } from '../../infrastructure/offline/syncManager.js'

// Estado reactivo de conectividad para mostrar indicadores offline en la UI.
export function useOnlineStatus() {
    return useSyncExternalStore(onConnectivityChange, isOnline, () => true)
}

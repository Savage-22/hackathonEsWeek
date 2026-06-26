import SyncModel from '../infrastructure/sync.Model.js'
import { ValidationError } from '../../../shared/errors.js'

/**
 * Sync Service
 *
 * Orquesta la cola offline de la PWA (#8) contra la base de datos. La identidad
 * del agricultor sale del token (nunca del payload), así que cada quien solo
 * sincroniza lo suyo.
 *
 * Registro de entidades sincronizables: cada módulo de dominio amplía este mapa
 * cuando exista su flujo offline (applications #16, batches #20). `columns` es
 * lista blanca: el cliente no puede escribir columnas fuera de ella.
 */
const ENTITIES = {
    plots: {
        table: 'plots',
        idColumn: 'id_plot',
        columns: [
            'name',
            'area_ha',
            'latitude',
            'longitude',
            'crop',
            'planting_date',
            'estimated_harvest_date',
        ],
    },
}

function entityConfig(entity) {
    const config = ENTITIES[entity]
    if (!config) throw new ValidationError(`Entidad no sincronizable: ${entity}`)
    return config
}

class SyncService {
    /**
     * Push: aplica el batch de operaciones offline. Idempotente por `local_id`.
     * Cada operación devuelve su `serverId` para que el cliente marque el
     * registro local como sincronizado. Se procesan en orden; si una falla, las
     * ya aplicadas quedan firmes y el resto se reintenta en el próximo push.
     */
    static async push(farmerId, operations) {
        const applied = []
        for (const op of operations) {
            const config = entityConfig(op.entity)
            const localUid = op.payload?.local_id
            if (!localUid) throw new ValidationError('Cada operación requiere payload.local_id')

            const serverId = await SyncModel.upsertByLocalId(config, farmerId, localUid, op.payload)
            applied.push({ entity: op.entity, localId: op.localId, serverId })
        }
        return applied
    }

    /**
     * Pull: cambios del agricultor posteriores a `since` (last-write-wins por
     * updated_at). Sin `since`, devuelve todo el historial del agricultor.
     */
    static async pull(farmerId, since) {
        const sinceDate = since ? new Date(since) : new Date(0)
        if (Number.isNaN(sinceDate.getTime())) {
            throw new ValidationError('El parámetro since no es una fecha válida')
        }

        const changes = {}
        for (const [entity, config] of Object.entries(ENTITIES)) {
            changes[entity] = await SyncModel.pullSince(config, farmerId, sinceDate.toISOString())
        }
        return { since: sinceDate.toISOString(), changes }
    }
}

export default SyncService

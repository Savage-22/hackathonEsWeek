/**
 * Motor de alertas de buenas prácticas (#18)
 *
 * Evalúa una aplicación contra la recomendación del cultivo y devuelve alertas
 * TIPADAS (cada una con un `type` de ALERT_TYPES, no strings sueltos). Es una
 * función pura: no toca BD ni HTTP, así se prueba aislada y se reutiliza desde
 * el Service. La obtención de datos (recomendación, aplicación previa) ocurre en
 * applications.Service antes de llamar aquí.
 */

export const ALERT_TYPES = {
    DOSE_EXCEEDED: 'DOSE_EXCEEDED',
    HARVEST_BEFORE_WITHDRAWAL: 'HARVEST_BEFORE_WITHDRAWAL',
    APPLICATION_OVERDUE: 'APPLICATION_OVERDUE',
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function addDays(date, days) {
    return new Date(new Date(date).getTime() + days * MS_PER_DAY)
}

function diffInDays(later, earlier) {
    return Math.floor((new Date(later).getTime() - new Date(earlier).getTime()) / MS_PER_DAY)
}

function isoDate(date) {
    return new Date(date).toISOString().slice(0, 10)
}

/**
 * @param {object} input
 * @param {object} input.application      - aplicación recién registrada (dose, applied_at, ...)
 * @param {object} input.plot             - parcela (crop, estimated_harvest_date)
 * @param {object} [input.recommendation] - recomendación cultivo–pesticida (#15)
 * @param {object} [input.previousApplication] - última aplicación previa del mismo producto en la parcela
 * @returns {Array<{type,severity,message,context}>}
 */
export function evaluateApplication({ application, plot, recommendation, previousApplication }) {
    const alerts = []
    // Sin recomendación no hay umbrales contra los cuales comparar.
    if (!recommendation) return alerts

    // Regla 1 — dosis aplicada por encima de la recomendada.
    const applied = Number(application.dose)
    const recommended = Number(recommendation.recommended_dose)
    if (!Number.isNaN(applied) && !Number.isNaN(recommended) && applied > recommended) {
        alerts.push({
            type: ALERT_TYPES.DOSE_EXCEEDED,
            severity: 'danger',
            message: `La dosis aplicada (${applied} ${recommendation.dose_unit}) supera la recomendada (${recommended} ${recommendation.dose_unit}).`,
            context: { applied, recommended, unit: recommendation.dose_unit },
        })
    }

    // Regla 2 — cosecha estimada antes de cumplir los días de carencia.
    if (plot?.estimated_harvest_date && recommendation.withdrawal_days != null) {
        const safeHarvestDate = addDays(application.applied_at, recommendation.withdrawal_days)
        if (new Date(plot.estimated_harvest_date) < safeHarvestDate) {
            alerts.push({
                type: ALERT_TYPES.HARVEST_BEFORE_WITHDRAWAL,
                severity: 'danger',
                message: `No puede cosechar todavía: la carencia es de ${recommendation.withdrawal_days} días, la cosecha segura es a partir del ${isoDate(safeHarvestDate)}.`,
                context: {
                    withdrawalDays: recommendation.withdrawal_days,
                    safeHarvestDate: isoDate(safeHarvestDate),
                    estimatedHarvestDate: isoDate(plot.estimated_harvest_date),
                },
            })
        }
    }

    // Regla 3 — demasiados días desde la última aplicación (frecuencia superada).
    if (previousApplication?.applied_at && recommendation.frequency_days != null) {
        const daysSinceLast = diffInDays(application.applied_at, previousApplication.applied_at)
        if (daysSinceLast > recommendation.frequency_days) {
            alerts.push({
                type: ALERT_TYPES.APPLICATION_OVERDUE,
                severity: 'warning',
                message: `Pasaron ${daysSinceLast} días desde la última aplicación (recomendado cada ${recommendation.frequency_days} días).`,
                context: { daysSinceLast, frequencyDays: recommendation.frequency_days },
            })
        }
    }

    return alerts
}

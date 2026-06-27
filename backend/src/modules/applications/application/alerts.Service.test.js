import { test } from 'node:test'
import assert from 'node:assert/strict'

import { evaluateApplication, ALERT_TYPES } from './alerts.Service.js'

// Recomendación base reutilizable: Papa con Mancozeb (valores del seed #2).
const recommendation = {
    recommended_dose: 2.5,
    dose_unit: 'kg/ha',
    frequency_days: 7,
    withdrawal_days: 14,
}

const plot = { crop: 'Papa', estimated_harvest_date: '2026-12-31' }

function typesOf(alerts) {
    return alerts.map((a) => a.type)
}

// --- Regla 1: dosis excedida -------------------------------------------------
test('dosis por encima de la recomendada → DOSE_EXCEEDED', () => {
    const alerts = evaluateApplication({
        application: { dose: 4, applied_at: '2026-06-01', id_pesticide: 1, id_plot: 1 },
        plot,
        recommendation,
    })
    assert.ok(typesOf(alerts).includes(ALERT_TYPES.DOSE_EXCEEDED))
})

test('dosis dentro de lo recomendado → sin DOSE_EXCEEDED', () => {
    const alerts = evaluateApplication({
        application: { dose: 2.5, applied_at: '2026-06-01', id_pesticide: 1, id_plot: 1 },
        plot,
        recommendation,
    })
    assert.ok(!typesOf(alerts).includes(ALERT_TYPES.DOSE_EXCEEDED))
})

// --- Regla 2: cosecha antes de cumplir la carencia ---------------------------
test('cosecha antes de cumplir carencia → HARVEST_BEFORE_WITHDRAWAL', () => {
    const alerts = evaluateApplication({
        application: { dose: 2, applied_at: '2026-06-01', id_pesticide: 1, id_plot: 1 },
        // carencia 14 días desde 2026-06-01 → segura el 2026-06-15; cosecha el 10 es antes
        plot: { crop: 'Papa', estimated_harvest_date: '2026-06-10' },
        recommendation,
    })
    assert.ok(typesOf(alerts).includes(ALERT_TYPES.HARVEST_BEFORE_WITHDRAWAL))
})

test('cosecha después de la carencia → sin HARVEST_BEFORE_WITHDRAWAL', () => {
    const alerts = evaluateApplication({
        application: { dose: 2, applied_at: '2026-06-01', id_pesticide: 1, id_plot: 1 },
        plot: { crop: 'Papa', estimated_harvest_date: '2026-07-01' },
        recommendation,
    })
    assert.ok(!typesOf(alerts).includes(ALERT_TYPES.HARVEST_BEFORE_WITHDRAWAL))
})

// --- Regla 3: demasiados días desde la última aplicación ---------------------
test('gap mayor que la frecuencia → APPLICATION_OVERDUE', () => {
    const alerts = evaluateApplication({
        application: { dose: 2, applied_at: '2026-06-20', id_pesticide: 1, id_plot: 1 },
        plot,
        recommendation,
        // última hace 19 días, frecuencia 7 → fuera de rango
        previousApplication: { applied_at: '2026-06-01' },
    })
    assert.ok(typesOf(alerts).includes(ALERT_TYPES.APPLICATION_OVERDUE))
})

test('gap dentro de la frecuencia → sin APPLICATION_OVERDUE', () => {
    const alerts = evaluateApplication({
        application: { dose: 2, applied_at: '2026-06-06', id_pesticide: 1, id_plot: 1 },
        plot,
        recommendation,
        // última hace 5 días, frecuencia 7 → ok
        previousApplication: { applied_at: '2026-06-01' },
    })
    assert.ok(!typesOf(alerts).includes(ALERT_TYPES.APPLICATION_OVERDUE))
})

// --- Sin recomendación: no hay umbrales, no hay alertas ----------------------
test('sin recomendación → sin alertas', () => {
    const alerts = evaluateApplication({
        application: { dose: 999, applied_at: '2026-06-01', id_pesticide: 1, id_plot: 1 },
        plot,
        recommendation: undefined,
    })
    assert.equal(alerts.length, 0)
})

// --- Alertas tipadas: cada una trae su `type` de ALERT_TYPES -----------------
test('las alertas son tipadas (type ∈ ALERT_TYPES)', () => {
    const alerts = evaluateApplication({
        application: { dose: 99, applied_at: '2026-06-20', id_pesticide: 1, id_plot: 1 },
        plot: { crop: 'Papa', estimated_harvest_date: '2026-06-10' },
        recommendation,
        previousApplication: { applied_at: '2026-06-01' },
    })
    const valid = new Set(Object.values(ALERT_TYPES))
    assert.ok(alerts.length === 3)
    assert.ok(alerts.every((a) => valid.has(a.type)))
})

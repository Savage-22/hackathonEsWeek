# AgroGuardian

Sistema inteligente para el uso responsable de pesticidas con trazabilidad y funcionamiento **offline** en zonas rurales de Huánuco.

> _Cultivando tecnología, cosechando calidad._

## Estructura del monorepo

| Paquete | Stack | Responsabilidad |
|---------|-------|-----------------|
| `backend/` | Node + Express + PostgreSQL | API REST con arquitectura por capas (Model / Service / Controller) |
| `frontend/` | React + Vite | PWA del agricultor (offline-first) + panel institucional + ficha pública de trazabilidad |

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Puesta en marcha

### Backend

```bash
cd backend
cp .env.example .env      # completar credenciales (DATABASE_URL de Neon, JWT_SECRET)
npm install
npm run migrate           # aplica las migraciones de src/migrations/
npm run seed              # carga catálogo + usuarios demo
npm run dev
```

> **Base de datos (Neon).** Pon la cadena de conexión de Neon en `DATABASE_URL`
> (incluye `?sslmode=require`). Luego `npm run migrate` crea las tablas y `npm run seed`
> inserta el catálogo y los usuarios demo. Alternativamente, puedes pegar el contenido
> de `src/migrations/001_initial_schema.sql` en el editor SQL de Neon y luego correr
> `npm run seed`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

> **PWA / offline.** El frontend es instalable en Android (manifest + service worker
> vía `vite-plugin-pwa`) y arranca sin conexión. Toda escritura de la app del
> agricultor pasa primero por la capa local (IndexedDB con Dexie en
> `src/infrastructure/offline/`) y se sincroniza con el backend al recuperar la red.
> El service worker solo se activa en el build de producción: pruébalo con
> `npm run build && npm run preview`.

### Desde la raíz

```bash
npm run dev:backend
npm run dev:frontend
```

## Convenciones

El proyecto sigue la guía de estilo y filosofía de código del equipo: arquitectura por
capas en el backend, _screaming architecture_ en el frontend, errores tipados, soft delete
y _Conventional Commits_. Cada issue se resuelve en su propia rama (`tipo/descripcion-corta`)
y se cierra con un PR (`Closes #NN`).

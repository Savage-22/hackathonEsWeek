# AgroGuardian AI

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
cp .env.example .env      # completar credenciales
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

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

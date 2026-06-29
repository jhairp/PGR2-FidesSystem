# Frontend — CLAUDE.md

React + Vite. Estructura por módulos, 1:1 con las apps del backend.

## Dependencias clave
- **FullCalendar** (`@fullcalendar/react`, `daygrid`, `timegrid`, `interaction`)
  → usado en `modules/eventos/pages/CalendarioPage.jsx` y
  `CalendarioGeneralPage.jsx`. Estas dependencias viven **únicamente** aquí,
  en `frontend/package.json`. Si aparecen en la raíz del proyecto o en
  `backend/`, es un error de instalación — moverlas aquí y borrar de donde
  no corresponden.

## Módulos (`src/modules/`)
`auth`, `bautizos`, `centros`, `documentos`, `eventos`, `iglesias`, `scanner`, `usuarios`.

## Patrón por módulo
```
modules/<nombre>/
├── components/    # UI específica del módulo
├── hooks/          # ej. useUsuarios.js
├── pages/           # vistas que se montan en rutas (AppRoutes.jsx)
└── services/         # llamadas a la API (axios)
```

## Estructura compartida (`src/`)
```
src/
├── api/axios.js              # instancia base de axios
├── components/
│   ├── layout/                  # Navbar, Sidebar, MainLayout, RoleLayout, UserLayout
│   └── ui/                        # componentes UI reutilizables (Modal, Buttons, etc.)
├── routes/AppRoutes.jsx
└── pages/Dashboard.jsx
```

## Convenciones
- Toda llamada a la API pasa por `services/` del módulo correspondiente,
  usando la instancia de `src/api/axios.js`.
- Estado de datos remotos vive en hooks (`use<Modulo>.js`), no en componentes.
- Antes de crear un componente UI nuevo en `components/ui/`, revisar si ya
  existe uno equivalente.

## Puntos sensibles para contexto/tokens
- `node_modules/` — nunca leer ni incluir en búsquedas.
- `dist/`, `.vite/` — artefactos generados, ignorar.

## Comandos
```bash
npm run dev
npm run build
npm run lint
```

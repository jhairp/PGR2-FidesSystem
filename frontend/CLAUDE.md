# Frontend — CLAUDE.md

React + Vite. Estructura por módulos, 1:1 con las apps del backend.

## Módulos (`src/modules/`)
`auth`, `bautizos`, `centros`, `documentos`, `eventos`, `iglesias`, `scanner`, `usuarios`.

## Patrón por módulo
```
modules/<nombre>/
├── components/    # UI específica del módulo
├── hooks/          # ej. useUsuarios.js
├── pages/           # vistas que se montan en rutas (AppRoutes.jsx)
├── services/        # llamadas a la API (axios)
└── styles/           # css específico, si aplica
```

## Estructura compartida (`src/`)
```
src/
├── api/axios.js        # instancia base de axios (baseURL, interceptors)
├── components/
│   ├── layout/           # layout general (sidebar, navbar, etc.)
│   └── ui/                 # componentes UI reutilizables
├── routes/AppRoutes.jsx  # definición central de rutas
└── pages/Dashboard.jsx
```

## Convenciones
- Toda llamada a la API pasa por `services/` del módulo correspondiente,
  usando la instancia de `src/api/axios.js` (no instanciar axios suelto en componentes).
- Estado de datos remotos vive en hooks (`use<Modulo>.js`), no directamente en componentes.
- Antes de crear un componente UI nuevo en `components/ui/`, revisar si ya existe
  uno equivalente — evitar duplicar botones/inputs/modales.

## Puntos sensibles para contexto/tokens
- `node_modules/` — nunca leer ni incluir en búsquedas.
- `dist/`, `.vite/` (si existen tras build) — ignorar, son artefactos generados.

## Comandos
```bash
npm run dev
npm run build
npm run lint   # si está configurado en package.json
```

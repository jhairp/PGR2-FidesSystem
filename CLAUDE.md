# SistemaParroquialUI — Contexto del proyecto

Sistema de gestión parroquial. Dos servicios independientes que se comunican vía REST.

## Stack
- **Backend**: Django + DRF (`backend/`). Ver `backend/CLAUDE.md`.
- **Frontend**: React + Vite (`frontned/`). Ver `frontned/CLAUDE.md`.
- Auth: JWT (`djangorestframework_simplejwt`) + Google Auth.

## Estructura (filtrada, sin venv/node_modules/__pycache__)
```
.
├── backend/
│   ├── core/            # settings, urls, asgi/wsgi del proyecto Django
│   ├── apps/
│   │   ├── authentication/
│   │   ├── usuarios/
│   │   ├── personas/
│   │   ├── centros/
│   │   ├── det_pars/
│   │   ├── sacramentos/bautizos/
│   │   ├── eventos/
│   │   ├── horarios/
│   │   ├── documentos/
│   │   └── scanner/
│   └── manage.py
└── frontned/
    └── src/
        ├── modules/      # 1:1 con las apps del backend
        ├── pages/
        ├── components/
        ├── routes/
        └── api/
```

Nota: cada app de `backend/apps/` tiene su módulo equivalente en `frontned/src/modules/`
con el mismo nombre o uno muy cercano (ej. `usuarios` ↔ `usuarios`, `documentos` ↔ `documentos`).
Al pedir un cambio end-to-end, indica si afecta a uno o ambos lados para no cargar
contexto innecesario del lado que no aplica.

## Convenciones generales
- Cada app de Django sigue el patrón `models → serializers → services → views → urls`.
  La lógica de negocio vive en `services.py`, no en `views.py`.
- Cada módulo de React sigue `components/ → hooks/ → pages/ → services/`.
- No commitear `backend/venv/`, `node_modules/`, `__pycache__/` ni PDFs reales de
  `backend/media/documentos/` (ver `.gitignore`).

## Comandos frecuentes
```bash
# Backend
cd backend && python manage.py runserver
cd backend && python manage.py makemigrations && python manage.py migrate

# Frontend
cd frontned && npm run dev
cd frontned && npm run build
```

## Documentación por servicio
- Backend (Django/DRF, apps, migraciones): `backend/CLAUDE.md`
- Frontend (React, módulos, rutas): `frontned/CLAUDE.md`

## Estilo de trabajo con Claude Code
- Para exploración/debugging repetitivo: estilo conciso (Caveman) está bien.
- Para decisiones de arquitectura (permisos, serializers, lógica de sacramentos):
  pedir explicaciones completas, no modo conciso.
- Antes de añadir abstracciones nuevas (capas, patrones, helpers genéricos),
  justificar por qué el patrón actual (`services.py` plano) no alcanza.

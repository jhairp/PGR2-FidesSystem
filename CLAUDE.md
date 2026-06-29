# SistemaParroquialUI — Contexto del proyecto

Sistema de gestión parroquial. Dos servicios independientes que se comunican vía REST.

## Stack
- **Backend**: Django + DRF (`backend/`). Ver `backend/CLAUDE.md`.
- **Frontend**: React + Vite (`frontend/`). Ver `frontend/CLAUDE.md`.
- Auth: JWT (`djangorestframework_simplejwt`) + Google Auth.
- Dependencias de Node viven **solo** en `frontend/package.json` (calendario con
  FullCalendar para el módulo `eventos`). No debe existir `package.json` en la
  raíz ni en `backend/` — si reaparece, es un error de instalación, no una
  dependencia real del backend.

## Estructura (filtrada, sin venv/node_modules/__pycache__/Backups)
```
.
├── backend/
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
│   ├── core/              # settings, urls, asgi/wsgi
│   ├── media/
│   │   ├── certificados/   # plantillas (assets + json) — SÍ versionadas
│   │   └── documentos/      # PDFs generados — NO versionados
│   ├── tests/unit/         # única convención de testing del backend
│   └── manage.py
└── frontend/
    └── src/
        ├── modules/        # 1:1 con las apps del backend
        ├── components/
        ├── routes/
        └── api/
```
## Convenciones generales
- Cada app de Django sigue `models → serializers → services → views → urls`.
  La lógica de negocio vive en `services.py`, no en `views.py`.
- **Modelos: patrón mixto, verificar caso por caso.** Algunas apps usan un
  modelo general compartido (ej. relacionado con `personas`), otras definen
  su propio modelo independiente. No asumir un patrón uniforme: antes de
  tocar una entidad, revisar primero si trabaja con modelo propio o
  compartido. Ver detalle en `backend/CLAUDE.md`.
- Cada módulo de React sigue `components/ → hooks/ → pages/ → services/`.
- Testing del backend: todo en `backend/tests/unit/`, no crear `test.py`
  sueltos dentro de cada app.

## Comandos frecuentes
```bash
# Backend
cd backend && python manage.py runserver
cd backend && python manage.py makemigrations && python manage.py migrate
cd backend && pytest

# Frontend
cd frontend && npm run dev
cd frontend && npm run build
```

## Estilo de trabajo con Claude Code
- Exploración/debugging repetitivo: estilo conciso (Caveman) está bien.
- Decisiones de arquitectura (permisos, serializers, sacramentos, modelos
  compartidos vs propios): pedir explicaciones completas, no modo conciso.
- Antes de añadir abstracciones nuevas, justificar por qué el patrón actual
  no alcanza (riesgo de over-engineering, ver Ponytail).

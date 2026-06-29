# Backend — CLAUDE.md

Django + Django REST Framework. Ver `requirements.txt` para versiones exactas
(Django 6.0.x, DRF 3.17.x, simplejwt 5.5.x, psycopg 3.x para Postgres).

## Apps y responsabilidad
| App | Responsabilidad |
|---|---|
| `authentication` | Login, JWT, Google Auth (`google_auth.py`) |
| `usuarios` | Usuarios del sistema (no feligreses), permisos |
| `personas` | Feligreses / personas registradas en la parroquia |
| `centros` | Centros o sedes parroquiales |
| `det_pars` | Detalle parroquial (revisar modelo si el nombre no es autoexplicativo) |
| `sacramentos/bautizos` | Registro de bautizos y sacramentos |
| `eventos` | Eventos parroquiales |
| `horarios` | Horarios de misas/actividades |
| `documentos` | Generación/almacenamiento de documentos y certificados (PDF) |
| `scanner` | Escaneo/OCR de documentos |

## Patrón por app
```
apps/<nombre>/
├── models.py        # modelos ORM
├── serializers.py    # DRF serializers
├── services.py        # lógica de negocio (NO en views.py)
├── views.py            # solo orquestación HTTP, delega a services
├── urls.py
├── permissions.py    # si la app tiene reglas de acceso propias
├── validators.py      # si la app tiene validaciones complejas
└── migrations/
```

Al pedir un cambio de lógica de negocio, el archivo a tocar primero es `services.py`,
no `views.py`.

## Puntos sensibles para contexto/tokens
- `backend/venv/` — **nunca** lo leas ni lo incluyas en búsquedas (`find`, `grep -r`).
  Si una herramienta lo escanea por error, son ~36,000 archivos de dependencias.
- `backend/media/documentos/` — contiene PDFs reales generados (certificados de
  feligreses). No deben commitearse ni cargarse al contexto salvo que la tarea
  sea explícitamente sobre el módulo `documentos` o `scanner`.
- `__pycache__/` — ignorar siempre; no aporta nada al razonamiento.

## Comandos
```bash
python manage.py runserver
python manage.py makemigrations <app>
python manage.py migrate
python manage.py test apps.<app>
```

## Variables de entorno
Usa `python-decouple` (`requirements.txt`). Verifica `backend/.env` (no versionado)
antes de asumir valores de configuración — no inventar credenciales ni URLs.

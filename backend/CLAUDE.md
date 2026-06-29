# Backend — CLAUDE.md

Django + Django REST Framework. Ver `requirements.txt` para versiones exactas.

## Apps activas y responsabilidad
| App | Responsabilidad |
|---|---|
| `authentication` | Login, JWT, Google Auth (`google_auth.py`) |
| `usuarios` | Usuarios del sistema (no feligreses), permisos |
| `personas` | Feligreses / personas registradas en la parroquia |
| `centros` | Centros o sedes parroquiales |
| `det_pars` | Detalle parroquial |
| `sacramentos/bautizos` | Registro de bautizos, certificados |
| `eventos` | Eventos parroquiales (frontend usa FullCalendar) |
| `horarios` | Horarios de misas/actividades |
| `documentos` | Generación/almacenamiento de documentos y certificados (PDF) |
| `scanner` | Escaneo/OCR de documentos |


## Patrón por app
```
apps/<nombre>/
├── models.py        # modelos ORM — ver nota de "Modelos" abajo
├── serializers.py
├── services.py        # lógica de negocio (NO en views.py)
├── views.py             # solo orquestación HTTP, delega a services
├── urls.py
├── permissions.py      # si la app tiene reglas de acceso propias
└── validators.py        # si la app tiene validaciones complejas
```

## ⚠️ Modelos: patrón mixto (importante)
No hay una convención única todavía. Algunas apps trabajan sobre un **modelo
general compartido** (por ejemplo, entidades relacionadas con `personas` que
varias apps reutilizan), mientras que otras definen su **propio modelo
independiente** dentro de su carpeta. Esto fue una decisión no resuelta
durante el desarrollo, no un error.

**Regla para cualquier cambio**: antes de modificar o crear un modelo,
verificar primero en `models.py` de la app si importa un modelo de otra app
o define uno propio. No asumir que el patrón de una app aplica a otra.
`documentos/` por ejemplo no tiene `models.py` propio — confirmar de qué app
toma sus datos antes de tocarlo.

## Certificados — distinción importante para no confundir input/output
- `media/certificados/assets/*.png` y `media/certificados/templates/*.json`
  → **plantillas de entrada**, código/config versionado, necesario para que
  `sacramentos/bautizos/certificados.py` funcione. No borrar, no ignorar.
- `media/documentos/*.pdf` → **output generado** por usuario final. Ignorado
  en `.gitignore`, no debe versionarse (datos personales reales).

## Testing
Toda la suite vive en `backend/tests/unit/`. No crear `test.py` dentro de
cada app — esa convención antigua ya se eliminó.

## Puntos sensibles para contexto/tokens
- `backend/venv/` — nunca leer ni incluir en búsquedas (`find`, `grep -r`).
- `backend/Backups/` — dumps de base de datos (`.sql`, `.backup`) con datos
  reales de feligreses. **Nunca debe versionarse ni cargarse al contexto.**
  Si ya se hizo commit alguna vez, purgar del historial de git, no solo del
  working tree.
- `backend/debug_*.jpg` — salidas de depuración del módulo `scanner`, ignorar.
- `__pycache__/`, `.pytest_cache/` — ignorar siempre.

## Roles del sistema
- por el momento existen 4 roles.
- `super administrador`puede ver y realizar cualquier accion del sistema.
- `sacerdote`se encarga de abms secretarios al sistema, abms de sacramentos, abms de eventos, abms de documentos. Todo esto de la iglesia(centro) al que pertenece.
- `Secretario`abms de los registros sacramentales, y eventos, de igual manera de la iglesia (centro que pertenece).
- `Fiel`Ver los eventos que existen en la iglesia de su preferencia.

ahora un sacerdote puede pertenecer a diferentes iglesias, pero si o si de la misma parroquia y el secretario solo pertenece a una iglesia. El que designa a donde pertenece cada quien es el super admin.

## Comandos
```bash
python manage.py runserver
python manage.py makemigrations <app>
python manage.py migrate
pytest backend/tests/unit
```

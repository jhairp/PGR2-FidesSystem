# Sistema Parroquial UI

Proyecto con backend en Django REST Framework y frontend en React + Vite.

## Requisitos

Instalar en la computadora:

- Python 3.14 o compatible con el proyecto.
- Node.js y npm.
- PostgreSQL.
- Git.

Opcional, solo si se usara el modulo de scanner/OCR:

- OpenCV, Torch, Transformers y dependencias OCR. El backend puede iniciar sin ellas, pero el endpoint de scanner las pedira al usarlo.

## Estructura

```text
SistemaParroquialUI/
  backend/      API Django
  frontend/     Aplicacion React + Vite
```

## Configurar Backend

Entrar a la carpeta del backend:

```powershell
cd backend
```

Crear entorno virtual:

```powershell
python -m venv venv
```

Activar entorno virtual:

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar dependencias:

```powershell
python -m pip install -r requirements.txt
```

Crear archivo `.env` dentro de `backend/`:

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=tu_correo@gmail.com
MAIL_PASSWORD=tu_password_o_app_password
MAIL_FROM_ADDRESS=tu_correo@gmail.com
```

Configurar PostgreSQL en `backend/core/settings.py`.

Valores actuales esperados por el proyecto:

```text
Base de datos: PGR2SISPAR2
Usuario: postgres
Host: 127.0.0.1
Puerto: 5432
```

Si la otra computadora usa otra contrasena o nombre de base de datos, cambiarlo en `DATABASES`.

Verificar backend:

```powershell
python manage.py check
```

Levantar backend:

```powershell
python manage.py runserver
```

La API quedara en:

```text
http://127.0.0.1:8000
```

## Configurar Frontend

Abrir otra terminal y entrar a la carpeta del frontend:

```powershell
cd frontend
```

Instalar dependencias:

```powershell
npm install
```

Levantar frontend:

```powershell
npm run dev
```

La aplicacion quedara normalmente en:

```text
http://localhost:5173
```

## Orden recomendado para iniciar

1. Iniciar PostgreSQL.
2. Iniciar backend con `python manage.py runserver`.
3. Iniciar frontend con `npm run dev`.
4. Abrir `http://localhost:5173`.

## Certificados de Bautizo

El editor de certificados guarda la plantilla en:

```text
backend/media/certificados/templates/bautizo.json
```

Las imagenes subidas al certificado se guardan en:

```text
backend/media/certificados/assets/
```

Si se migra el proyecto a otra computadora y se quieren conservar los disenos, copiar tambien la carpeta:

```text
backend/media/certificados/
```

## Comandos utiles

Backend:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py check
python manage.py runserver
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Problemas comunes

Si aparece `ModuleNotFoundError`, instalar dependencias del backend:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Si el frontend no encuentra el backend, revisar que Django este corriendo en:

```text
http://127.0.0.1:8000
```

Si falla la conexion a PostgreSQL, revisar:

- Que PostgreSQL este iniciado.
- Que exista la base de datos.
- Que usuario, contrasena, host y puerto coincidan en `backend/core/settings.py`.

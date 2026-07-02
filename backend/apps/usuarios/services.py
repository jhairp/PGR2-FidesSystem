# apps/usuarios/services.py

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.crypto import get_random_string

from .models import Personas, Usuarios, Rols, PerRols

SECRETARIO = 3


def _rol_forzado(datos, solicitante):
    # Sacerdote (rol 2) solo puede asignar Secretario; el resto respeta lo enviado.
    if getattr(solicitante, 'id_rol_1_id', None) == 2:
        return SECRETARIO
    return datos.get('id_rol_1')


def _enviar_credenciales(correo, password):
    # ponytail: si el correo falla, no se rompe la creación; se reporta con bandera.
    try:
        send_mail(
            'Acceso al Sistema Parroquial',
            (
                f'Se creó tu cuenta en el Sistema Parroquial.\n\n'
                f'Usuario (correo): {correo}\n'
                f'Contraseña temporal: {password}\n\n'
                f'Por seguridad, cámbiala después de iniciar sesión.'
            ),
            settings.DEFAULT_FROM_EMAIL,
            [correo],
            fail_silently=False,
        )
        return True
    except Exception:
        return False


def crear_usuario(datos, solicitante=None):

    ahora = timezone.now()

    # Personas.id_per_rol_1 es FK obligatoria — espejo de RegisterSerializer.
    per_rol = PerRols.objects.get(id_per_rol=2)

    persona = Personas.objects.create(
        nom_per=datos['nom_per'],
        ap_pat_per=datos['ap_pat_per'],
        carnet_per=datos['carnet_per'],
        cel_per=datos['cel_per'],
        id_per_rol_1=per_rol,
        created_at=ahora,
        updated_at=ahora,
    )

    rol = Rols.objects.get(id_rol=_rol_forzado(datos, solicitante))

    password = get_random_string(10)

    usuario = Usuarios(
        correo_usu=datos['correo_usu'],
        estado_usu='activo',
        foto_usu='default.png',
        id_per_1=persona,
        id_rol_1=rol,
        created_at=ahora,
        updated_at=ahora,
    )
    usuario.set_password(password)   # hash — login con simplejwt usa check_password
    usuario.save()

    email_enviado = _enviar_credenciales(datos['correo_usu'], password)

    return usuario, email_enviado


def actualizar_usuario(usuario, datos, solicitante=None):

    persona = usuario.id_per_1

    for campo in ('nom_per', 'ap_pat_per', 'carnet_per', 'cel_per'):
        if campo in datos:
            setattr(persona, campo, datos[campo])
    persona.updated_at = timezone.now()
    persona.save()

    if 'correo_usu' in datos:
        usuario.correo_usu = datos['correo_usu']

    if 'id_rol_1' in datos:
        rol_id = _rol_forzado(datos, solicitante)
        usuario.id_rol_1 = Rols.objects.get(id_rol=rol_id)

    usuario.updated_at = timezone.now()
    usuario.save()

    return usuario

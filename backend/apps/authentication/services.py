from google.oauth2 import id_token

from google.auth.transport import requests

from rest_framework_simplejwt.tokens import RefreshToken

from apps.usuarios.models import (
    Usuarios,
    Personas,
    Rols,
    PerRols,
)

GOOGLE_CLIENT_ID = '292437594375-ccncjurgnbftk698h13nhu73jdii01p8.apps.googleusercontent.com'


def google_login(token):

    idinfo = id_token.verify_oauth2_token(
        token,
        requests.Request(),
        GOOGLE_CLIENT_ID,
    )

    email = idinfo['email']

    nombre = idinfo.get(
        'given_name',
        ''
    )

    apellido = idinfo.get(
        'family_name',
        ''
    )

    google_id = idinfo['sub']

    usuario = Usuarios.objects.filter(
        correo_usu=email
    ).first()

    # SI NO EXISTE

    if not usuario:

        per_rol = PerRols.objects.first()

        persona = Personas.objects.create(
            nom_per=nombre,
            ap_pat_per=apellido,
            id_per_rol_1=per_rol,
        )

        rol = Rols.objects.first()

        usuario = Usuarios.objects.create(
            correo_usu=email,
            username=email,
            estado_usu='activo',
            google_id=google_id,
            id_per_1=persona,
            id_rol_1=rol,
        )

        usuario.set_unusable_password()

        usuario.save()

    refresh = RefreshToken.for_user(usuario)

    return {

        'refresh': str(refresh),

        'access': str(refresh.access_token),
    }
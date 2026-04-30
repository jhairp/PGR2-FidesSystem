# apps/usuarios/services.py

from .models import Personas, Usuarios, Rols


def crear_usuario(datos):

    # Crear persona
    persona = Personas.objects.create(
        nom_per=datos['nom_per'],
        ap_pat_per=datos['ap_pat_per'],
        carnet_per=datos['carnet_per'],
        cel_per=datos['cel_per']
    )

    # Obtener rol
    rol = Rols.objects.get(
        id_rol=datos['id_rol_1']
    )

    # Crear usuario
    usuario = Usuarios.objects.create(
        correo_usu=datos['correo_usu'],
        password=datos['password'],
        estado_usu='activo',
        id_per_1=persona,
        id_rol_1=rol
    )

    return usuario
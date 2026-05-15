from apps.usuarios.models import Usuarios


def test_editar_usuario():

    # DATOS INICIALES

    usuario = Usuarios(

        id_usu=1,
        correo_usu='jhairpinto8@gmail.com',
        estado_usu='activo',
        foto_usu='jesus.jpg'
    )

    # NUEVOS DATOS

    nuevo_correo = 'nuevo@gmail.com'

    nueva_foto = 'nuevo.jpg'

    # SIMULACIÓN DE EDICIÓN

    usuario.correo_usu = nuevo_correo

    usuario.foto_usu = nueva_foto

    # VALIDACIONES

    assert usuario.correo_usu == 'nuevo@gmail.com'

    assert usuario.foto_usu == 'nuevo.jpg'

    assert '@' in usuario.correo_usu

    assert usuario.foto_usu.endswith('.jpg')
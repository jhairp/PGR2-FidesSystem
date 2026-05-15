from apps.usuarios.models import Usuarios


def test_usuario_completo():

    usuario = Usuarios(

        id_usu=1,
        correo_usu='jhairpinto8@gmail.com',
        estado_usu='activo',
        foto_usu='jesus.jpg',
        google_id='112200499181531433124'

    )

    # VALIDACIONES

    assert usuario.id_usu == 1

    assert usuario.correo_usu == 'jhairpinto8@gmail.com'

    assert usuario.estado_usu == 'activo'

    assert usuario.foto_usu == 'jesus.jpg'

    assert usuario.google_id == '112200499181531433124'
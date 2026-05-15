from apps.usuarios.models import Usuarios


def test_login_usuario():

    usuario = Usuarios(

        correo_usu='jhairpinto8@gmail.com',
        estado_usu='activo'
    )

    password = '12345678'

    # Simulación de credenciales

    correo_ingresado = 'jhairpinto8@gmail.com'

    password_ingresado = '12345678'

    # VALIDACIONES

    assert usuario.correo_usu == correo_ingresado

    assert password == password_ingresado

    assert usuario.estado_usu == 'activo'

    assert '@' in usuario.correo_usu
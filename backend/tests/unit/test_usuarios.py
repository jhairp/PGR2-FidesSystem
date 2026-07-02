from types import SimpleNamespace

from apps.usuarios.services import _rol_forzado, SECRETARIO

# Los modelos son managed=False (BD legada) → no hay test DB con tablas.
# Se prueba la única lógica propia y sensible: el forzado de rol por solicitante.
# (El hash de password lo provee Django set_password; el envío de correo, send_mail.)


def test_sacerdote_se_fuerza_a_secretario():
    sacerdote = SimpleNamespace(id_rol_1_id=2)
    # pide rol 1 (Super Admin) pero debe quedar en Secretario
    assert _rol_forzado({'id_rol_1': 1}, sacerdote) == SECRETARIO


def test_super_admin_respeta_rol_pedido():
    admin = SimpleNamespace(id_rol_1_id=1)
    assert _rol_forzado({'id_rol_1': 2}, admin) == 2
    assert _rol_forzado({'id_rol_1': 4}, admin) == 4


def test_sin_solicitante_respeta_rol():
    assert _rol_forzado({'id_rol_1': 1}, None) == 1

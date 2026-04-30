# apps/usuarios/validators.py

from rest_framework.exceptions import ValidationError


def validar_carnet(carnet):

    if len(carnet) < 5:
        raise ValidationError(
            "Carnet inválido"
        )

    return carnet

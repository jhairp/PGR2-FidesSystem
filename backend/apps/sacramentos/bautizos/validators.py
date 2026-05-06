from rest_framework.exceptions import ValidationError
from datetime import date


def validar_fecha_bautizo(fecha_nacimiento, fecha_bautizo):

    if fecha_nacimiento > date.today():
        raise ValidationError(
            "La fecha de nacimiento no puede ser futura."
        )

    if fecha_bautizo < fecha_nacimiento:
        raise ValidationError(
            "La fecha del bautizo no puede ser menor a la fecha de nacimiento."
        )
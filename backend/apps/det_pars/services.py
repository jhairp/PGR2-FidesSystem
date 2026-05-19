from apps.models import DetPars


class DetParService:

    @staticmethod
    def asignar_persona(
        persona,
        centro
    ):

        return DetPars.objects.create(
            id_per_3=persona,
            id_cen_1=centro
        )

    @staticmethod
    def quitar_asignacion(
        asignacion
    ):

        asignacion.delete()
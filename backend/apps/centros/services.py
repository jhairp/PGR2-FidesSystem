from .models import Centro


class CentroService:

    @staticmethod
    def listar_centros():
        return Centro.objects.select_related(
            "parroquia"
        ).all()

    @staticmethod
    def obtener_centro(id_cen):
        return Centro.objects.get(id_cen=id_cen)

    @staticmethod
    def crear_centro(data):
        return Centro.objects.create(**data)

    @staticmethod
    def actualizar_centro(centro, data):

        for key, value in data.items():
            setattr(centro, key, value)

        centro.save()

        return centro

    @staticmethod
    def eliminar_centro(centro):
        centro.delete()

    @staticmethod
    def cambiar_estado(centro, estado):

        centro.estado_cen = estado

        centro.save()

        return centro
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Centro
from .serializers import CentroSerializer
from .services import CentroService

from .models import Parroquia
from .serializers import ParroquiaSerializer

from .models import ImagenCentro
from .serializers import ImagenCentroSerializer

import os
import uuid

from django.conf import settings

class CentroViewSet(ModelViewSet):

    serializer_class = CentroSerializer

    queryset = Centro.objects.all()

    def get_queryset(self):
        return CentroService.listar_centros()

    def create(self, request):

        serializer = self.serializer_class(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        centro = CentroService.crear_centro(
            serializer.validated_data
        )

        return Response(
            self.serializer_class(centro).data,
            status=status.HTTP_201_CREATED
        )

    def update(self, request, pk=None):

        centro = CentroService.obtener_centro(pk)

        serializer = self.serializer_class(
            centro,
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        centro_actualizado = (
            CentroService.actualizar_centro(
                centro,
                serializer.validated_data
            )
        )

        return Response(
            self.serializer_class(
                centro_actualizado
            ).data
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path="cambiar-estado"
    )
    def cambiar_estado(
        self,
        request,
        pk=None
    ):

        centro = self.get_object()

        nuevo_estado = request.data.get(
            "estado_cen"
        )

        if not nuevo_estado:

            nuevo_estado = (
                "inactivo"
                if centro.estado_cen == "activo"
                else "activo"
            )

        centro.estado_cen = nuevo_estado

        centro.save()

        return Response({

            "message":
                "Estado actualizado",

            "estado_cen":
                centro.estado_cen

        })
    
    @action(
        detail=True,
        methods=["post"],
        url_path="subir-imagen"
    )
    def subir_imagen(
        self,
        request,
        pk=None
    ):

        centro = self.get_object()

        archivo = request.FILES.get(
            "imagen"
        )

        if not archivo:

            return Response(
                {
                    "error":
                    "No se recibió ninguna imagen"
                },
                status=400
            )

        extension = os.path.splitext(
            archivo.name
        )[1]

        nombre_archivo = (
            f"{uuid.uuid4()}{extension}"
        )

        ruta_destino = os.path.join(

            settings.BASE_DIR,

            "..",

            "frontend",

            "public",

            "images",

            "iglesias"
        )

        os.makedirs(
            ruta_destino,
            exist_ok=True
        )

        ruta_completa = os.path.join(
            ruta_destino,
            nombre_archivo
        )

        with open(
            ruta_completa,
            "wb+"
        ) as destino:

            for chunk in archivo.chunks():

                destino.write(chunk)

        url_img = (
            f"/images/iglesias/{nombre_archivo}"
        )

        imagen = ImagenCentro.objects.create(

            url_img=url_img,

            centro=centro
        )

        return Response({

            "message":
                "Imagen subida correctamente",

            "id_img":
                imagen.id_img,

            "url_img":
                imagen.url_img

        })
    
class ParroquiaViewSet(ModelViewSet):

    queryset = Parroquia.objects.all()

    serializer_class = ParroquiaSerializer

class ImagenCentroViewSet(
    ModelViewSet
):

    queryset = ImagenCentro.objects.all()

    serializer_class = ImagenCentroSerializer

    def destroy(
        self,
        request,
        *args,
        **kwargs
    ):

        imagen = self.get_object()

        nombre_archivo = (
            imagen.url_img
            .replace(
                "/images/iglesias/",
                ""
            )
        )

        ruta_archivo = os.path.join(

            settings.BASE_DIR,

            "..",

            "frontend",

            "public",

            "images",

            "iglesias",

            nombre_archivo
        )

        if os.path.exists(
            ruta_archivo
        ):
            os.remove(
                ruta_archivo
            )

        imagen.delete()

        return Response(
            status=204
        )
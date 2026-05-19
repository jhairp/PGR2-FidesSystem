from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Centro
from .serializers import CentroSerializer
from .services import CentroService

from .models import Parroquia
from .serializers import ParroquiaSerializer

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
    
class ParroquiaViewSet(ModelViewSet):

    queryset = Parroquia.objects.all()

    serializer_class = ParroquiaSerializer
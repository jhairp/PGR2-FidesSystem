from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Centro
from .serializers import CentroSerializer
from .services import CentroService


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

    def destroy(self, request, pk=None):

        centro = CentroService.obtener_centro(pk)

        CentroService.eliminar_centro(centro)

        return Response(status=204)

    @action(
        detail=True,
        methods=["patch"],
        url_path="cambiar-estado"
    )
    def cambiar_estado(self, request, pk=None):

        centro = CentroService.obtener_centro(pk)

        estado = request.data.get("estado_cen")

        centro = CentroService.cambiar_estado(
            centro,
            estado
        )

        return Response(
            self.serializer_class(centro).data
        )
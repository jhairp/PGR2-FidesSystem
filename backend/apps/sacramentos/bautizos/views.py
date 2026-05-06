from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import BautizoCreateSerializer, BautizoEstadoSerializer
from .services import cambiar_estado_bautizo, crear_bautizo

from apps.models import Usuarios


class BautizoCreateView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = BautizoCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        usuario = Usuarios.objects.first()

        bautizo = crear_bautizo(
            serializer.validated_data,
            usuario
        )

        return Response(
            {
                "message": "Bautizo registrado correctamente",
                "id_sac": bautizo.id_sac
            },
            status=status.HTTP_201_CREATED
        )
    
class BautizoEstadoView(APIView):

    permission_classes = []

    def patch(self, request, id_sac):

        serializer = BautizoEstadoSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        bautizo = cambiar_estado_bautizo(
            id_sac,
            serializer.validated_data["estado_sac"]
        )

        return Response(
            {
                "message": "Estado actualizado correctamente",
                "estado": bautizo.estado_sac
            },
            status=status.HTTP_200_OK
        )
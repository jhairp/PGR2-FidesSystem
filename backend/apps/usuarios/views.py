# apps/usuarios/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView

from .models import Usuarios
from .serializers import (
    UsuarioSerializer,
    CrearUsuarioSerializer
)

from .services import crear_usuario


# =========================
# LISTAR USUARIOS
# =========================

class UsuarioListView(ListAPIView):

    queryset = Usuarios.objects.all()
    serializer_class = UsuarioSerializer


# =========================
# CREAR USUARIO
# =========================

class UsuarioCreateView(APIView):

    def post(self, request):

        serializer = CrearUsuarioSerializer(
            data=request.data
        )

        if serializer.is_valid():

            usuario = crear_usuario(
                serializer.validated_data
            )

            response_serializer = UsuarioSerializer(
                usuario
            )

            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
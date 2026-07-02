# apps/usuarios/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from .models import Usuarios
from .serializers import (
    UsuarioSerializer,
    CrearUsuarioSerializer,
    ActualizarUsuarioSerializer,
)

from .services import crear_usuario, actualizar_usuario


# Solo Super Admin (1) y Sacerdote (2) gestionan usuarios.
ROLES_GESTORES = (1, 2)


def _puede_gestionar(user):
    return getattr(user, 'id_rol_1_id', None) in ROLES_GESTORES


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

    permission_classes = [IsAuthenticated]

    def post(self, request):

        if not _puede_gestionar(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = CrearUsuarioSerializer(data=request.data)

        if serializer.is_valid():

            usuario, email_enviado = crear_usuario(
                serializer.validated_data,
                request.user,
            )

            data = UsuarioSerializer(usuario).data
            data['email_enviado'] = email_enviado

            return Response(data, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================
# ACTUALIZAR USUARIO
# =========================

class UsuarioUpdateView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, id):

        if not _puede_gestionar(request.user):
            return Response(status=status.HTTP_403_FORBIDDEN)

        try:
            usuario = Usuarios.objects.get(pk=id)
        except Usuarios.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ActualizarUsuarioSerializer(
            data=request.data,
            partial=True,
            context={'usuario': usuario},
        )

        if serializer.is_valid():

            usuario = actualizar_usuario(
                usuario,
                serializer.validated_data,
                request.user,
            )

            return Response(UsuarioSerializer(usuario).data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

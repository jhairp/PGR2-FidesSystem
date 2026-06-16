from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import (
    DocumentoSerializer,
    DocumentoUploadSerializer,
    DocumentoEstadoSerializer,
)
from .services import (
    listar_documentos,
    crear_documento,
    obtener_documento,
    cambiar_estado_documento,
    eliminar_documento,
)
from apps.models import Usuarios


class DocumentoListCreateView(APIView):
    """
    GET  /api/documentos/         — lista todos
    GET  /api/documentos/?sac=<id> — filtra por sacramento
    POST /api/documentos/subir/    — sube un documento (multipart)
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = []   # Ajusta según tus permisos

    def get(self, request):
        id_sac = request.query_params.get('sac')
        docs   = listar_documentos(id_sac=id_sac)
        serial = DocumentoSerializer(docs, many=True)
        return Response(serial.data)

    def post(self, request):
        serializer = DocumentoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Usuario en sesión (ajusta si tienes JWT activo)
        usuario = getattr(request, 'user', None)
        if not usuario or not usuario.is_authenticated:
            usuario = Usuarios.objects.first()   # fallback para dev

        doc = crear_documento(serializer.validated_data, usuario)
        return Response(
            {
                'message': 'Documento subido correctamente',
                'id_doc' : doc.id_doc,
                'codigo' : doc.codigo_doc,
                'url'    : doc.url_doc,
            },
            status=status.HTTP_201_CREATED,
        )


class DocumentoDetailView(APIView):
    """
    GET    /api/documentos/<id>/        — detalle
    DELETE /api/documentos/<id>/        — eliminar
    """
    permission_classes = []

    def get(self, request, pk):
        try:
            doc = obtener_documento(pk)
        except Exception:
            return Response({'error': 'Documento no encontrado'}, status=404)
        return Response(DocumentoSerializer(doc).data)

    def delete(self, request, pk):
        try:
            eliminar_documento(pk)
        except Exception:
            return Response({'error': 'Documento no encontrado'}, status=404)
        return Response({'message': 'Documento eliminado'}, status=204)


class DocumentoEstadoView(APIView):
    """
    PATCH /api/documentos/<id>/estado/  — cambia estado
    """
    permission_classes = []

    def patch(self, request, pk):
        serializer = DocumentoEstadoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = getattr(request, 'user', None)
        if not usuario or not usuario.is_authenticated:
            usuario = None

        doc = cambiar_estado_documento(
            pk,
            serializer.validated_data['estado_doc'],
            serializer.validated_data.get('observacion_doc', ''),
            usuario,
        )
        return Response(
            {'message': 'Estado actualizado', 'estado': doc.estado_doc}
        )

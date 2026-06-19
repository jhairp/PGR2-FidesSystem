import os

from django.conf import settings
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.clickjacking import xframe_options_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    DocumentoSerializer,
    DocumentoUploadSerializer,
    DocumentoEstadoSerializer,
    DocumentoUpdateSerializer,
)
from .services import (
    listar_documentos,
    crear_documento,
    obtener_documento,
    actualizar_documento,
    cambiar_estado_documento,
    eliminar_documento,
)
from apps.usuarios.models import Usuarios
from apps.models import Documentos, Sacramentos


class DocumentoListCreateView(APIView):
    """
    GET  /api/documentos/          — lista (filtrable con ?sac=<id>)
    POST /api/documentos/          — sube nuevo documento (multipart)
    """
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = []

    def get(self, request):
        id_sac = request.query_params.get('sac')
        docs   = listar_documentos(id_sac=id_sac)
        return Response(DocumentoSerializer(docs, many=True).data)

    def post(self, request):
        serializer = DocumentoUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        usuario = getattr(request, 'user', None)
        if not usuario or not usuario.is_authenticated:
            usuario = Usuarios.objects.first()

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
    GET    /api/documentos/<id>/   — detalle
    PUT    /api/documentos/<id>/   — editar (multipart; archivo opcional)
    DELETE /api/documentos/<id>/   — eliminar
    """
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = []

    def get(self, request, pk):
        try:
            doc = obtener_documento(pk)
        except Exception:
            return Response({'error': 'Documento no encontrado'}, status=404)
        return Response(DocumentoSerializer(doc).data)

    def put(self, request, pk):
        try:
            doc = obtener_documento(pk)
        except Exception:
            return Response({'error': 'Documento no encontrado'}, status=404)

        serializer = DocumentoUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        doc = actualizar_documento(pk, serializer.validated_data)
        return Response(
            {
                'message': 'Documento actualizado',
                'id_doc' : doc.id_doc,
            }
        )

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
        return Response({'message': 'Estado actualizado', 'estado': doc.estado_doc})


@method_decorator(xframe_options_exempt, name='dispatch')
class DocumentoArchivoView(APIView):
    """
    GET /api/documentos/<id>/archivo/
    Sirve el archivo del documento para vista previa en el frontend.
    """
    permission_classes = []

    def get(self, request, pk):
        doc = get_object_or_404(Documentos, pk=pk)

        if not doc.url_doc:
            raise Http404("Documento sin archivo asociado")

        relative_path = doc.url_doc.lstrip('/')
        media_prefix = settings.MEDIA_URL.lstrip('/')

        if relative_path.startswith(media_prefix):
            relative_path = relative_path[len(media_prefix):]

        media_root = os.path.abspath(settings.MEDIA_ROOT)
        file_path = os.path.abspath(os.path.join(media_root, relative_path))

        if os.path.commonpath([media_root, file_path]) != media_root:
            raise Http404("Ruta de archivo no permitida")

        if not os.path.exists(file_path):
            raise Http404("Archivo no encontrado")

        return FileResponse(
            open(file_path, 'rb'),
            as_attachment=False,
            filename=os.path.basename(file_path),
        )


class SacramentosListView(APIView):
    """
    GET /api/sacramentos/
    Devuelve todos los sacramentos para el selector del formulario de documentos.
    """
    permission_classes = []

    def get(self, request):
        sacramentos = Sacramentos.objects.select_related('id_lai_1').order_by('-fecha_sac')
        data = [
            {
                'id_sac'    : s.id_sac,
                'tipo_sac'  : s.tipo_sac,
                'fecha_sac' : str(s.fecha_sac),
                # Nombre del laico (bautizado) si existe
                'laico'     : (
                    f"{s.id_lai_1.nom_lai} {s.id_lai_1.ap_pat_lai or ''}".strip()
                    if s.id_lai_1 else ''
                ),
                'estado_sac': s.estado_sac,
            }
            for s in sacramentos
        ]
        return Response(data)

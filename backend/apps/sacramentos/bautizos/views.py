from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import BautizoCreateSerializer, BautizoEstadoSerializer
from .services import cambiar_estado_bautizo, crear_bautizo, editar_bautizo, listar_bautizos, obtener_bautizo
from .certificados import (
    FIELD_OPTIONS,
    build_context,
    load_template,
    render_certificate_html,
    save_asset,
    save_template,
)

from apps.models import Sacramentos, Usuarios


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
    
class BautizoUpdateView(APIView):

    permission_classes = []

    def put(self, request, id_sac):

        serializer = BautizoCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        bautizo = editar_bautizo(
            id_sac,
            serializer.validated_data
        )

        return Response(
            {
                "message": "Bautizo actualizado correctamente",
                "id_sac": bautizo.id_sac
            },
            status=status.HTTP_200_OK
        )
    
class BautizoListView(APIView):

    permission_classes = []

    def get(self, request):

        bautizos = listar_bautizos()

        return Response(
            bautizos,
            status=status.HTTP_200_OK
        )


class BautizoCertificadoView(APIView):

    permission_classes = []

    def get(self, request, id_sac):

        bautizo = get_object_or_404(
            Sacramentos.objects.select_related(
                'id_lai_1',
                'id_cen_2',
                'id_cen_2__id_par_1',
            ),
            id_sac=id_sac,
            tipo_sac='BAUTIZO'
        )

        html = render_certificate_html(
            load_template(),
            build_context(bautizo),
            auto_print=request.GET.get('autoprint') != '0',
            request=request
        )

        response = HttpResponse(
            html,
            content_type='text/html; charset=utf-8'
        )
        response['Content-Disposition'] = (
            f'inline; filename="certificado-bautizo-{id_sac}.html"'
        )
        return response


class CertificadoTemplateView(APIView):

    permission_classes = []
    parser_classes = [JSONParser]

    def get(self, request):

        return Response(
            {
                'template': load_template(),
                'fields': FIELD_OPTIONS,
            },
            status=status.HTTP_200_OK
        )

    def put(self, request):

        template = save_template(request.data)

        return Response(
            {
                'message': 'Plantilla guardada correctamente',
                'template': template,
            },
            status=status.HTTP_200_OK
        )


class CertificadoAssetUploadView(APIView):

    permission_classes = []
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):

        image = request.FILES.get('image')

        if not image:
            return Response(
                {'error': 'Debe enviar una imagen'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            url = save_asset(image)
        except ValueError as exc:
            return Response(
                {'error': str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                'url': url,
            },
            status=status.HTTP_201_CREATED
        )

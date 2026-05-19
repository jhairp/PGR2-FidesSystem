from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from apps.models import DetPars
from .serializers import DetParSerializer


class DetParViewSet(
    viewsets.ModelViewSet
):

    queryset = (
        DetPars.objects
        .select_related(
            'id_per_3',
            'id_cen_1'
        )
        .all()
        .order_by('-id_det_par')
    )

    serializer_class = DetParSerializer

    @action(
        detail=False,
        methods=['get'],
        url_path='centro/(?P<centro_id>[^/.]+)'
    )
    def por_centro(
        self,
        request,
        centro_id=None
    ):

        asignaciones = (
            self.queryset.filter(
                id_cen_1=centro_id
            )
        )

        serializer = self.get_serializer(
            asignaciones,
            many=True
        )

        return Response(
            serializer.data
        )
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.centros.models import Centro

from .models import (
    HorarioCentro,
    HorarioInd
)

from .serializers import (
    HorarioSerializer,
    HorarioIndSerializer
)


# =========================================
# HORARIOS
# =========================================

class HorarioViewSet(
    viewsets.ModelViewSet
):

    serializer_class = HorarioSerializer

    # =====================================
    # QUERYSET
    # =====================================

    def get_queryset(self):

        queryset = (

            HorarioCentro.objects

            .select_related(
                'id_cen_4'
            )

            .prefetch_related(
                'horarios_indisponibles'
            )

            .all()

            .order_by('-id_hor')
        )

        centro_id = (
            self.request.query_params.get(
                'id_cen_4'
            )
        )

        if centro_id:

            queryset = queryset.filter(
                id_cen_4=centro_id
            )

        return queryset

    # =====================================
    # GUARDAR HORARIOS
    # =====================================

    @action(
        detail=False,
        methods=['post'],
        url_path='guardar-horarios'
    )
    def guardar_horarios(
        self,
        request
    ):

        centro_id = request.data.get(
            'centro'
        )

        disponibles = request.data.get(
            'disponibles',
            []
        )

        indisponibles = request.data.get(
            'indisponibles',
            []
        )

        if not centro_id:

            return Response(
                {
                    'error':
                    'Centro requerido'
                },
                status=400
            )

        try:

            centro = Centro.objects.get(
                id_cen=centro_id
            )

        except Centro.DoesNotExist:

            return Response(
                {
                    'error':
                    'Centro no existe'
                },
                status=404
            )

        # =====================================
        # ELIMINAR ANTERIORES
        # =====================================

        horarios_previos = (
            HorarioCentro.objects.filter(
                id_cen_4=centro
            )
        )

        HorarioInd.objects.filter(
            id_hor_1__in=horarios_previos
        ).delete()

        horarios_previos.delete()

        # =====================================
        # CREAR DISPONIBLES
        # =====================================

        horarios_creados = []

        for item in disponibles:

            horario = (
                HorarioCentro.objects.create(

                    dia_sem_hor=
                        item['day'],

                    hora_ini_hor=
                        item['start'],

                    hora_fin_hor=
                        item['end'],

                    tipo_hor='atencion',

                    estado_hor='activo',

                    id_cen_4=centro
                )
            )

            horarios_creados.append(
                horario
            )

        # =====================================
        # CREAR INDISPONIBLES
        # =====================================

        for item in indisponibles:

            for horario in horarios_creados:

                if (
                    horario.dia_sem_hor
                    ==
                    item['day']
                ):

                    HorarioInd.objects.create(

                        hora_ini_ind=
                            item['start'],

                        hora_fin_ind=
                            item['end'],

                        motivo_ind=
                            'Bloqueado',

                        estado_ind=
                            'activo',

                        id_hor_1=
                            horario
                    )

        return Response({

            'message':
                'Horarios guardados correctamente'
        })


# =========================================
# HORARIOS INDISPONIBLES
# =========================================

class HorarioIndViewSet(
    viewsets.ModelViewSet
):

    queryset = (

        HorarioInd.objects

        .select_related(
            'id_hor_1'
        )

        .all()

        .order_by('-id_hor_ind')
    )

    serializer_class = (
        HorarioIndSerializer
    )
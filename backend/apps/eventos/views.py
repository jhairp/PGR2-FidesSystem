from rest_framework import viewsets

from apps.models import Eventos

from .serializers import EventoSerializer

from django.core.mail import send_mail

class EventoViewSet(
    viewsets.ModelViewSet
):

    serializer_class = (
        EventoSerializer
    )

    def get_queryset(self):

        queryset = (
            Eventos.objects.all()
        )

        centro_id = (
            self.request.query_params.get(
                'id_cen_3'
            )
        )

        if centro_id:

            queryset = queryset.filter(
                id_cen_3=centro_id
            )

        return queryset
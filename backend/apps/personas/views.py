from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.models import Personas

from .serializers import PersonaSerializer


class PersonaViewSet(ReadOnlyModelViewSet):

    queryset = Personas.objects.all().order_by(
        "nom_per"
    )

    serializer_class = PersonaSerializer
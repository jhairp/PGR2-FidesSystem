from rest_framework import serializers

from apps.models import Personas


class PersonaSerializer(serializers.ModelSerializer):

    nombre_completo = serializers.SerializerMethodField()

    class Meta:

        model = Personas

        fields = [

            "id_per",

            "nom_per",

            "ap_pat_per",

            "cel_per",

            "carnet_per",

            "nombre_completo",
        ]

    def get_nombre_completo(self, obj):

        return f"{obj.nom_per} {obj.ap_pat_per or ''}".strip()
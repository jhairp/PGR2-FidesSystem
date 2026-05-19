from rest_framework import serializers

from .models import DetPars


class DetParSerializer(
    serializers.ModelSerializer
):

    persona_nombre = serializers.SerializerMethodField()

    class Meta:

        model = DetPars

        fields = [

            'id_det_par',

            'id_per_3',
            'id_cen_1',

            'persona_nombre',
        ]

    def get_persona_nombre(
        self,
        obj
    ):

        persona = obj.id_per_3

        return f"{persona.nom_per} {persona.ap_pat_per or ''}"
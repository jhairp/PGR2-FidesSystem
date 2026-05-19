from rest_framework import serializers

from .models import (
    HorarioCentro,
    HorarioInd
)


# =========================================
# INDISPONIBLES
# =========================================

class HorarioIndSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = HorarioInd

        fields = '__all__'


# =========================================
# HORARIOS
# =========================================

class HorarioSerializer(
    serializers.ModelSerializer
):

    horarios_indisponibles = HorarioIndSerializer(
            many=True,
            read_only=True
        )

    centro_nombre = serializers.CharField(
        source='id_cen_4.nom_cen',
        read_only=True
    )

    class Meta:

        model = HorarioCentro

        fields = '__all__'
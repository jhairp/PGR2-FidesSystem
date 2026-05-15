from rest_framework import serializers

from .models import Centro


class CentroSerializer(serializers.ModelSerializer):

    parroquia_nombre = serializers.CharField(
        source="parroquia.nom_par",
        read_only=True
    )

    class Meta:
        model = Centro

        fields = "__all__"
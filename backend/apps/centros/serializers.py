from rest_framework import serializers

from .models import Centro, Parroquia


class CentroSerializer(serializers.ModelSerializer):

    parroquia_nombre = serializers.CharField(
        source="parroquia.nom_par",
        read_only=True
    )

    class Meta:
        model = Centro

        fields = "__all__"

class ParroquiaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Parroquia
        fields = "__all__"
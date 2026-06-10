from rest_framework import serializers

from .models import (
    Centro,
    Parroquia,
    ImagenCentro
)

class CentroSerializer(serializers.ModelSerializer):

    parroquia_nombre = serializers.CharField(
        source="parroquia.nom_par",
        read_only=True
    )

    imagenes = serializers.SerializerMethodField()

    class Meta:
        model = Centro
        fields = "__all__"

    def get_imagenes(self, obj):

        return [

            {
                "id_img": img.id_img,
                "url_img": img.url_img
            }

            for img in obj.imagenes.all()
        ]
    
class ParroquiaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Parroquia
        fields = "__all__"

class ImagenCentroSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = ImagenCentro
        fields = "__all__"
from rest_framework import serializers
from .models import Centros, Parroquias

class ParroquiasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parroquias
        fields = ['id_par', 'nom_par', 'telef_par', 'estado_par']

class CentrosSerializer(serializers.ModelSerializer):
    # Esto permite que en React veas el nombre de la parroquia y no solo el ID
    parroquia_info = ParroquiasSerializer(source='id_par_1', read_only=True)

    class Meta:
        model = Centros
        fields = [
            'id_cen', 
            'nom_cen', 
            'telf_cen', 
            'ciudad_cen', 
            'calle_cen', 
            'estado_cen', 
            'coordenadas_cen', 
            'parroquia_info' # Campo extraído del serializer de arriba
        ]
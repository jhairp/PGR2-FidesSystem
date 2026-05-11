from rest_framework import serializers
from ..apps.models import Centros, Parroquias

class ParroquiasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parroquias
        fields = ['id_par', 'nom_par', 'telef_par', 'estado_par']

class CentrosSerializer(serializers.ModelSerializer):
    # Esto es para ver los datos completos de la parroquia (Solo lectura)
    parroquia_info = ParroquiasSerializer(source='id_par_1', read_only=True)
    
    # Esto es para PODER GUARDAR y RECIBIR el ID de la parroquia
    id_par_1 = serializers.PrimaryKeyRelatedField(
        queryset=Parroquias.objects.all(), 
        required=True
    )

    class Meta:
        model = Centros
        fields = [
            'id_cen', 
            'nom_cen', 
            'telf_cen', 
            'pais_cen',      # Agregado
            'municipio_cen', # Agregado
            'provincia_cen', # Agregado
            'ciudad_cen', 
            'calle_cen', 
            'estado_cen', 
            'coordenadas_cen', 
            'id_par_1',      # CRÍTICO: Para guardar el ID
            'parroquia_info' # Para mostrar info extra
        ]
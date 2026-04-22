from rest_framework import serializers
from .models import Personas, Usuarios, Rols

# Serializador para los datos de la Persona
class PersonaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personas
        fields = ['nom_per', 'ap_pat_per', 'carnet_per', 'cel_per']

# Serializador principal para el Usuario
class UsuarioSerializer(serializers.ModelSerializer):
    # Esto permite que cuando consultes un usuario, veas los datos de su persona vinculada
    persona = PersonaSerializer(source='id_per_1', read_only=True)
    nombre_rol = serializers.CharField(source='id_rol_1.nom_rol', read_only=True)

    class Meta:
        model = Usuarios
        fields = [
            'id_usu', 
            'correo_usu', 
            'estado_usu', 
            'id_rol_1', 
            'persona', 
            'nombre_rol'
        ]
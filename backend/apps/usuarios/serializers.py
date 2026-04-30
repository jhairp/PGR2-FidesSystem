# apps/usuarios/serializers.py

from rest_framework import serializers
from .models import Personas, Usuarios, Rols


# =========================
# PERSONAS
# =========================

class PersonaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Personas
        fields = [
            'id_per',
            'nom_per',
            'ap_pat_per',
            'cel_per',
            'carnet_per'
        ]


# =========================
# ROLES
# =========================

class RolSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rols
        fields = '__all__'


# =========================
# USUARIOS LISTAR
# =========================

class UsuarioSerializer(serializers.ModelSerializer):

    persona = PersonaSerializer(source='id_per_1', read_only=True)

    nombre_rol = serializers.CharField(
        source='id_rol_1.nom_rol',
        read_only=True
    )

    class Meta:
        model = Usuarios
        fields = [
            'id_usu',
            'correo_usu',
            'estado_usu',
            'foto_usu',
            'google_id',
            'id_rol_1',
            'nombre_rol',
            'persona',
            'created_at',
            'updated_at'
        ]


# =========================
# CREAR USUARIO
# =========================

class CrearUsuarioSerializer(serializers.Serializer):

    # PERSONA
    nom_per = serializers.CharField(max_length=255)
    ap_pat_per = serializers.CharField(max_length=255)
    carnet_per = serializers.CharField(max_length=255)
    cel_per = serializers.CharField(max_length=255)

    # USUARIO
    correo_usu = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    id_rol_1 = serializers.IntegerField()

    def validate_correo_usu(self, value):

        if Usuarios.objects.filter(correo_usu=value).exists():
            raise serializers.ValidationError(
                "El correo ya existe"
            )

        return value
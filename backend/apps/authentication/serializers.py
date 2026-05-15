from django.utils import timezone

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)

from rest_framework import serializers

from apps.usuarios.models import (
    Usuarios,
    Personas,
    Rols,
    PerRols,
)

from rest_framework import serializers

from apps.usuarios.models import Usuarios

class CustomTokenSerializer(
    TokenObtainPairSerializer
):

    username_field = 'correo_usu'

    @classmethod
    def get_token(cls, user):

        return super().get_token(user)

    def validate(self, attrs):

        data = super().validate(attrs)

        needs_completion = False

        if (
            not self.user.id_per_1.carnet_per
            or
            not self.user.id_per_1.cel_per
        ):

            needs_completion = True

        data['needs_completion'] = (
            needs_completion
        )

        return data

class RegisterSerializer(
    serializers.Serializer
):

    nom_per = serializers.CharField()

    ap_pat_per = serializers.CharField()

    carnet_per = serializers.CharField()

    cel_per = serializers.CharField()

    correo_usu = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    password_confirmation = serializers.CharField(
            write_only=True
        )

    foto_usu = serializers.CharField(
        required=False
    )

    def validate(self, data):

        if (
            data['password']
            !=
            data['password_confirmation']
        ):

            raise serializers.ValidationError(
                'Las contraseñas no coinciden'
            )

        if Usuarios.objects.filter(
            correo_usu=data['correo_usu']
        ).exists():

            raise serializers.ValidationError(
                'El correo ya existe'
            )

        return data

    def create(self, validated_data):

        per_rol = PerRols.objects.get(id_per_rol=2)

        persona = Personas.objects.create(

                nom_per=validated_data[
                    'nom_per'
                ].upper(),

                ap_pat_per=validated_data[
                    'ap_pat_per'
                ].upper(),

                carnet_per=validated_data[
                    'carnet_per'
                ],

                cel_per=validated_data[
                    'cel_per'
                ],

                id_per_rol_1=per_rol,

                created_at=timezone.now(),
                updated_at=timezone.now(),
            )

        rol = Rols.objects.get(id_rol=4)

        usuario = Usuarios.objects.create(

                correo_usu=validated_data[
                    'correo_usu'
                ],

                estado_usu='activo',

                foto_usu='default.png',

                id_per_1=persona,

                id_rol_1=rol,

                created_at=timezone.now(),
                updated_at=timezone.now(),
            )

        usuario.set_password(
            validated_data['password']
        )

        usuario.save()

        return usuario
    
class MeSerializer(
    serializers.ModelSerializer
):

    persona = serializers.SerializerMethodField()

    class Meta:

        model = Usuarios

        fields = [
            'id_usu',
            'correo_usu',
            'foto_usu',
            'tema_usu',
            'id_rol_1',
            'persona',
        ]

    def get_persona(self, obj):

        return {

            'nom_per': obj.id_per_1.nom_per,

            'ap_pat_per':
                obj.id_per_1.ap_pat_per,
        }
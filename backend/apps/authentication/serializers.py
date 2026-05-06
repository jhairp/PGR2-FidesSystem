from django.utils import timezone

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)


class CustomTokenSerializer(
    TokenObtainPairSerializer
):

    username_field = 'correo_usu'

from rest_framework import serializers

from apps.usuarios.models import (
    Usuarios,
    Personas,
    Rols,
    PerRols,
)


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

        per_rol = PerRols.objects.first()

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

        rol = Rols.objects.first()

        usuario = Usuarios.objects.create(

                correo_usu=validated_data[
                    'correo_usu'
                ],

                estado_usu='activo',

                foto_usu=validated_data.get(
                    'foto_usu',
                    'default.png'
                ),

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
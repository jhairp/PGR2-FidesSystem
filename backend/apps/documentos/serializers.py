import os
import uuid
from rest_framework import serializers
from apps.models import Documentos, Sacramentos


class DocumentoSerializer(serializers.ModelSerializer):
    """
    Serializer de lectura: devuelve todos los campos
    más info del sacramento relacionado.
    """
    sacramento_tipo = serializers.SerializerMethodField()
    sacramento_fecha = serializers.SerializerMethodField()

    class Meta:
        model = Documentos
        fields = [
            'id_doc',
            'nom_doc',
            'tipo_doc',
            'desc_doc',
            'estado_doc',
            'observacion_doc',
            'codigo_doc',
            'url_doc',
            'id_sac_5_id',
            'sacramento_tipo',
            'sacramento_fecha',
            'id_usu_5_id',
            'created_at',
            'updated_at',
        ]

    def get_sacramento_tipo(self, obj):
        if obj.id_sac_5:
            return obj.id_sac_5.tipo_sac
        return None

    def get_sacramento_fecha(self, obj):
        if obj.id_sac_5:
            return str(obj.id_sac_5.fecha_sac)
        return None


class DocumentoUploadSerializer(serializers.Serializer):
    """
    Serializer de escritura: recibe el archivo + metadatos.
    El archivo se guarda en disco y url_doc almacena la ruta relativa.
    """
    archivo     = serializers.FileField()
    nom_doc     = serializers.CharField(max_length=255)
    tipo_doc    = serializers.CharField(max_length=255)
    desc_doc    = serializers.CharField(max_length=255, required=False, allow_blank=True)
    id_sac_5    = serializers.IntegerField(required=False, allow_null=True)

    # Tipos permitidos
    TIPOS_PERMITIDOS = [
        'partida_bautismo',
        'cedula',
        'certificado',
        'acta_matrimonio',
        'foto',
        'otro',
    ]

    # Extensiones permitidas
    EXTENSIONES_PERMITIDAS = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']

    def validate_archivo(self, value):
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in self.EXTENSIONES_PERMITIDAS:
            raise serializers.ValidationError(
                f"Extensión no permitida. Use: {', '.join(self.EXTENSIONES_PERMITIDAS)}"
            )
        # Máximo 10 MB
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("El archivo no puede superar 10 MB.")
        return value

    def validate_tipo_doc(self, value):
        if value not in self.TIPOS_PERMITIDOS:
            raise serializers.ValidationError(
                f"Tipo no válido. Opciones: {', '.join(self.TIPOS_PERMITIDOS)}"
            )
        return value

    def validate_id_sac_5(self, value):
        if value and not Sacramentos.objects.filter(pk=value).exists():
            raise serializers.ValidationError("El sacramento indicado no existe.")
        return value


class DocumentoEstadoSerializer(serializers.Serializer):
    """Cambia solo el estado y la observación de un documento."""
    estado_doc      = serializers.ChoiceField(
        choices=['generado', 'pendiente', 'aprobado', 'rechazado']
    )
    observacion_doc = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )

from rest_framework import serializers
from .models import Eventos, Centros, Comprobantes

class EventosSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar información amigable en el calendario
    nombre_centro = serializers.ReadOnlyField(source='id_cen_3.nom_cen')
    
    # Estos campos permiten que el GET devuelva el ID del objeto relacionado
    # Pero también permiten que el POST reciba un simple número (ID)
    id_cen_3 = serializers.PrimaryKeyRelatedField(
        queryset=Centros.objects.all()
    )
    id_com_1 = serializers.PrimaryKeyRelatedField(
        queryset=Comprobantes.objects.all(), 
        allow_null=True, 
        required=False
    )

    # Formateamos la hora para que siempre tenga el formato HH:mm:ss
    # Esto evita errores de visualización en el FullCalendar
    hora_eve = serializers.TimeField(format='%H:%M:%S', input_formats=['%H:%M', '%H:%M:%S'])

    class Meta:
        model = Eventos
        fields = [
            'id_eve',
            'tipo_eve',
            'fecha_eve',
            'hora_eve',
            'estado_eve',
            'detalle_eve',
            'id_cen_3',
            'nombre_centro', # Incluido para mostrar "Misa - Parroquia Central"
            'id_com_1',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id_eve', 'created_at', 'updated_at']

    def validate_id_com_1(self, value):
        """
        Asegura que el comprobante sea opcional como pediste.
        """
        if value is None:
            return None
        return value
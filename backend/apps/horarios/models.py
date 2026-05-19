from django.db import models

from apps.centros.models import Centro


# =========================================
# HORARIO GENERAL
# =========================================

class HorarioCentro(models.Model):

    # =====================================
    # CHOICES
    # =====================================

    DIAS = [

        ("lunes", "Lunes"),
        ("martes", "Martes"),
        ("miercoles", "Miércoles"),
        ("jueves", "Jueves"),
        ("viernes", "Viernes"),
        ("sabado", "Sábado"),
        ("domingo", "Domingo"),
    ]

    TIPOS = [

        ("misas", "Misas"),
        ("atencion", "Atención"),
        ("confesion", "Confesión"),
        ("evento", "Evento"),
    ]

    ESTADOS = [

        ("activo", "Activo"),
        ("inactivo", "Inactivo"),
    ]

    # =====================================
    # CAMPOS
    # =====================================

    id_hor = models.BigAutoField(
        primary_key=True
    )

    hora_ini_hor = models.TimeField()

    hora_fin_hor = models.TimeField()

    dia_sem_hor = models.CharField(

        max_length=20,

        choices=DIAS
    )

    tipo_hor = models.CharField(

        max_length=255,

        choices=TIPOS
    )

    estado_hor = models.CharField(

        max_length=50,

        choices=ESTADOS,

        default="activo"
    )

    id_cen_4 = models.ForeignKey(

        Centro,

        models.DO_NOTHING,

        db_column='id_cen_4',

        related_name='horarios_centro'
    )

    # =====================================
    # FECHAS
    # =====================================

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # =====================================
    # META
    # =====================================

    class Meta:

        managed = False

        db_table = 'horarios'

    # =====================================
    # STRING
    # =====================================

    def __str__(self):

        return (
            f"{self.get_dia_sem_hor_display()} | "
            f"{self.hora_ini_hor} - "
            f"{self.hora_fin_hor}"
        )


# =========================================
# HORARIOS NO DISPONIBLES
# =========================================

class HorarioInd(models.Model):

    ESTADOS = [

        ("activo", "Activo"),
        ("inactivo", "Inactivo"),
    ]

    # =====================================
    # CAMPOS
    # =====================================

    id_hor_ind = models.BigAutoField(
        primary_key=True
    )

    hora_ini_ind = models.TimeField()

    hora_fin_ind = models.TimeField()

    motivo_ind = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    estado_ind = models.CharField(

        max_length=50,

        choices=ESTADOS,

        default='activo'
    )

    id_hor_1 = models.ForeignKey(

        HorarioCentro,

        models.CASCADE,

        db_column='id_hor_1',

        related_name='horarios_indisponibles'
    )

    # =====================================
    # FECHAS
    # =====================================

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # =====================================
    # META
    # =====================================

    class Meta:

        managed = False

        db_table = 'hor_ind'

    # =====================================
    # STRING
    # =====================================

    def __str__(self):

        return (
            f"{self.hora_ini_ind} "
            f"- "
            f"{self.hora_fin_ind}"
        )
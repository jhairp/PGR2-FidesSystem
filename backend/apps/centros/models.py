from django.db import models


class Parroquia(models.Model):
    ESTADOS = (
        ("ACTIVO", "ACTIVO"),
        ("INACTIVO", "INACTIVO"),
    )
    id_par = models.BigAutoField(primary_key=True)
    nom_par = models.CharField(max_length=255)
    telef_par = models.CharField(max_length=255)
    estado_par = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="ACTIVO"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "parroquias"

    def __str__(self):
        return self.nom_par


class Centro(models.Model):
    ESTADOS = [
        ("activo", "Activo"),
        ("inactivo", "Inactivo"),
    ]
    id_cen = models.BigAutoField(primary_key=True)
    nom_cen = models.CharField(max_length=255)
    telf_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    pais_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    municipio_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    ciudad_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    provincia_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    calle_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    coordenadas_cen = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    estado_cen = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="ACTIVO"
    )
    parroquia = models.ForeignKey(
        Parroquia,
        on_delete=models.PROTECT,
        related_name="centros",
        db_column="id_par_1"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    capacidad_cen = models.PositiveIntegerField(
        default=0
    )
    class Meta:
        db_table = "centros"

    def __str__(self):
        return self.nom_cen


class Horario(models.Model):
    ESTADOS = (
        ("ACTIVO", "ACTIVO"),
        ("INACTIVO", "INACTIVO"),
    )

    id_hor = models.BigAutoField(primary_key=True)
    hora_ini_hor = models.TimeField()
    hora_fin_hor = models.TimeField()
    tipo_hor = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    lunes_hor = models.BooleanField(default=False)
    martes_hor = models.BooleanField(default=False)
    miercoles_hor = models.BooleanField(default=False)
    jueves_hor = models.BooleanField(default=False)
    viernes_hor = models.BooleanField(default=False)
    sabado_hor = models.BooleanField(default=False)
    domingo_hor = models.BooleanField(default=False)
    estado_hor = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default="ACTIVO"
    )
    centro = models.ForeignKey(
        Centro,
        on_delete=models.CASCADE,
        related_name="horarios",
        db_column="id_cen_4"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "horarios"

    def __str__(self):
        return f"{self.hora_ini_hor} - {self.hora_fin_hor}"

class ImagenCentro(models.Model):

    id_img = models.BigAutoField(
        primary_key=True
    )

    url_img = models.TextField()

    centro = models.ForeignKey(
        Centro,
        on_delete=models.CASCADE,
        related_name="imagenes",
        db_column="id_cen_5"
    )

    class Meta:
        db_table = "imagenes_centro"

    def __str__(self):
        return self.url_img
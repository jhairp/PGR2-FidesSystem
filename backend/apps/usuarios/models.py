from django.db import models


class PerRols(models.Model):
    id_per_rol = models.BigAutoField(primary_key=True)
    nom_per_rol = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    estado_per_rol = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'per_rols'


class Personas(models.Model):
    id_per = models.BigAutoField(primary_key=True)
    nom_per = models.CharField(max_length=255)
    ap_pat_per = models.CharField(max_length=255, blank=True, null=True)
    cel_per = models.CharField(max_length=255, blank=True, null=True)
    carnet_per = models.CharField(max_length=255, blank=True, null=True)
    id_per_rol_1 = models.ForeignKey(PerRols, models.DO_NOTHING, db_column='id_per_rol_1')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'personas'


class Rols(models.Model):
    id_rol = models.BigAutoField(primary_key=True)
    nom_rol = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    estado_rol = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'rols'

class Usuarios(models.Model):
    id_usu = models.BigAutoField(primary_key=True)
    correo_usu = models.CharField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    estado_usu = models.CharField(max_length=255)
    foto_usu = models.CharField(max_length=255, blank=True, null=True)
    id_per_1 = models.ForeignKey(Personas, models.DO_NOTHING, db_column='id_per_1')
    id_rol_1 = models.ForeignKey(Rols, models.DO_NOTHING, db_column='id_rol_1')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    google_id = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuarios'

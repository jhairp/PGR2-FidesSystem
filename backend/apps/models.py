from django.db import models

class Centros(models.Model):
    id_cen = models.BigAutoField(primary_key=True)
    nom_cen = models.CharField(max_length=255)
    telf_cen = models.CharField(max_length=255, blank=True, null=True)
    pais_cen = models.CharField(max_length=255, blank=True, null=True)
    municipio_cen = models.CharField(max_length=255, blank=True, null=True)
    ciudad_cen = models.CharField(max_length=255, blank=True, null=True)
    provincia_cen = models.CharField(max_length=255, blank=True, null=True)
    calle_cen = models.CharField(max_length=255, blank=True, null=True)
    estado_cen = models.CharField(max_length=255)
    coordenadas_cen = models.CharField(max_length=255, blank=True, null=True)
    id_par_1 = models.ForeignKey('Parroquias', models.DO_NOTHING, db_column='id_par_1')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'centros'


class Comprobantes(models.Model):
    id_com = models.BigAutoField(primary_key=True)
    codigo_com = models.CharField(unique=True, max_length=255)
    estado_pago_com = models.CharField(max_length=255)
    monto_com = models.DecimalField(max_digits=10, decimal_places=2)
    monto_lit_com = models.CharField(max_length=255, blank=True, null=True)
    tipo_com = models.CharField(max_length=255)
    nom_com_com = models.CharField(max_length=255, blank=True, null=True)
    cel_com = models.CharField(max_length=255, blank=True, null=True)
    carnet_com = models.CharField(max_length=255, blank=True, null=True)
    id_usu_3 = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usu_3')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comprobantes'


class DetMats(models.Model):
    id_dma = models.BigAutoField(primary_key=True)
    reg_mat_civ_dma = models.CharField(max_length=255, blank=True, null=True)
    lug_mat_dma = models.CharField(max_length=255, blank=True, null=True)
    fec_mat_civ_dma = models.CharField(max_length=255, blank=True, null=True)
    lib_mat_civ_dma = models.CharField(max_length=255, blank=True, null=True)
    par_mat_civ_dma = models.CharField(max_length=255, blank=True, null=True)
    nom_test_1_dma = models.CharField(max_length=255, blank=True, null=True)
    nom_test_2_dma = models.CharField(max_length=255, blank=True, null=True)
    id_sac_1 = models.ForeignKey('Sacramentos', models.DO_NOTHING, db_column='id_sac_1')
    id_lai_2 = models.ForeignKey('Laicos', models.DO_NOTHING, db_column='id_lai_2', blank=True, null=True)
    id_lai_3 = models.ForeignKey('Laicos', models.DO_NOTHING, db_column='id_lai_3', related_name='detmats_id_lai_3_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'det_mats'


class DetPars(models.Model):
    id_det_par = models.BigAutoField(primary_key=True)
    id_per_3 = models.ForeignKey('Personas', models.DO_NOTHING, db_column='id_per_3')
    id_cen_1 = models.ForeignKey(Centros, models.DO_NOTHING, db_column='id_cen_1')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'det_pars'


class DetUsus(models.Model):
    id_det_usu = models.BigAutoField(primary_key=True)
    id_sac_2 = models.ForeignKey('Sacramentos', models.DO_NOTHING, db_column='id_sac_2')
    id_per_2 = models.ForeignKey('Personas', models.DO_NOTHING, db_column='id_per_2')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'det_usus'


class Documentos(models.Model):
    id_doc = models.BigAutoField(primary_key=True)
    url_doc = models.CharField(max_length=255)
    nom_doc = models.CharField(max_length=255)
    tipo_doc = models.CharField(max_length=255)
    desc_doc = models.CharField(max_length=255, blank=True, null=True)
    estado_doc = models.CharField(max_length=255)
    observacion_doc = models.CharField(max_length=255, blank=True, null=True)
    codigo_doc = models.CharField(max_length=255, blank=True, null=True)
    id_sac_5 = models.ForeignKey('Sacramentos', models.DO_NOTHING, db_column='id_sac_5', blank=True, null=True)
    id_usu_5 = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usu_5', blank=True, null=True)
    id_usu_6 = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usu_6', related_name='documentos_id_usu_6_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'documentos'


class Eventos(models.Model):
    # Definimos los estados posibles como constantes para evitar errores de dedo
    PENDIENTE = 'pendiente'
    APROBADO = 'aprobado'
    CANCELADO = 'cancelado'

    ESTADO_CHOICES = [
        (PENDIENTE, 'Pendiente'),
        (APROBADO, 'Aprobado'),
        (CANCELADO, 'Cancelado'),
    ]

    id_eve = models.BigAutoField(primary_key=True)
    tipo_eve = models.CharField(max_length=255)
    fecha_eve = models.DateField()
    hora_eve = models.TimeField()
    # Actualizamos este campo con las opciones
    estado_eve = models.CharField(
        max_length=255, 
        choices=ESTADO_CHOICES, 
        default=PENDIENTE
    )
    detalle_eve = models.TextField(blank=True, null=True)
    id_cen_3 = models.ForeignKey(Centros, models.DO_NOTHING, db_column='id_cen_3')
    id_com_1 = models.ForeignKey(Comprobantes, models.DO_NOTHING, db_column='id_com_1', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = False # Mantén esto si la tabla ya existe en tu DB
        db_table = 'eventos'


class Horarios(models.Model):
    id_hor = models.BigAutoField(primary_key=True)
    hora_ini_hor = models.TimeField()
    hora_fin_hor = models.TimeField(blank=True, null=True)
    tipo_hor = models.CharField(max_length=255, blank=True, null=True)
    lunes_hor = models.BooleanField()
    martes_hor = models.BooleanField()
    miercoles_hor = models.BooleanField()
    jueves_hor = models.BooleanField()
    viernes_hor = models.BooleanField()
    sabado_hor = models.BooleanField()
    domingo_hor = models.BooleanField()
    estado_hor = models.CharField(max_length=255)
    id_cen_4 = models.ForeignKey(Centros, models.DO_NOTHING, db_column='id_cen_4')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'horarios'


class Laicos(models.Model):
    id_lai = models.BigAutoField(primary_key=True)
    nom_lai = models.CharField(max_length=255)
    ap_pat_lai = models.CharField(max_length=255, blank=True, null=True)
    ap_mat_lai = models.CharField(max_length=255, blank=True, null=True)
    fecha_nac_lai = models.DateField(blank=True, null=True)
    lugar_nac_lai = models.CharField(max_length=255, blank=True, null=True)
    genero_lai = models.CharField(max_length=20, blank=True, null=True)
    estado_civ_lai = models.CharField(max_length=255, blank=True, null=True)
    domicilio_lai = models.CharField(max_length=255, blank=True, null=True)
    regis_civ_lai = models.CharField(max_length=255, blank=True, null=True)
    part_civ_lai = models.CharField(max_length=255, blank=True, null=True)
    lib_civ_lai = models.CharField(max_length=255, blank=True, null=True)
    nom_p_lai = models.CharField(max_length=255, blank=True, null=True)
    ap_pat_p_lai = models.CharField(max_length=255, blank=True, null=True)
    ap_mat_p_lai = models.CharField(max_length=255, blank=True, null=True)
    nom_m_lai = models.CharField(max_length=255, blank=True, null=True)
    ap_pat_m_lai = models.CharField(max_length=255, blank=True, null=True)
    ap_mat_m_lai = models.CharField(max_length=255, blank=True, null=True)
    estado_lai = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'laicos'


class Libros(models.Model):
    id_lib = models.BigAutoField(primary_key=True)
    num_lib = models.CharField(max_length=255)
    pag_lib = models.CharField(max_length=255)
    par_lib = models.CharField(max_length=255)
    id_sac_3 = models.ForeignKey('Sacramentos', models.DO_NOTHING, db_column='id_sac_3')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'libros'


class Notas(models.Model):
    id_not = models.BigAutoField(primary_key=True)
    accion_not = models.CharField(max_length=255)
    desc_not = models.TextField()
    tipo_not = models.CharField(max_length=255)
    id_sac_4 = models.ForeignKey('Sacramentos', models.DO_NOTHING, db_column='id_sac_4')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notas'


class Parroquias(models.Model):
    id_par = models.BigAutoField(primary_key=True)
    nom_par = models.CharField(max_length=255)
    telef_par = models.CharField(max_length=255)
    estado_par = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'parroquias'


class Sacramentos(models.Model):
    id_sac = models.BigAutoField(primary_key=True)
    tipo_sac = models.CharField(max_length=255)
    fecha_sac = models.DateField()
    nom_pad_1_sac = models.CharField(max_length=255, blank=True, null=True)
    gen_pad_1_sac = models.CharField(max_length=20, blank=True, null=True)
    nom_pad_2_sac = models.CharField(max_length=255, blank=True, null=True)
    gen_pad_2_sac = models.CharField(max_length=20, blank=True, null=True)
    estado_sac = models.CharField(max_length=255)
    id_lai_1 = models.ForeignKey(Laicos, models.DO_NOTHING, db_column='id_lai_1')
    id_cen_2 = models.ForeignKey(Centros, models.DO_NOTHING, db_column='id_cen_2')
    id_usu_4 = models.ForeignKey('Usuarios', models.DO_NOTHING, db_column='id_usu_4')
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sacramentos'

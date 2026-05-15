from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


# =========================================================
# MANAGER
# =========================================================

class UsuarioManager(BaseUserManager):

    def create_user(
        self,
        correo_usu,
        password=None,
        **extra_fields
    ):

        if not correo_usu:

            raise ValueError(
                'El correo es obligatorio'
            )

        correo_usu = self.normalize_email(
            correo_usu
        )

        usuario = self.model(
            correo_usu=correo_usu,
            **extra_fields
        )

        usuario.set_password(password)

        usuario.save(using=self._db)

        return usuario

    def create_superuser(
        self,
        correo_usu,
        password=None,
        **extra_fields
    ):

        extra_fields.setdefault(
            'is_staff',
            True
        )

        extra_fields.setdefault(
            'is_superuser',
            True
        )

        extra_fields.setdefault(
            'is_active',
            True
        )

        return self.create_user(
            correo_usu,
            password,
            **extra_fields
        )


# =========================================================
# PER ROLES
# =========================================================

class PerRols(models.Model):

    id_per_rol = models.BigAutoField(
        primary_key=True
    )

    nom_per_rol = models.CharField(
        max_length=255
    )

    created_at = models.DateTimeField(
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(
        blank=True,
        null=True
    )

    estado_per_rol = models.CharField(
        max_length=255
    )

    class Meta:

        managed = False

        db_table = 'per_rols'

    def __str__(self):

        return self.nom_per_rol


# =========================================================
# PERSONAS
# =========================================================

class Personas(models.Model):

    id_per = models.BigAutoField(
        primary_key=True
    )

    nom_per = models.CharField(
        max_length=255
    )

    ap_pat_per = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    cel_per = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    carnet_per = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    id_per_rol_1 = models.ForeignKey(
        PerRols,
        models.DO_NOTHING,
        db_column='id_per_rol_1'
    )

    created_at = models.DateTimeField(
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(
        blank=True,
        null=True
    )

    class Meta:

        managed = False

        db_table = 'personas'

    def __str__(self):

        return f'{self.nom_per} {self.ap_pat_per or ""}'


# =========================================================
# ROLES
# =========================================================

class Rols(models.Model):

    id_rol = models.BigAutoField(
        primary_key=True
    )

    nom_rol = models.CharField(
        max_length=255
    )

    created_at = models.DateTimeField(
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(
        blank=True,
        null=True
    )

    estado_rol = models.CharField(
        max_length=255
    )

    class Meta:

        managed = False

        db_table = 'rols'

    def __str__(self):

        return self.nom_rol


# =========================================================
# USUARIOS
# =========================================================

class Usuarios(
    AbstractBaseUser,
    PermissionsMixin
):

    id_usu = models.BigAutoField(
        primary_key=True
    )

    correo_usu = models.EmailField(
        unique=True,
        max_length=255
    )

    password = models.CharField(
        max_length=255
    )

    estado_usu = models.CharField(
        max_length=255,
        default='activo'
    )

    foto_usu = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    tema_usu = models.CharField(
        max_length=10,
        default='light'
    )

    google_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    id_per_1 = models.ForeignKey(
        Personas,
        models.DO_NOTHING,
        db_column='id_per_1'
    )

    id_rol_1 = models.ForeignKey(
        Rols,
        models.DO_NOTHING,
        db_column='id_rol_1'
    )

    # =====================================================
    # DJANGO AUTH
    # =====================================================

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    last_login = models.DateTimeField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        blank=True,
        null=True
    )

    updated_at = models.DateTimeField(
        blank=True,
        null=True
    )

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo_usu'

    REQUIRED_FIELDS = []

    class Meta:

        #managed = False

        db_table = 'usuarios'
        

    def __str__(self):

        return self.correo_usu
    
    @property
    def id(self):
        return self.id_usu
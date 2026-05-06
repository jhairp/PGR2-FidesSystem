from rest_framework import serializers
from .validators import validar_fecha_bautizo


class BautizoCreateSerializer(serializers.Serializer):

    # =========================
    # LAICO
    # =========================

    nom_lai = serializers.CharField(max_length=255)
    ap_pat_lai = serializers.CharField(max_length=255)
    ap_mat_lai = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    fecha_nac_lai = serializers.DateField()

    lugar_nac_lai = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    genero_lai = serializers.ChoiceField(
        choices=["Masculino", "Femenino"]
    )

    estado_civ_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    domicilio_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    regis_civ_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    part_civ_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    lib_civ_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    # =========================
    # PADRE
    # =========================

    nom_p_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    ap_pat_p_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    ap_mat_p_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    # =========================
    # MADRE
    # =========================

    nom_m_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    ap_pat_m_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    ap_mat_m_lai = serializers.CharField(
        required=False,
        allow_blank=True
    )

    # =========================
    # SACRAMENTO
    # =========================

    fecha_sac = serializers.DateField()

    id_cen_2 = serializers.IntegerField()

    # =========================
    # PADRINOS
    # =========================

    nom_pad_1_sac = serializers.CharField(
        required=False,
        allow_blank=True
    )

    gen_pad_1_sac = serializers.CharField(
        required=False,
        allow_blank=True
    )

    nom_pad_2_sac = serializers.CharField(
        required=False,
        allow_blank=True
    )

    gen_pad_2_sac = serializers.CharField(
        required=False,
        allow_blank=True
    )

    # =========================
    # LIBRO
    # =========================

    num_lib = serializers.CharField()
    pag_lib = serializers.CharField()
    par_lib = serializers.CharField()

    # =========================
    # SACERDOTES
    # =========================

    sacerdote_celebrante = serializers.IntegerField()
    sacerdote_certificador = serializers.IntegerField()

    # =========================
    # VALIDACIONES
    # =========================

    def validate(self, data):

        validar_fecha_bautizo(
            data["fecha_nac_lai"],
            data["fecha_sac"]
        )

        return data

class BautizoEstadoSerializer(serializers.Serializer):

    estado_sac = serializers.ChoiceField(
        choices=[
            "ACTIVO",
            "INACTIVO"
        ]
    )
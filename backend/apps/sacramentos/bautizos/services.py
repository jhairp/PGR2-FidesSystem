from django.db import transaction

from .models import (
    Laicos,
    Sacramentos,
    Libros,
    DetUsus,
    Centros
)

from apps.usuarios.models import Personas


@transaction.atomic
def crear_bautizo(validated_data, usuario):

    # =========================
    # CREAR LAICO
    # =========================

    laico = Laicos.objects.create(

        nom_lai=validated_data["nom_lai"],
        ap_pat_lai=validated_data.get("ap_pat_lai"),
        ap_mat_lai=validated_data.get("ap_mat_lai"),

        fecha_nac_lai=validated_data["fecha_nac_lai"],
        lugar_nac_lai=validated_data.get("lugar_nac_lai"),

        genero_lai=validated_data.get("genero_lai"),

        estado_civ_lai=validated_data.get("estado_civ_lai"),
        domicilio_lai=validated_data.get("domicilio_lai"),

        regis_civ_lai=validated_data.get("regis_civ_lai"),
        part_civ_lai=validated_data.get("part_civ_lai"),
        lib_civ_lai=validated_data.get("lib_civ_lai"),

        nom_p_lai=validated_data.get("nom_p_lai"),
        ap_pat_p_lai=validated_data.get("ap_pat_p_lai"),
        ap_mat_p_lai=validated_data.get("ap_mat_p_lai"),

        nom_m_lai=validated_data.get("nom_m_lai"),
        ap_pat_m_lai=validated_data.get("ap_pat_m_lai"),
        ap_mat_m_lai=validated_data.get("ap_mat_m_lai"),

        estado_lai="ACTIVO"
    )

    # =========================
    # CREAR SACRAMENTO
    # =========================

    sacramento = Sacramentos.objects.create(

        tipo_sac="BAUTIZO",

        fecha_sac=validated_data["fecha_sac"],

        nom_pad_1_sac=validated_data.get("nom_pad_1_sac"),
        gen_pad_1_sac=validated_data.get("gen_pad_1_sac"),

        nom_pad_2_sac=validated_data.get("nom_pad_2_sac"),
        gen_pad_2_sac=validated_data.get("gen_pad_2_sac"),

        estado_sac="ACTIVO",

        id_lai_1=laico,

        id_cen_2_id=validated_data["id_cen_2"],

        id_usu_4=usuario
    )

    # =========================
    # LIBRO SACRAMENTAL
    # =========================

    Libros.objects.create(

        num_lib=validated_data["num_lib"],
        pag_lib=validated_data["pag_lib"],
        par_lib=validated_data["par_lib"],

        id_sac_3=sacramento
    )

    # =========================
    # SACERDOTE CELEBRANTE
    # =========================

    DetUsus.objects.create(

        id_sac_2=sacramento,

        id_per_2_id=validated_data["sacerdote_celebrante"]
    )

    # =========================
    # SACERDOTE CERTIFICADOR
    # =========================

    DetUsus.objects.create(

        id_sac_2=sacramento,

        id_per_2_id=validated_data["sacerdote_certificador"]
    )

    return sacramento
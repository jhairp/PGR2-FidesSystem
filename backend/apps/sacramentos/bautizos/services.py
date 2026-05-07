from django.db import transaction

from .models import (
    Laicos,
    Sacramentos,
    Libros,
    DetUsus,
    Centros
)

from django.shortcuts import get_object_or_404

from apps.usuarios.models import Personas

from django.db.models import Value
from django.db.models.functions import Concat


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

def cambiar_estado_bautizo(id_sac, estado):

    sacramento = get_object_or_404(
        Sacramentos,
        id_sac=id_sac,
        tipo_sac="BAUTIZO"
    )

    sacramento.estado_sac = estado

    sacramento.save()

    return sacramento

@transaction.atomic
def editar_bautizo(id_sac, validated_data):

    sacramento = Sacramentos.objects.get(
        id_sac=id_sac,
        tipo_sac="BAUTIZO"
    )

    # =========================
    # LAICO
    # =========================

    laico = sacramento.id_lai_1

    laico.nom_lai = validated_data["nom_lai"]
    laico.ap_pat_lai = validated_data.get("ap_pat_lai")
    laico.ap_mat_lai = validated_data.get("ap_mat_lai")

    laico.fecha_nac_lai = validated_data["fecha_nac_lai"]

    laico.lugar_nac_lai = validated_data.get("lugar_nac_lai")

    laico.genero_lai = validated_data.get("genero_lai")

    laico.estado_civ_lai = validated_data.get("estado_civ_lai")

    laico.domicilio_lai = validated_data.get("domicilio_lai")

    laico.regis_civ_lai = validated_data.get("regis_civ_lai")

    laico.part_civ_lai = validated_data.get("part_civ_lai")

    laico.lib_civ_lai = validated_data.get("lib_civ_lai")

    laico.nom_p_lai = validated_data.get("nom_p_lai")
    laico.ap_pat_p_lai = validated_data.get("ap_pat_p_lai")
    laico.ap_mat_p_lai = validated_data.get("ap_mat_p_lai")

    laico.nom_m_lai = validated_data.get("nom_m_lai")
    laico.ap_pat_m_lai = validated_data.get("ap_pat_m_lai")
    laico.ap_mat_m_lai = validated_data.get("ap_mat_m_lai")

    laico.save()

    # =========================
    # SACRAMENTO
    # =========================

    sacramento.fecha_sac = validated_data["fecha_sac"]

    sacramento.nom_pad_1_sac = validated_data.get("nom_pad_1_sac")
    sacramento.gen_pad_1_sac = validated_data.get("gen_pad_1_sac")

    sacramento.nom_pad_2_sac = validated_data.get("nom_pad_2_sac")
    sacramento.gen_pad_2_sac = validated_data.get("gen_pad_2_sac")

    sacramento.id_cen_2_id = validated_data["id_cen_2"]

    sacramento.save()

    # =========================
    # LIBRO
    # =========================

    libro = Libros.objects.get(
        id_sac_3=sacramento
    )

    libro.num_lib = validated_data["num_lib"]
    libro.pag_lib = validated_data["pag_lib"]
    libro.par_lib = validated_data["par_lib"]

    libro.save()

    # =========================
    # SACERDOTES
    # =========================

    DetUsus.objects.filter(
        id_sac_2=sacramento
    ).delete()

    # celebrante

    DetUsus.objects.create(

        id_sac_2=sacramento,

        id_per_2_id=validated_data["sacerdote_celebrante"]
    )

    # certificador

    DetUsus.objects.create(

        id_sac_2=sacramento,

        id_per_2_id=validated_data["sacerdote_certificador"]
    )

    return sacramento

def listar_bautizos():

    bautizos = Sacramentos.objects.filter(
        tipo_sac='BAUTIZO'
    ).select_related(
        'id_lai_1',
        'id_cen_2'
    )

    data = []

    for b in bautizos:

        libro = Libros.objects.filter(
            id_sac_3=b
        ).first()

        data.append({

            "id_sac": b.id_sac,

            "bautizado":

                f"{b.id_lai_1.nom_lai} "
                f"{b.id_lai_1.ap_pat_lai} "
                f"{b.id_lai_1.ap_mat_lai}",

            "fecha_sac": b.fecha_sac,

            "centro": b.id_cen_2.nom_cen,

            "libro":

                f"{libro.num_lib}/"
                f"{libro.pag_lib}/"
                f"{libro.par_lib}"

                if libro else "",

            "estado_sac": b.estado_sac
        })

    return data

def obtener_bautizo(id_sac):

    bautizo = Sacramentos.objects.select_related(
        'id_lai_1'
    ).get(id_sac=id_sac)

    libro = Libros.objects.filter(
        id_sac_3=bautizo
    ).first()

    return {

        "id_sac": bautizo.id_sac,

        # BAUTIZADO

        "nom_lai":
            bautizo.id_lai_1.nom_lai,

        "ap_pat_lai":
            bautizo.id_lai_1.ap_pat_lai,

        "ap_mat_lai":
            bautizo.id_lai_1.ap_mat_lai,

        "fecha_nac_lai":
            bautizo.id_lai_1.fecha_nac_lai,

        "lugar_nac_lai":
            bautizo.id_lai_1.lugar_nac_lai,

        "domicilio_lai":
            bautizo.id_lai_1.dom_lai,

        # PADRES

        "nom_p_lai":
            bautizo.id_lai_1.nom_p_lai,

        "ap_pat_p_lai":
            bautizo.id_lai_1.ap_pat_p_lai,

        "ap_mat_p_lai":
            bautizo.id_lai_1.ap_mat_p_lai,

        "nom_m_lai":
            bautizo.id_lai_1.nom_m_lai,

        "ap_pat_m_lai":
            bautizo.id_lai_1.ap_pat_m_lai,

        "ap_mat_m_lai":
            bautizo.id_lai_1.ap_mat_m_lai,

        # SACRAMENTO

        "fecha_sac":
            bautizo.fecha_sac,

        "id_cen_2": 1,

        # PADRINOS

        "nom_pad_1_sac":
            bautizo.nom_pad_1_sac,

        "nom_pad_2_sac":
            bautizo.nom_pad_2_sac,

        # LIBRO

        "num_lib":
            libro.num_lib if libro else '',

        "pag_lib":
            libro.pag_lib if libro else '',

        "par_lib":
            libro.par_lib if libro else '',

        # SACERDOTES

        "sacerdote_celebrante":
            bautizo.id_per_1_id,

        "sacerdote_certificador":
            bautizo.id_per_2_id,
    }
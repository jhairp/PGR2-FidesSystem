from django.urls import path

from .views import (
    BautizoListView,
    BautizoCreateView,
    BautizoUpdateView,
    BautizoEstadoView,
    BautizoCertificadoView,
    CertificadoAssetUploadView,
    CertificadoTemplateView
)

urlpatterns = [

    # =========================
    # LISTAR
    # =========================

    path(
        '',
        BautizoListView.as_view(),
        name='listar_bautizos'
    ),

    # =========================
    # CREAR
    # =========================

    path(
        'crear/',
        BautizoCreateView.as_view(),
        name='crear_bautizo'
    ),

    # =========================
    # EDITAR
    # =========================

    path(
        '<int:id_sac>/',
        BautizoUpdateView.as_view(),
        name='editar_bautizo'
    ),

    # =========================
    # ESTADO
    # =========================

    path(
        '<int:id_sac>/estado/',
        BautizoEstadoView.as_view(),
        name='cambiar_estado_bautizo'
    ),

    # =========================
    # CERTIFICADO
    # =========================

    path(
        '<int:id_sac>/certificado/',
        BautizoCertificadoView.as_view(),
        name='certificado_bautizo'
    ),

    path(
        'certificado/template/',
        CertificadoTemplateView.as_view(),
        name='template_certificado_bautizo'
    ),

    path(
        'certificado/assets/',
        CertificadoAssetUploadView.as_view(),
        name='assets_certificado_bautizo'
    ),

]

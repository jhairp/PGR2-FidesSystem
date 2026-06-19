from django.urls import path

from .views import (
    BautizoListView,
    BautizoCreateView,
    BautizoUpdateView,
    BautizoEstadoView,
    BautizoCertificadoView
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

]

from django.urls import path

from .views import BautizoCreateView, BautizoEstadoView

urlpatterns = [

    path(
        "",
        BautizoCreateView.as_view(),
        name="crear_bautizo"
    ),

    path(
        "<int:id_sac>/estado/",
        BautizoEstadoView.as_view(),
        name="cambiar_estado_bautizo"
    ),

]
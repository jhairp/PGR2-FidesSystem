from django.urls import path

from .views import DetectarPartidaView

urlpatterns = [

    path(
        "detectar/",
        DetectarPartidaView.as_view(),
        name="detectar-partida"
    ),

]
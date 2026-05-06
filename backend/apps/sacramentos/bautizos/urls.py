from django.urls import path

from .views import BautizoCreateView

urlpatterns = [

    path(
        "",
        BautizoCreateView.as_view(),
        name="crear_bautizo"
    ),

]
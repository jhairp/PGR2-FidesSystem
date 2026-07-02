# apps/usuarios/urls.py

from django.urls import path

from .views import (
    UsuarioListView,
    UsuarioCreateView,
    UsuarioUpdateView,
)

urlpatterns = [

    path(
        '',
        UsuarioListView.as_view(),
        name='listar_usuarios'
    ),

    path(
        'crear/',
        UsuarioCreateView.as_view(),
        name='crear_usuario'
    ),

    path(
        '<int:id>/',
        UsuarioUpdateView.as_view(),
        name='actualizar_usuario'
    ),

]

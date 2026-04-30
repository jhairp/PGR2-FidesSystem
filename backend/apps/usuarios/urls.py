# apps/usuarios/urls.py

from django.urls import path

from .views import (
    UsuarioListView,
    UsuarioCreateView
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

]
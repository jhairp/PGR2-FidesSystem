"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import (
    path,
    include,
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/usuarios/', include('apps.usuarios.urls')),

    path(
        'api/',
        include('apps.usuarios.urls')
    ),

    path(
        'api/',
        include('apps.authentication.urls')
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view()
    ),

    path(
        "api/bautizos/",
        include("apps.sacramentos.bautizos.urls")
    ),
    
    path(
        "api/",
        include("apps.centros.urls")
    ),

    path(
        'api/det-pars/',
        include(
            'apps.det_pars.urls')
    ),

    path(
        "api/personas/",
        include("apps.personas.urls")
    ),

    path(
        'api/',
        include('apps.horarios.urls')
    ),

    path(
        'api/',
        include('apps.eventos.urls')
    ),

    path(
        "api/scanner/",
        include("apps.scanner.urls")
    ),
]
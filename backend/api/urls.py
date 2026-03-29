from django.urls import path
from .views import hola_mundo

urlpatterns = [
    path('saludo/', hola_mundo),
    path('capillas/', get_capillas),
]
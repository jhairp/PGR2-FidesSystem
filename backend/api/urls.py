from django.urls import path
from .views import get_capillas, estadisticas_parroquia

urlpatterns = [
    path('capillas/', get_capillas),
    path('estadisticas-bautizos/', estadisticas_parroquia),
]
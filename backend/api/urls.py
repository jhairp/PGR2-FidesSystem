from django.urls import path
from . import views  # Importamos el archivo views.py local

urlpatterns = [
    path('capillas/', views.get_capillas),
    path('estadisticas-bautizos/', views.estadisticas_parroquia),
    path('lista-bautizos/', views.get_lista_bautizos),
    path('crear-personal/', views.crear_personal),
    # Quitamos el 'views.' extra y usamos la función directamente
    path('lista-usuarios/', views.get_usuarios, name='lista-usuarios'),
    path('usuarios/<int:pk>/', views.get_usuario_detalle), 
    path('usuarios/<int:pk>/editar/', views.editar_usuario),
]
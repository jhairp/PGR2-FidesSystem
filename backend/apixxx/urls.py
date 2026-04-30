from django.urls import path
from . import views  # Importamos el archivo views.py local
from apixxx import views

urlpatterns = [
    path('capillas/', views.get_capillas, name='get_capillas'), # Esta es la de prueba
    # NUEVA RUTA PARA DATOS REALES:
    path('centros/', views.get_centros_db, name='get_centros_db'),
    path('centros/<int:pk>/', views.detalle_centro_db, name='detalle_centro_db'),
    path('parroquias/', views.get_parroquias_db, name='get_parroquias_db'),

    path('estadisticas-bautizos/', views.estadisticas_parroquia),
    path('lista-bautizos/', views.get_lista_bautizos),

    path('crear-personal/', views.crear_personal),
    path('lista-usuarios/', views.get_usuarios, name='lista-usuarios'),
    path('usuarios/<int:pk>/', views.get_usuario_detalle), 
    path('usuarios/<int:pk>/editar/', views.editar_usuario),

    path('eventos/', views.gestion_eventos, name='eventos'),
    path('eventos/<int:pk>/', views.gestion_eventos_detalle, name='eventos-detalle'),
]
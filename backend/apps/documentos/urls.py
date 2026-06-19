from django.urls import path
from .views import (
    DocumentoListCreateView,
    DocumentoDetailView,
    DocumentoEstadoView,
    DocumentoArchivoView,
)

urlpatterns = [
    # Listar + subir
    path('', DocumentoListCreateView.as_view()),

    # Detalle + eliminar
    path('<int:pk>/', DocumentoDetailView.as_view()),

    # Cambiar estado
    path('<int:pk>/estado/', DocumentoEstadoView.as_view()),

    # Vista previa / archivo
    path('<int:pk>/archivo/', DocumentoArchivoView.as_view()),
]

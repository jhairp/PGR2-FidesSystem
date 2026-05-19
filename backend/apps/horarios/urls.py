from rest_framework.routers import DefaultRouter

from .views import (
    HorarioViewSet,
    HorarioIndViewSet
)

router = DefaultRouter()

router.register(
    'horarios',
    HorarioViewSet,
    basename='horarios'
)

router.register(
    'indisponibles',
    HorarioIndViewSet,
    basename='horarios-ind'
)

urlpatterns = router.urls
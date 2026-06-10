from rest_framework.routers import DefaultRouter

from .views import (
    CentroViewSet,
    ParroquiaViewSet,
    ImagenCentroViewSet
)

router = DefaultRouter()

router.register(
    r"centros",
    CentroViewSet,
    basename="centros"
)

router.register(
    r"parroquias",
    ParroquiaViewSet,
    basename="parroquias"
)

router.register(
    r"imagenes-centro",
    ImagenCentroViewSet,
    basename="imagenes-centro"
)

urlpatterns = router.urls
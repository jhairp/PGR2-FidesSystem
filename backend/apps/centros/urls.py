from rest_framework.routers import DefaultRouter

from .views import CentroViewSet, ParroquiaViewSet

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
urlpatterns = router.urls
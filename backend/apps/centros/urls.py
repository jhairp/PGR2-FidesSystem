from rest_framework.routers import DefaultRouter

from .views import CentroViewSet

router = DefaultRouter()

router.register(
    '',
    CentroViewSet,
    basename="centros"
)

urlpatterns = router.urls
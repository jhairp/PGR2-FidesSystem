from rest_framework.routers import DefaultRouter

from .views import PersonaViewSet

router = DefaultRouter()

router.register(
    "",
    PersonaViewSet,
    basename="personas"
)

urlpatterns = router.urls
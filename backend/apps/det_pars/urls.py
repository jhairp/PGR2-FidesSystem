from rest_framework.routers import DefaultRouter

from .views import DetParViewSet

router = DefaultRouter()

router.register(
    '',
    DetParViewSet,
    basename='det-pars'
)

urlpatterns = router.urls
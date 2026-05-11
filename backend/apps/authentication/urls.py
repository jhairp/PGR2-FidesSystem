from django.urls import path

from .views import (
    LoginView,
    GoogleLoginView,
    RegisterView,
    CompleteGoogleDataView,
    MeView,
    UpdateProfileView,
)

urlpatterns = [

    path(
        'login/',
        LoginView.as_view()
    ),

    path(
        'auth/google/',
        GoogleLoginView.as_view()
    ),

    path(
        'register/',
        RegisterView.as_view()
    ),
    path(
        'auth/complete-google-data/',
        CompleteGoogleDataView.as_view()
    ),
    path(
        'auth/me/',
        MeView.as_view()
    ),
    path(
        'auth/profile/update/',
        UpdateProfileView.as_view()
    ),
]
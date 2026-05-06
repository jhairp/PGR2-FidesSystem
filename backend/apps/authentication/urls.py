from django.urls import path

from .views import (
    LoginView,
    GoogleLoginView,
    RegisterView,
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
]
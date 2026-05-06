from django.urls import path

from .views import (
    LoginView,
    GoogleLoginView,
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
]
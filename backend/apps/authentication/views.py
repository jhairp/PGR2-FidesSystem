from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework import status

from .serializers import (
    CustomTokenSerializer
)

from .services import google_login


class LoginView(TokenObtainPairView):

    serializer_class = (
        CustomTokenSerializer
    )


class GoogleLoginView(APIView):

    permission_classes = []

    authentication_classes = []

    def post(self, request):

        token = request.data.get(
            'token'
        )

        if not token:

            return Response(
                {
                    'error': 'Token requerido'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        data = google_login(token)

        return Response(data)
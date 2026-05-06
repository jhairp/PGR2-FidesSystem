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

from rest_framework_simplejwt.tokens import (
    RefreshToken
)

from .serializers import (
    RegisterSerializer
)


class LoginView(TokenObtainPairView):

    serializer_class = (
        CustomTokenSerializer
    )

class RegisterView(APIView):

    permission_classes = []

    authentication_classes = []

    def post(self, request):

        serializer = RegisterSerializer(
                data=request.data
            )

        serializer.is_valid(
            raise_exception=True
        )

        usuario = serializer.save()

        refresh = RefreshToken.for_user(
                usuario
            )

        return Response({

            'refresh':
                str(refresh),

            'access':
                str(refresh.access_token),

        })
    

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
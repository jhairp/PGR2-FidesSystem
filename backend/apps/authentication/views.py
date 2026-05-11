from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

from rest_framework.views import APIView

from rest_framework.response import Response

from rest_framework import status

from .serializers import (
    CustomTokenSerializer
)

from .services import (
    google_login,
    complete_google_data,
)

from rest_framework_simplejwt.tokens import (
    RefreshToken
)

from .serializers import (
    RegisterSerializer
)

from rest_framework.permissions import IsAuthenticated

from .serializers import MeSerializer

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
    
class CompleteGoogleDataView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        carnet_per = request.data.get(
            'carnet_per'
        )

        cel_per = request.data.get(
            'cel_per'
        )

        complete_google_data(
            request.user,
            carnet_per,
            cel_per,
        )

        return Response({
            'message': 'Datos completados'
        })

class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = MeSerializer(
            request.user
        )

        return Response(
            serializer.data
        )
    
class UpdateProfileView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        usuario = request.user

        persona = usuario.id_per_1

        persona.nom_per = request.data.get(
            'nom_per'
        )

        persona.ap_pat_per = request.data.get(
            'ap_pat_per'
        )

        persona.save()

        usuario.foto_usu = request.data.get(
            'foto_usu'
        )

        usuario.save()

        serializer = MeSerializer(
            usuario
        )

        return Response(
            serializer.data
        )
import os
import tempfile

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.detector import detectar_campos
from .services.ocr import reconocer_imagen
from .services.parser import parsear_partida


class DetectarPartidaView(APIView):

    def post(self, request):

        if "imagen" not in request.FILES:

            return Response(
                {
                    "error": "No se recibió imagen"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        imagen = request.FILES["imagen"]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as temp_file:

            for chunk in imagen.chunks():

                temp_file.write(chunk)

            ruta_temporal = temp_file.name

        try:

            print(
                "[OCR] Iniciando detección"
            )

            resultado_detector = detectar_campos(
                ruta_temporal
            )

            print(
                "[OCR] Ejecutando TrOCR"
            )

            texto = reconocer_imagen(
                resultado_detector
            )

            print(
                "[OCR] Texto obtenido:"
            )

            print(texto)

            datos = parsear_partida(
                texto
            )

            print(
                "[OCR] Datos extraídos:"
            )

            print(datos)

            return Response({

                "ok": True,

                "texto_ocr": texto,

                "datos": datos

            })

        except Exception as e:

            print(
                "[OCR] ERROR:"
            )

            print(str(e))

            return Response(
                {
                    "ok": False,
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        finally:

            if os.path.exists(
                ruta_temporal
            ):

                os.remove(
                    ruta_temporal
                )
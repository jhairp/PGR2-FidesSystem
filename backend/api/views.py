from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_capillas(request):
    # Datos "quemados" (estáticos) que simulan una base de datos
    capillas = [
        {
            "id": 1,
            "nombre": "Parroquia Central San Pedro",
            "lat": -16.4994, 
            "lng": -68.1353,
            "direccion": "Plaza Principal #123",
            "horario": "08:00 - 18:00"
        },
        {
            "id": 2,
            "nombre": "Capilla de la Medalla Milagrosa",
            "lat": -16.5100,
            "lng": -68.1200,
            "direccion": "Av. Armentia esq. Lanza",
            "horario": "07:00 - 12:00"
        },
        {
            "id": 3,
            "nombre": "Santuario de Sopocachi",
            "lat": -16.5050,
            "lng": -68.1280,
            "direccion": "Calle 6 de Agosto",
            "horario": "10:00 - 20:00"
        }
    ]
    return Response(capillas)
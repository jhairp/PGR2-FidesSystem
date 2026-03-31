from django.db.models.functions import ExtractMonth
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Asegúrate de importar tu modelo de Bautizo
# from .models import Bautizo 

@api_view(['GET'])
def get_capillas(request):
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
    return Response(capillas) # Agregado el return que faltaba

@api_view(['GET'])
def estadisticas_bautizos(request):
    # Comentamos estas líneas porque aún no tienes el modelo Bautizo creado/importado
    # data = Bautizo.objects.annotate(
    #     month=ExtractMonth('fecha')
    # ).values('month').annotate(
    # total=Count('id')
    # ).order_by('month')
    
    # Datos "quemados" para que React pueda dibujar la gráfica ahora mismo
    meses_nombres = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    
    # Simulamos lo que devolvería la base de datos
    formatted_data = [
        {"mes": "Ene", "total": 12},
        {"mes": "Feb", "total": 19},
        {"mes": "Mar", "total": 3},
        {"mes": "Abr", "total": 5},
        {"mes": "May", "total": 2},
        {"mes": "Jun", "total": 33},
    ]
    
    return Response(formatted_data) 
    # Agrupamos bautizos por mes
    # Corregido: order_by en lugar de order_state
    data = Bautizo.objects.annotate(
        month=ExtractMonth('fecha')
    ).values('month').annotate(
        total=Count('id')
    ).order_by('month')
    
    meses = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    
    formatted_data = [
        {
            "mes": meses[item['month']] if item['month'] else "Sin Mes", 
            "total": item['total']
        } 
        for item in data
    ]
    
    return Response(formatted_data)

@api_view(['GET'])
def estadisticas_parroquia(request):
    formatted_data = [
        {"mes": "Ene", "bautizos": 12, "matrimonios": 5}, # <--- "bautizos" no "total"
        {"mes": "Feb", "bautizos": 19, "matrimonios": 8},
        {"mes": "Mar", "bautizos": 3, "matrimonios": 12},
        {"mes": "Abr", "bautizos": 5, "matrimonios": 15},
        {"mes": "May", "bautizos": 2, "matrimonios": 7},
        {"mes": "Jun", "bautizos": 33, "matrimonios": 30},
    ]
    return Response(formatted_data)
from django.db.models.functions import ExtractMonth
from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.db import transaction # Para transaction.atomic()
from django.contrib.auth.hashers import make_password # Para encriptar contraseñas
from django.utils.crypto import get_random_string # Para generar la clave temporal
from rest_framework import status # Para status.HTTP_201_CREATED

# USUARIOS
from .models import Eventos, Usuarios, Personas, Rols, Centros, Parroquias
from .PerUsu import UsuarioSerializer
from .ParCen import CentrosSerializer, ParroquiasSerializer
from .serializers import EventosSerializer


@api_view(['POST'])
def crear_personal(request):
    data = request.data
    try:
        with transaction.atomic():
            # 1. Creamos la Persona
            nueva_persona = Personas.objects.create(
                nom_per=data.get('nom_per'),
                ap_pat_per=data.get('ap_pat_per'),
                carnet_per=data.get('carnet_per'),
                cel_per=data.get('cel_per'),
                # AQUÍ ESTÁ LA MAGIA: 
                # Aunque el modelo dice 'id_per_rol_1', 
                # Django espera que le pases el ID numérico usando '_id' al final
                id_per_rol_1_id=1 
            )

            password_temporal = get_random_string(10)

            # 2. Creamos el Usuario
            nuevo_usuario = Usuarios.objects.create(
                correo_usu=data.get('correo_usu'),
                password=make_password(password_temporal),
                estado_usu='activo',
                id_per_1=nueva_persona, 
                id_rol_1_id=data.get('id_rol_1') 
            )

            serializer = UsuarioSerializer(nuevo_usuario)
            return Response({
                "message": "Creado con éxito",
                "clave_temporal": password_temporal,
                "user": serializer.data
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def get_usuarios(request):
    # Usamos select_related para traer la persona y el rol en una sola consulta (optimización)
    usuarios = Usuarios.objects.select_related('id_per_1', 'id_rol_1').all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)


# En api/views.py
@api_view(['POST'])
def crear_personal(request):
    data = request.data
    password_usuario = data.get('password') # Obtenemos la pass del form
    
    try:
        with transaction.atomic():
            nueva_persona = Personas.objects.create(
                nom_per=data.get('nom_per'),
                ap_pat_per=data.get('ap_pat_per'),
                carnet_per=data.get('carnet_per'),
                cel_per=data.get('cel_per'),
                id_per_rol_1_id=1
            )

            # Usamos la contraseña enviada desde React
            nuevo_usuario = Usuarios.objects.create(
                correo_usu=data.get('correo_usu'),
                password=make_password(password_usuario), 
                estado_usu='activo',
                id_per_1=nueva_persona,
                id_rol_1_id=data.get('id_rol_1')
            )

            return Response({"message": "Usuario creado"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def editar_usuario(request, pk):
    try:
        usuario = Usuarios.objects.get(pk=pk)
        persona = usuario.id_per_1
        data = request.data

        with transaction.atomic():
            # Actualizamos datos de la Persona
            persona.nom_per = data.get('nom_per', persona.nom_per)
            persona.ap_pat_per = data.get('ap_pat_per', persona.ap_pat_per)
            persona.carnet_per = data.get('carnet_per', persona.carnet_per)
            persona.cel_per = data.get('cel_per', persona.cel_per)
            persona.save()

            # Actualizamos datos del Usuario
            usuario.correo_usu = data.get('correo_usu', usuario.correo_usu)
            usuario.id_rol_1_id = data.get('id_rol_1', usuario.id_rol_1_id)
            usuario.save()

        return Response({"message": "Usuario actualizado con éxito"})
    except Usuarios.DoesNotExist:
        return Response({"error": "No existe"}, status=404)
    try:
        usuario = Usuarios.objects.get(pk=pk)
        persona = usuario.id_per_1
        data = request.data

        with transaction.atomic():
            # Actualizamos Persona
            persona.nom_per = data.get('nom_per', persona.nom_per)
            persona.ap_pat_per = data.get('ap_pat_per', persona.ap_pat_per)
            persona.carnet_per = data.get('carnet_per', persona.carnet_per)
            persona.cel_per = data.get('cel_per', persona.cel_per)
            persona.save()

            # Actualizamos Usuario
            usuario.correo_usu = data.get('correo_usu', usuario.correo_usu)
            if data.get('id_rol_1'):
                usuario.id_rol_1_id = data.get('id_rol_1')
            usuario.save()

        return Response({"message": "Actualizado correctamente"})
    except Usuarios.DoesNotExist:
        return Response({"error": "No encontrado"}, status=404)

@api_view(['GET'])
def get_usuario_detalle(request, pk):
    try:
        # Buscamos el usuario por su ID (pk)
        usuario = Usuarios.objects.select_related('id_per_1', 'id_rol_1').get(pk=pk)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)
    except Usuarios.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['GET'])
def get_centros_db(request):
    # Obtenemos todos los centros reales de la base de datos
    centros_queryset = Centros.objects.all()
    
    # El serializer se encarga de convertir los objetos de la DB a JSON
    serializer = CentrosSerializer(centros_queryset, many=True)
    
    # Devolvemos la data procesada
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
def detalle_centro_db(request, pk):
    try:
        centro = Centros.objects.get(pk=pk)
    except Centros.DoesNotExist:
        return Response({'error': 'Centro no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CentrosSerializer(centro)
        return Response(serializer.data)

    elif request.method == 'PUT':
        # Cambiamos partial=True por si no mandas todos los campos
        serializer = CentrosSerializer(centro, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        centro.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# También asegúrate de que el POST esté en tu vista de lista (la que ya tenías)
@api_view(['GET', 'POST'])
def get_centros_db(request):
    if request.method == 'GET':
        centros = Centros.objects.all()
        serializer = CentrosSerializer(centros, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CentrosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def get_parroquias_db(request):
    try:
        parroquias = Parroquias.objects.all()
        serializer = ParroquiasSerializer(parroquias, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)





@api_view(['GET', 'POST'])
def gestion_eventos(request):
    if request.method == 'GET':
        eventos = Eventos.objects.all()
        serializer = EventosSerializer(eventos, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = EventosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def gestion_eventos_detalle(request, pk):
    try:
        evento = Eventos.objects.get(pk=pk)
    except Eventos.DoesNotExist:
        return Response({'error': 'Evento no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EventosSerializer(evento)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = EventosSerializer(evento, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        evento.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)







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

@api_view(['GET'])
def get_lista_bautizos(request):
    # Datos de ejemplo que recibirá la tabla
    bautizos = [
        {"id": 1, "nombre": "Juan Pérez", "padres": "Pedro y María", "fecha": "2024-03-15", "parroquia": "San Pedro"},
        {"id": 2, "nombre": "Lucía Gómez", "padres": "Carlos y Ana", "fecha": "2024-03-20", "parroquia": "Sopocachi"},
        {"id": 3, "nombre": "Mateo Mamani", "padres": "Luis y Elena", "fecha": "2024-04-01", "parroquia": "Medalla Milagrosa"},
    ]
    return Response(bautizos)
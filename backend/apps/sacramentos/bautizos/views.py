from datetime import date
from html import escape

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import BautizoCreateSerializer, BautizoEstadoSerializer
from .services import cambiar_estado_bautizo, crear_bautizo, editar_bautizo, listar_bautizos, obtener_bautizo

from apps.models import DetUsus, Libros, Sacramentos, Usuarios


MESES = [
    '',
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
]


def fecha_literal(value):
    if not value:
        return '----------'

    return f"{value.day} de {MESES[value.month]} de {value.year}"


def texto(value):
    value = '' if value is None else str(value)
    value = value.strip()
    return escape(value.upper() if value else '----------')


def nombre_lai(laico):
    return ' '.join(
        filter(
            None,
            [
                laico.nom_lai,
                laico.ap_pat_lai,
                laico.ap_mat_lai,
            ]
        )
    )


def nombre_persona(persona):
    if not persona:
        return '----------'

    return ' '.join(
        filter(
            None,
            [
                persona.nom_per,
                persona.ap_pat_per,
            ]
        )
    )


class BautizoCreateView(APIView):

    permission_classes = []

    def post(self, request):

        serializer = BautizoCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        usuario = Usuarios.objects.first()

        bautizo = crear_bautizo(
            serializer.validated_data,
            usuario
        )

        return Response(
            {
                "message": "Bautizo registrado correctamente",
                "id_sac": bautizo.id_sac
            },
            status=status.HTTP_201_CREATED
        )
    
class BautizoEstadoView(APIView):

    permission_classes = []

    def patch(self, request, id_sac):

        serializer = BautizoEstadoSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        bautizo = cambiar_estado_bautizo(
            id_sac,
            serializer.validated_data["estado_sac"]
        )

        return Response(
            {
                "message": "Estado actualizado correctamente",
                "estado": bautizo.estado_sac
            },
            status=status.HTTP_200_OK
        )
    
class BautizoUpdateView(APIView):

    permission_classes = []

    def put(self, request, id_sac):

        serializer = BautizoCreateSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        bautizo = editar_bautizo(
            id_sac,
            serializer.validated_data
        )

        return Response(
            {
                "message": "Bautizo actualizado correctamente",
                "id_sac": bautizo.id_sac
            },
            status=status.HTTP_200_OK
        )
    
class BautizoListView(APIView):

    permission_classes = []

    def get(self, request):

        bautizos = listar_bautizos()

        return Response(
            bautizos,
            status=status.HTTP_200_OK
        )


class BautizoCertificadoView(APIView):

    permission_classes = []

    def get(self, request, id_sac):

        bautizo = get_object_or_404(
            Sacramentos.objects.select_related(
                'id_lai_1',
                'id_cen_2',
                'id_cen_2__id_par_1',
            ),
            id_sac=id_sac,
            tipo_sac='BAUTIZO'
        )

        laico = bautizo.id_lai_1
        centro = bautizo.id_cen_2
        parroquia = getattr(centro, 'id_par_1', None)

        libro = Libros.objects.filter(
            id_sac_3=bautizo
        ).first()

        sacerdotes = list(
            DetUsus.objects.filter(
                id_sac_2=bautizo
            ).select_related(
                'id_per_2'
            ).order_by(
                'id_det_usu'
            )
        )

        celebrante = sacerdotes[0].id_per_2 if len(sacerdotes) > 0 else None
        certificador = sacerdotes[1].id_per_2 if len(sacerdotes) > 1 else celebrante

        padre = ' '.join(
            filter(
                None,
                [
                    laico.nom_p_lai,
                    laico.ap_pat_p_lai,
                    laico.ap_mat_p_lai,
                ]
            )
        )

        madre = ' '.join(
            filter(
                None,
                [
                    laico.nom_m_lai,
                    laico.ap_pat_m_lai,
                    laico.ap_mat_m_lai,
                ]
            )
        )

        html = f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado de Bautizo</title>
    <style>
        @page {{
            size: letter portrait;
            margin: 18mm;
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            font-family: Georgia, "Times New Roman", serif;
            font-size: 13.5px;
            color: #111;
            margin: 0;
            background: #e5e7eb;
        }}

        .print-button {{
            position: fixed;
            top: 18px;
            right: 18px;
            z-index: 10;
            border: 0;
            border-radius: 8px;
            background: #1d4ed8;
            color: white;
            padding: 10px 16px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.22);
        }}

        .sheet {{
            width: 176mm;
            min-height: 240mm;
            margin: 18px auto;
            padding: 14mm 15mm 12mm;
            background: #fff;
            border: 1px solid #111;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
            position: relative;
        }}

        .sheet::before {{
            content: "";
            position: absolute;
            inset: 6mm;
            border: 2px solid #111;
            pointer-events: none;
        }}

        .sheet::after {{
            content: "";
            position: absolute;
            inset: 10mm;
            border: 1px solid #444;
            pointer-events: none;
        }}

        .content {{
            position: relative;
            z-index: 1;
        }}

        .top {{
            display: grid;
            grid-template-columns: 1fr 86px 1fr;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }}

        .seal {{
            width: 78px;
            height: 78px;
            border: 2px solid #111;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 11px;
            font-weight: 700;
            line-height: 1.1;
            margin: 0 auto;
        }}

        .top-line {{
            border-top: 1px solid #111;
        }}

        h1 {{
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin: 0 0 24px;
            text-transform: uppercase;
        }}

        p {{
            line-height: 1.42;
            margin: 10px 0;
        }}

        .bold {{
            font-weight: bold;
        }}

        .center {{
            text-align: center;
        }}

        .right {{
            text-align: right;
        }}

        .section {{
            margin: 15px 0;
        }}

        .row {{
            display: flex;
            gap: 12px;
            align-items: baseline;
            margin: 10px 0;
        }}

        .label {{
            font-weight: bold;
            white-space: nowrap;
        }}

        .value {{
            flex: 1;
            border-bottom: 1px dotted #555;
            min-height: 18px;
            padding-left: 4px;
            font-weight: bold;
        }}

        .book-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 14px;
            margin: 8px 0 14px;
        }}

        .underline {{
            border-bottom: 1px solid #000;
            width: 86%;
            margin: 1px auto 0;
        }}

        .subtitle {{
            font-size: 11px;
            margin-top: 0;
        }}

        .name {{
            font-size: 17px;
            letter-spacing: 0.5px;
            margin-top: 24px;
            margin-bottom: 0;
        }}

        .civil-grid {{
            display: grid;
            grid-template-columns: 1.4fr 1fr 1fr;
            gap: 12px;
        }}

        .footer-small {{
            font-size: 9.5px;
            text-align: justify;
            line-height: 1.25;
            margin-top: 18px;
        }}

        .signature {{
            width: 58%;
            margin: 42px auto 0;
            text-align: center;
        }}

        .signature-line {{
            border-top: 1px solid #111;
            padding-top: 6px;
            font-size: 12px;
            font-weight: bold;
        }}

        .print-note {{
            position: fixed;
            left: 18px;
            bottom: 18px;
            background: white;
            color: #334155;
            border-radius: 8px;
            padding: 9px 12px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.16);
            font-family: Arial, sans-serif;
            font-size: 12px;
        }}

        @media print {{
            html,
            body {{
                width: 100%;
                background: white;
            }}

            body {{
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }}

            .print-button {{
                display: none;
            }}

            .print-note {{
                display: none;
            }}

            .sheet {{
                width: auto;
                min-height: auto;
                margin: 0;
                padding: 0;
                border: 0;
                box-shadow: none;
            }}

            .sheet::before {{
                inset: -8mm;
            }}

            .sheet::after {{
                inset: -4mm;
            }}
        }}
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Imprimir</button>
    <div class="print-note">Al abrirse el cuadro de impresion, puedes imprimir o guardar como PDF.</div>

    <div class="sheet">
        <div class="content">
            <div class="top">
                <div class="top-line"></div>
                <div class="seal">PARROQUIA<br>CATOLICA</div>
                <div class="top-line"></div>
            </div>

            <h1>CERTIFICADO OFICIAL DE BAUTISMO</h1>

            <p class="bold">
                IGLESIA PARROQUIAL DE:&nbsp;&nbsp;
                {texto(getattr(parroquia, 'nom_par', '') or getattr(centro, 'nom_cen', ''))}
            </p>

            <p>
                <span class="bold">El Suscrito Presbitero:</span>&nbsp;
                {texto(nombre_persona(certificador))}
            </p>

            <p class="section bold">CERTIFICA:</p>

            <p class="bold">
                Que en el libro de Bautismo de este archivo parroquial se halla inscrita
                la partida bautismal con los siguientes datos:
            </p>

            <div class="book-grid">
                <div class="row">
                    <span class="label">Libro:</span>
                    <span class="value">{texto(libro.num_lib if libro else '')}</span>
                </div>
                <div class="row">
                    <span class="label">Pagina:</span>
                    <span class="value">{texto(libro.pag_lib if libro else '')}</span>
                </div>
                <div class="row">
                    <span class="label">Numero:</span>
                    <span class="value">{texto(libro.par_lib if libro else '')}</span>
                </div>
            </div>

            <p class="center bold name">
                {texto(nombre_lai(laico))}
            </p>
            <div class="underline"></div>
            <p class="center subtitle">Apellidos y Nombres</p>

            <div class="row">
                <span class="label">Fecha de bautismo:</span>
                <span class="value">{texto(fecha_literal(bautizo.fecha_sac))}</span>
            </div>
            <div class="row">
                <span class="label">Lugar de nacimiento:</span>
                <span class="value">{texto(laico.lugar_nac_lai)}</span>
            </div>
            <div class="row">
                <span class="label">Fecha de nacimiento:</span>
                <span class="value">{texto(fecha_literal(laico.fecha_nac_lai))}</span>
            </div>
            <div class="row">
                <span class="label">Padre:</span>
                <span class="value">{texto(padre)}</span>
            </div>
            <div class="row">
                <span class="label">Madre:</span>
                <span class="value">{texto(madre)}</span>
            </div>
            <div class="row">
                <span class="label">Padrino:</span>
                <span class="value">{texto(bautizo.nom_pad_1_sac)}</span>
            </div>
            <div class="row">
                <span class="label">Madrina:</span>
                <span class="value">{texto(bautizo.nom_pad_2_sac)}</span>
            </div>

            <div class="civil-grid">
                <div class="row">
                    <span class="label">Registro civil:</span>
                    <span class="value">{texto(laico.regis_civ_lai)}</span>
                </div>
                <div class="row">
                    <span class="label">Libro:</span>
                    <span class="value">{texto(laico.lib_civ_lai)}</span>
                </div>
                <div class="row">
                    <span class="label">Partida:</span>
                    <span class="value">{texto(laico.part_civ_lai)}</span>
                </div>
            </div>

            <p class="section">
                <span class="bold">Certifica:</span>
                {texto(nombre_persona(celebrante))}
            </p>

            <div class="footer-small">
                Los datos que anteceden son copia fiel y autentica del original de referencia.
                El presente Certificado Oficial De La Iglesia Catolica solo certifica que la persona
                citada es su feligres (C.877). Los datos del lugar, fecha de nacimiento y filiacion,
                conforme a la Ley Boliviana desde el ano de 1940 corresponde a la citada Oficial
                del Registro Civil (codigo Civil Art. 1526).
            </div>

            <p class="right bold">La Paz, {fecha_literal(date.today())}</p>

            <div class="signature">
                <div class="signature-line">
                    Firma y sello del parroco
                </div>
            </div>
        </div>
    </div>
    <script>
        window.addEventListener('load', function () {{
            setTimeout(function () {{
                window.print();
            }}, 500);
        }});
    </script>
</body>
</html>
"""

        response = HttpResponse(
            html,
            content_type='text/html; charset=utf-8'
        )
        response['Content-Disposition'] = (
            f'inline; filename="certificado-bautizo-{id_sac}.html"'
        )
        return response
    

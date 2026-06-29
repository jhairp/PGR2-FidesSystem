import json
import os
import uuid
from copy import deepcopy
from datetime import date
from html import escape

from django.conf import settings

from apps.models import DetUsus, Libros


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

TEMPLATE_DIR = os.path.join(settings.MEDIA_ROOT, 'certificados', 'templates')
ASSET_DIR = os.path.join(settings.MEDIA_ROOT, 'certificados', 'assets')
TEMPLATE_PATH = os.path.join(TEMPLATE_DIR, 'bautizo.json')

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp'}

DEFAULT_TEMPLATE = {
    'page': {
        'width': 816,
        'height': 1056,
        'backgroundColor': '#ffffff',
        'borderColor': '#111111',
        'fontFamily': 'Georgia, Times New Roman, serif',
    },
    'elements': [
        {
            'id': 'seal',
            'type': 'text',
            'content': 'PARROQUIA\nCATOLICA',
            'x': 356,
            'y': 42,
            'width': 104,
            'height': 72,
            'fontSize': 12,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'center',
            'borderColor': '#111111',
            'borderWidth': 2,
            'borderRadius': 50,
            'backgroundColor': '#ffffff',
        },
        {
            'id': 'title',
            'type': 'text',
            'content': 'CERTIFICADO OFICIAL DE BAUTISMO',
            'x': 92,
            'y': 142,
            'width': 632,
            'height': 42,
            'fontSize': 24,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'center',
        },
        {
            'id': 'parroquia',
            'type': 'field',
            'field': 'parroquia',
            'label': 'IGLESIA PARROQUIAL DE:',
            'x': 72,
            'y': 210,
            'width': 672,
            'height': 28,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'certificador',
            'type': 'field',
            'field': 'certificador',
            'label': 'El Suscrito Presbitero:',
            'x': 72,
            'y': 248,
            'width': 672,
            'height': 28,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '400',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'certifica',
            'type': 'text',
            'content': 'CERTIFICA:',
            'x': 72,
            'y': 302,
            'width': 160,
            'height': 28,
            'fontSize': 15,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'intro',
            'type': 'text',
            'content': 'Que en el libro de Bautismo de este archivo parroquial se halla inscrita la partida bautismal con los siguientes datos:',
            'x': 72,
            'y': 340,
            'width': 672,
            'height': 48,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'libro',
            'type': 'field',
            'field': 'libro',
            'label': 'Libro:',
            'x': 72,
            'y': 404,
            'width': 188,
            'height': 28,
            'fontSize': 13,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'pagina',
            'type': 'field',
            'field': 'pagina',
            'label': 'Pagina:',
            'x': 306,
            'y': 404,
            'width': 188,
            'height': 28,
            'fontSize': 13,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'partida',
            'type': 'field',
            'field': 'partida',
            'label': 'Numero:',
            'x': 540,
            'y': 404,
            'width': 188,
            'height': 28,
            'fontSize': 13,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'bautizado',
            'type': 'field',
            'field': 'bautizado',
            'label': '',
            'x': 104,
            'y': 472,
            'width': 608,
            'height': 36,
            'fontSize': 18,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'center',
            'underline': True,
        },
        {
            'id': 'subtitulo_nombre',
            'type': 'text',
            'content': 'Apellidos y Nombres',
            'x': 104,
            'y': 510,
            'width': 608,
            'height': 22,
            'fontSize': 11,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '400',
            'color': '#111111',
            'textAlign': 'center',
        },
        {
            'id': 'fecha_bautismo',
            'type': 'field',
            'field': 'fecha_bautismo',
            'label': 'Fecha de bautismo:',
            'x': 72,
            'y': 552,
            'width': 672,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'lugar_nacimiento',
            'type': 'field',
            'field': 'lugar_nacimiento',
            'label': 'Lugar de nacimiento:',
            'x': 72,
            'y': 590,
            'width': 672,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'fecha_nacimiento',
            'type': 'field',
            'field': 'fecha_nacimiento',
            'label': 'Fecha de nacimiento:',
            'x': 72,
            'y': 628,
            'width': 672,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'padre',
            'type': 'field',
            'field': 'padre',
            'label': 'Padre:',
            'x': 72,
            'y': 666,
            'width': 672,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'madre',
            'type': 'field',
            'field': 'madre',
            'label': 'Madre:',
            'x': 72,
            'y': 704,
            'width': 672,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'padrino',
            'type': 'field',
            'field': 'padrino',
            'label': 'Padrino:',
            'x': 72,
            'y': 742,
            'width': 312,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'madrina',
            'type': 'field',
            'field': 'madrina',
            'label': 'Madrina:',
            'x': 414,
            'y': 742,
            'width': 330,
            'height': 27,
            'fontSize': 14,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'registro_civil',
            'type': 'field',
            'field': 'registro_civil',
            'label': 'Registro civil:',
            'x': 72,
            'y': 790,
            'width': 260,
            'height': 27,
            'fontSize': 12,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'libro_civil',
            'type': 'field',
            'field': 'libro_civil',
            'label': 'Libro:',
            'x': 354,
            'y': 790,
            'width': 160,
            'height': 27,
            'fontSize': 12,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'partida_civil',
            'type': 'field',
            'field': 'partida_civil',
            'label': 'Partida:',
            'x': 540,
            'y': 790,
            'width': 188,
            'height': 27,
            'fontSize': 12,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'left',
        },
        {
            'id': 'nota',
            'type': 'text',
            'content': 'Los datos que anteceden son copia fiel y autentica del original de referencia. El presente Certificado Oficial De La Iglesia Catolica solo certifica que la persona citada es su feligres (C.877).',
            'x': 72,
            'y': 840,
            'width': 672,
            'height': 60,
            'fontSize': 10,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '400',
            'color': '#111111',
            'textAlign': 'justify',
        },
        {
            'id': 'fecha_emision',
            'type': 'field',
            'field': 'fecha_emision',
            'label': 'La Paz,',
            'x': 476,
            'y': 916,
            'width': 268,
            'height': 27,
            'fontSize': 13,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'right',
        },
        {
            'id': 'firma',
            'type': 'text',
            'content': 'Firma y sello del parroco',
            'x': 250,
            'y': 970,
            'width': 316,
            'height': 34,
            'fontSize': 12,
            'fontFamily': 'Georgia, Times New Roman, serif',
            'fontWeight': '700',
            'color': '#111111',
            'textAlign': 'center',
            'borderTop': True,
        },
    ],
}

FIELD_OPTIONS = [
    {'value': 'parroquia', 'label': 'Parroquia'},
    {'value': 'centro', 'label': 'Centro'},
    {'value': 'certificador', 'label': 'Sacerdote certificador'},
    {'value': 'celebrante', 'label': 'Sacerdote celebrante'},
    {'value': 'libro', 'label': 'Libro sacramental'},
    {'value': 'pagina', 'label': 'Pagina'},
    {'value': 'partida', 'label': 'Numero de partida'},
    {'value': 'bautizado', 'label': 'Bautizado'},
    {'value': 'fecha_bautismo', 'label': 'Fecha de bautismo'},
    {'value': 'lugar_nacimiento', 'label': 'Lugar de nacimiento'},
    {'value': 'fecha_nacimiento', 'label': 'Fecha de nacimiento'},
    {'value': 'padre', 'label': 'Padre'},
    {'value': 'madre', 'label': 'Madre'},
    {'value': 'padrino', 'label': 'Padrino'},
    {'value': 'madrina', 'label': 'Madrina'},
    {'value': 'registro_civil', 'label': 'Registro civil'},
    {'value': 'libro_civil', 'label': 'Libro civil'},
    {'value': 'partida_civil', 'label': 'Partida civil'},
    {'value': 'fecha_emision', 'label': 'Fecha de emision'},
]


def ensure_dirs():
    os.makedirs(TEMPLATE_DIR, exist_ok=True)
    os.makedirs(ASSET_DIR, exist_ok=True)


def fecha_literal(value):
    if not value:
        return '----------'

    return f"{value.day} de {MESES[value.month]} de {value.year}"


def upper_or_dash(value):
    value = '' if value is None else str(value)
    value = value.strip()
    return value.upper() if value else '----------'


def join_names(*values):
    return ' '.join(str(value).strip() for value in values if value)


def nombre_lai(laico):
    return join_names(laico.nom_lai, laico.ap_pat_lai, laico.ap_mat_lai)


def nombre_persona(persona):
    if not persona:
        return '----------'

    return join_names(persona.nom_per, persona.ap_pat_per)


def load_template():
    ensure_dirs()

    if not os.path.exists(TEMPLATE_PATH):
        return deepcopy(DEFAULT_TEMPLATE)

    with open(TEMPLATE_PATH, 'r', encoding='utf-8') as file:
        saved = json.load(file)

    if 'page' not in saved or 'elements' not in saved:
        return deepcopy(DEFAULT_TEMPLATE)

    return saved


def save_template(template):
    ensure_dirs()

    page = template.get('page', {})
    elements = template.get('elements', [])

    data = {
        'page': {
            'width': int(page.get('width') or 816),
            'height': int(page.get('height') or 1056),
            'backgroundColor': page.get('backgroundColor') or '#ffffff',
            'borderColor': page.get('borderColor') or '#111111',
            'fontFamily': page.get('fontFamily') or 'Georgia, Times New Roman, serif',
        },
        'elements': elements if isinstance(elements, list) else [],
    }

    with open(TEMPLATE_PATH, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

    return data


def save_asset(file_obj):
    ensure_dirs()

    _, ext = os.path.splitext(file_obj.name)
    ext = ext.lower()

    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError('Formato de imagen no permitido')

    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(ASSET_DIR, filename)

    with open(file_path, 'wb+') as destination:
        for chunk in file_obj.chunks():
            destination.write(chunk)

    return f"{settings.MEDIA_URL}certificados/assets/{filename}"


def build_context(bautizo):
    laico = bautizo.id_lai_1
    centro = bautizo.id_cen_2
    parroquia = getattr(centro, 'id_par_1', None)

    libro = Libros.objects.filter(id_sac_3=bautizo).first()
    sacerdotes = list(
        DetUsus.objects.filter(id_sac_2=bautizo)
        .select_related('id_per_2')
        .order_by('id_det_usu')
    )

    celebrante = sacerdotes[0].id_per_2 if len(sacerdotes) > 0 else None
    certificador = sacerdotes[1].id_per_2 if len(sacerdotes) > 1 else celebrante

    padre = join_names(laico.nom_p_lai, laico.ap_pat_p_lai, laico.ap_mat_p_lai)
    madre = join_names(laico.nom_m_lai, laico.ap_pat_m_lai, laico.ap_mat_m_lai)

    return {
        'parroquia': upper_or_dash(getattr(parroquia, 'nom_par', '') or getattr(centro, 'nom_cen', '')),
        'centro': upper_or_dash(getattr(centro, 'nom_cen', '')),
        'certificador': upper_or_dash(nombre_persona(certificador)),
        'celebrante': upper_or_dash(nombre_persona(celebrante)),
        'libro': upper_or_dash(libro.num_lib if libro else ''),
        'pagina': upper_or_dash(libro.pag_lib if libro else ''),
        'partida': upper_or_dash(libro.par_lib if libro else ''),
        'bautizado': upper_or_dash(nombre_lai(laico)),
        'fecha_bautismo': upper_or_dash(fecha_literal(bautizo.fecha_sac)),
        'lugar_nacimiento': upper_or_dash(laico.lugar_nac_lai),
        'fecha_nacimiento': upper_or_dash(fecha_literal(laico.fecha_nac_lai)),
        'padre': upper_or_dash(padre),
        'madre': upper_or_dash(madre),
        'padrino': upper_or_dash(bautizo.nom_pad_1_sac),
        'madrina': upper_or_dash(bautizo.nom_pad_2_sac),
        'registro_civil': upper_or_dash(laico.regis_civ_lai),
        'libro_civil': upper_or_dash(laico.lib_civ_lai),
        'partida_civil': upper_or_dash(laico.part_civ_lai),
        'fecha_emision': fecha_literal(date.today()).upper(),
    }


def css_value(value, fallback):
    return escape(str(value or fallback), quote=True)


def render_element(element, context, request=None):
    element_type = element.get('type')
    content = ''

    if element_type == 'field':
        label = element.get('label') or ''
        value = context.get(element.get('field'), '----------')
        content = f"{escape(label)} {escape(str(value))}".strip()
    elif element_type == 'image':
        raw_src = element.get('src') or ''
        if request and raw_src.startswith('/'):
            raw_src = request.build_absolute_uri(raw_src)

        src = escape(raw_src, quote=True)
        if not src:
            return ''

        return f"""
        <div class="cert-element" style="{render_style(element, is_image=True)}">
            <img
                src="{src}"
                alt=""
                style="width: 100%; height: 100%; object-fit: {css_value(element.get('objectFit'), 'contain')}; display: block;"
            />
        </div>
        """
    else:
        content = escape(element.get('content') or '').replace('\n', '<br>')

    return f"""
    <div class="cert-element" style="{render_style(element)}">
        {content}
    </div>
    """


def render_style(element, is_image=False):
    border_width = int(element.get('borderWidth') or 0)
    has_fixed_box = is_image or border_width > 0 or int(element.get('borderRadius') or 0) > 0
    styles = [
        f"left: {int(element.get('x') or 0)}px",
        f"top: {int(element.get('y') or 0)}px",
        f"width: {int(element.get('width') or 120)}px",
        f"font-size: {int(element.get('fontSize') or 14)}px",
        f"font-family: {css_value(element.get('fontFamily'), 'Georgia, Times New Roman, serif')}",
        f"font-weight: {css_value(element.get('fontWeight'), '400')}",
        f"color: {css_value(element.get('color'), '#111111')}",
        f"text-align: {css_value(element.get('textAlign'), 'left')}",
        f"background: {css_value(element.get('backgroundColor'), 'transparent')}",
        f"border-radius: {int(element.get('borderRadius') or 0)}px",
        'position: absolute',
        'white-space: pre-wrap',
        'line-height: 1.25',
        'padding: 2px',
    ]

    if is_image:
        styles.append(f"height: {int(element.get('height') or 32)}px")
        styles.append('overflow: hidden')
        styles.append('display: block')
    elif has_fixed_box:
        styles.append(f"height: {int(element.get('height') or 32)}px")
        styles.append('overflow: visible')
        styles.append('display: flex')
        styles.append('align-items: center')
        justify = {
            'center': 'center',
            'right': 'flex-end',
        }.get(element.get('textAlign'), 'flex-start')
        styles.append(f"justify-content: {justify}")
    else:
        styles.append(f"min-height: {int(element.get('height') or 32)}px")
        styles.append('height: auto')
        styles.append('overflow: visible')
        styles.append('word-break: normal')
    if border_width > 0:
        styles.extend([
            f"border-color: {css_value(element.get('borderColor'), '#111111')}",
            f"border-width: {border_width}px",
            'border-style: solid',
        ])
    else:
        styles.append('border: 0')

    if element.get('underline'):
        styles.append('box-shadow: inset 0 -1px 0 currentColor')

    if element.get('borderTop'):
        styles.append('box-shadow: inset 0 1px 0 currentColor')
        styles.append('padding-top: 8px')

    return '; '.join(styles)


def render_certificate_html(template, context, auto_print=True, request=None):
    page = template.get('page', {})
    width = int(page.get('width') or 816)
    height = int(page.get('height') or 1056)
    background = css_value(page.get('backgroundColor'), '#ffffff')
    border = css_value(page.get('borderColor'), '#111111')
    elements_html = '\n'.join(
        render_element(element, context, request=request)
        for element in template.get('elements', [])
    )
    auto_print_script = ''

    if auto_print:
        auto_print_script = """
        <script>
            window.addEventListener('load', function () {
                setTimeout(function () {
                    window.print();
                }, 500);
            });
        </script>
        """

    return f"""
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado de Bautizo</title>
    <style>
        @page {{
            size: letter portrait;
            margin: 0;
        }}

        * {{
            box-sizing: border-box;
        }}

        body {{
            margin: 0;
            background: #e5e7eb;
            font-family: Arial, sans-serif;
        }}

        .print-button {{
            position: fixed;
            top: 18px;
            right: 18px;
            z-index: 20;
            border: 0;
            border-radius: 8px;
            background: #1d4ed8;
            color: #fff;
            padding: 10px 16px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.22);
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
            font-size: 12px;
        }}

        .sheet {{
            width: {width}px;
            height: {height}px;
            margin: 18px auto;
            background: {background};
            border: 2px solid {border};
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
            position: relative;
            overflow: hidden;
        }}

        .sheet::before {{
            content: "";
            position: absolute;
            inset: 24px;
            border: 1px solid {border};
            pointer-events: none;
        }}

        .cert-element {{
            z-index: 1;
        }}

        @media print {{
            body {{
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }}

            .print-button,
            .print-note {{
                display: none;
            }}

            .sheet {{
                margin: 0;
                width: 8.5in;
                height: 11in;
                border: 0;
                box-shadow: none;
            }}
        }}
    </style>
</head>
<body>
    <button class="print-button" onclick="window.print()">Imprimir</button>
    <div class="print-note">Puedes imprimir o guardar como PDF.</div>
    <main class="sheet">
        {elements_html}
    </main>
    {auto_print_script}
</body>
</html>
"""

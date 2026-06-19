import os
import uuid
from django.conf import settings
from apps.models import Documentos, Sacramentos


UPLOAD_DIR = os.path.join(settings.BASE_DIR, 'media', 'documentos')


def _save_file(archivo) -> str:
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext           = os.path.splitext(archivo.name)[1].lower()
    nombre_unico  = f"{uuid.uuid4().hex}{ext}"
    ruta_absoluta = os.path.join(UPLOAD_DIR, nombre_unico)
    with open(ruta_absoluta, 'wb+') as destino:
        for chunk in archivo.chunks():
            destino.write(chunk)
    return f"/media/documentos/{nombre_unico}"


def _delete_file(url_doc: str):
    """Elimina el archivo físico si existe."""
    if not url_doc:
        return
    ruta = os.path.join(settings.BASE_DIR, url_doc.lstrip('/'))
    if os.path.exists(ruta):
        os.remove(ruta)


def listar_documentos(id_sac=None):
    qs = Documentos.objects.select_related('id_sac_5').order_by('-created_at')
    if id_sac:
        qs = qs.filter(id_sac_5=id_sac)
    return qs


def crear_documento(validated_data: dict, usuario) -> Documentos:
    archivo  = validated_data['archivo']
    url      = _save_file(archivo)

    sac_id   = validated_data.get('id_sac_5')
    sac_obj  = Sacramentos.objects.get(pk=sac_id) if sac_id else None
    codigo   = f"DOC-{uuid.uuid4().hex[:8].upper()}"

    return Documentos.objects.create(
        url_doc         = url,
        nom_doc         = validated_data['nom_doc'],
        tipo_doc        = validated_data['tipo_doc'],
        desc_doc        = validated_data.get('desc_doc', ''),
        estado_doc      = 'pendiente',
        codigo_doc      = codigo,
        id_sac_5        = sac_obj,
        id_usu_5        = usuario,
    )


def actualizar_documento(id_doc: int, validated_data: dict) -> Documentos:
    doc = Documentos.objects.get(pk=id_doc)

    # Si viene un archivo nuevo, reemplaza el anterior
    if 'archivo' in validated_data and validated_data['archivo']:
        _delete_file(doc.url_doc)
        doc.url_doc = _save_file(validated_data['archivo'])

    if 'nom_doc'  in validated_data: doc.nom_doc  = validated_data['nom_doc']
    if 'tipo_doc' in validated_data: doc.tipo_doc = validated_data['tipo_doc']
    if 'desc_doc' in validated_data: doc.desc_doc = validated_data['desc_doc']

    if 'id_sac_5' in validated_data:
        sac_id = validated_data['id_sac_5']
        doc.id_sac_5 = Sacramentos.objects.get(pk=sac_id) if sac_id else None

    doc.save()
    return doc


def obtener_documento(id_doc: int) -> Documentos:
    return Documentos.objects.select_related('id_sac_5').get(pk=id_doc)


def cambiar_estado_documento(id_doc: int, estado: str,
                              observacion: str = '', usuario=None) -> Documentos:
    doc = Documentos.objects.get(pk=id_doc)
    doc.estado_doc      = estado
    doc.observacion_doc = observacion
    if usuario:
        doc.id_usu_6 = usuario
    doc.save(update_fields=['estado_doc', 'observacion_doc', 'id_usu_6', 'updated_at'])
    return doc


def eliminar_documento(id_doc: int) -> None:
    doc = Documentos.objects.get(pk=id_doc)
    _delete_file(doc.url_doc)
    doc.delete()

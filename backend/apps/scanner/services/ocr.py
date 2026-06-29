from transformers import (
    TrOCRProcessor,
    VisionEncoderDecoderModel
)

from PIL import Image

from collections import defaultdict

import cv2
import torch


print("[OCR] Cargando TrOCR...")


DEVICE = (
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)


processor = TrOCRProcessor.from_pretrained(
    "microsoft/trocr-large-handwritten"
)

model = VisionEncoderDecoderModel.from_pretrained(
    "microsoft/trocr-large-handwritten"
)

model.to(DEVICE)

print("[OCR] TrOCR listo")


def reconocer_imagen(resultado_detector):

    img = resultado_detector["img"]

    cajas = resultado_detector["cajas"]

    print(
        f"[OCR] Procesando {len(cajas)} lineas"
    )

    textos = []

    for (
        linea_id,
        x,
        y,
        w,
        h
    ) in cajas:

        recorte = img[
            y:y+h,
            x:x+w
        ]

        try:

            # ---------------------------------
            # PREPROCESADO
            # ---------------------------------

            # Convertir a escala de grises para preprocesado
            gray = cv2.cvtColor(
                recorte,
                cv2.COLOR_BGR2GRAY
            )

            # TrOCR requiere imagen RGB (3 canales)
            # Convertir grayscale -> RGB apilando el canal 3 veces
            rgb = cv2.cvtColor(
                gray,
                cv2.COLOR_GRAY2RGB
            )

            imagen_pil = Image.fromarray(
                rgb
            )

            # ---------------------------------
            # TROCR
            # ---------------------------------

            pixel_values = processor(
                images=imagen_pil,
                return_tensors="pt"
            ).pixel_values.to(DEVICE)

            generated_ids = model.generate(
                pixel_values,
                max_new_tokens=64,
                num_beams=1
            )

            texto = processor.batch_decode(
                generated_ids,
                skip_special_tokens=True
            )[0]

            texto = texto.strip()

            if texto:

                textos.append(
                    (
                        linea_id,
                        x,
                        texto
                    )
                )

        except Exception as e:

            print(
                "[OCR] Error:",
                str(e)
            )

    # =====================================
    # ORDENAR POR LINEA Y POSICION X
    # =====================================

    textos.sort(
        key=lambda t: (
            t[0],  # linea
            t[1]   # x
        )
    )

    # =====================================
    # RECONSTRUIR LINEAS
    # =====================================

    lineas = defaultdict(list)

    for linea_id, x, texto in textos:

        lineas[linea_id].append(
            texto
        )

    texto_final = "\n".join(

        " ".join(
            lineas[k]
        )

        for k in sorted(
            lineas.keys()
        )
    )

    # =====================================
    # DEBUG
    # =====================================

    print("\n")
    print("=" * 60)
    print("TEXTO OCR RECONSTRUIDO")
    print("=" * 60)
    print(texto_final)
    print("=" * 60)
    print("\n")

    return texto_final
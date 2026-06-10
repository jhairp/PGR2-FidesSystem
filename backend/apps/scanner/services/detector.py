import cv2
import numpy as np


def detectar_campos(path):

    print("[OCR] Leyendo imagen")

    img = cv2.imread(path)

    if img is None:

        raise Exception(
            "No se pudo leer la imagen"
        )

    gray = cv2.cvtColor(
        img,
        cv2.COLOR_BGR2GRAY
    )

    _, thresh = cv2.threshold(
        gray,
        200,
        255,
        cv2.THRESH_BINARY_INV
    )

    horizontal = np.sum(
        thresh,
        axis=1
    )

    lineas = []

    en_texto = False
    inicio = 0

    for y, valor in enumerate(horizontal):

        if valor > 1000 and not en_texto:

            inicio = y
            en_texto = True

        elif valor <= 1000 and en_texto:

            fin = y

            if fin - inicio > 15:

                lineas.append(
                    (inicio, fin)
                )

            en_texto = False

    print(
        f"[OCR] Líneas detectadas: {len(lineas)}"
    )

    cajas = []

    for idx, (y1, y2) in enumerate(lineas):

        linea = thresh[
            y1:y2,
            :
        ]

        columnas = np.sum(
            linea,
            axis=0
        )

        texto_cols = np.where(
            columnas > 0
        )[0]

        if len(texto_cols) == 0:
            continue

        x1 = max(
            0,
            int(texto_cols[0]) - 10
        )

        x2 = min(
            img.shape[1],
            int(texto_cols[-1]) + 10
        )

        cajas.append(
            (
                idx,
                x1,
                y1,
                x2 - x1,
                y2 - y1
            )
        )

    print(
        f"[OCR] Líneas para OCR: {len(cajas)}"
    )

    return {
        "img": img,
        "cajas": cajas
    }
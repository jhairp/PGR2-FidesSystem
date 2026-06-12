from rapidfuzz import fuzz
import re

def parecido(texto, patron, minimo=70):

    return (
        fuzz.partial_ratio(
            texto.lower(),
            patron.lower()
        ) >= minimo
    )


def limpiar_linea(linea):

    return (
        linea
        .replace("#", " ")
        .replace(".", " ")
        .replace(",", " ")
        .strip()
    )

MESES = {

    "enero": "01",
    "febrero": "02",
    "marzo": "03",
    "abril": "04",

    "mayo": "05",
    "junio": "06",
    "julio": "07",
    "agosto": "08",

    "septiembre": "09",
    "setiembre": "09",

    "octubre": "10",
    "october": "10",
    "octulone": "10",

    "noviembre": "11",
    "diciembre": "12"
}


def convertir_fecha(texto):

    if not texto:
        return None

    texto = texto.lower()

    dia = "01"

    m = re.search(
        r"\b(\d{1,2})\b",
        texto
    )

    if m:
        dia = m.group(1).zfill(2)

    mes = "01"

    for nombre, numero in MESES.items():

        if nombre in texto:

            mes = numero
            break

    m = re.search(
        r"(18\d{2}|19\d{2}|20\d{2})",
        texto
    )

    if m:

        anio = m.group(1)

    else:

        anio = "2000"

    return f"{anio}-{mes}-{dia}"

def normalizar_texto_fijo(texto):

    texto = texto.lower()

    reemplazos = {

        "parrogual": "parroquial",
        "parroguial": "parroquial",
        "parroguial": "parroquial",

        "vince": "bautice",
        "vince:": "bautice",
        "bautices": "bautice",

        "naturative": "natural de",
        "nature": "natural de",
        "naturside": "natural de",

        "ye": "y de",
        "sur": "y de",

        "reventivo": "fue padrino",
        "fuepadino": "fue padrino",
        "padirno": "padrino",

        "october": "octubre",

        "dies": "dias",
        "defres": "del mes",

        "laiglesa": "la iglesia",
        "laiglesia": "la iglesia",

        # IGLESIA
        "laiglesa": "la iglesia",
        "laiglesia": "la iglesia",
        "laiglesia ": "la iglesia ",

        # PARROQUIAL
        "parrogual": "parroquial",
        "parroguial": "parroquial",
        "parroguial": "parroquial",

        # BAUTICE
        "bautices": "bautice",
        "bautizo": "bautice",
        "bautices": "bautice",
        "vince": "bautice",
        "vince:": "bautice",

        # NACIDO EL
        "ascitoel": "nacido el",
        "nacitoel": "nacido el",
        "uncitoet": "nacido el",
        "nacidoel": "nacido el",
        "macidoel": "nacido el",

        # HIJO DE
        "#": "hijo de",
        "hijode": "hijo de",
        "hijoe": "hijo de",
        "hijodee": "hijo de",

        # NATURAL DE
        "naturside": "natural de",
        "naturative": "natural de",
        "nature": "natural de",
        "naturaide": "natural de",
        "natualde": "natural de",
        "naturaide": "natural de",

        # Y DE
        " se ": " y de ",
        " ye ": " y de ",
        " sur ": " y de ",
        " ye ": " y de ",

        # FUE PADRINO
        "preparations": "fue padrino",
        "reventivo": "fue padrino",
        "fuepadino": "fue padrino",
        "fuepadirno": "fue padrino",
        "padirno": "padrino",

        # CERTIFICO
        ". padre": " certifico padre",
        " certitico ": " certifico ",
        " certfico ": " certifico ",
        " certifica ": " certifico ",

        # MESES
        "eucno": "enero",
        "enerc": "enero",
        "enera": "enero",

        "febrerc": "febrero",

        "marzc": "marzo",

        "abrll": "abril",

        "junic": "junio",

        "julic": "julio",

        "agostc": "agosto",

        "setiembre": "septiembre",

        "october": "octubre",
        "octulone": "octubre",

        # FRASES COMPLETAS
        "delmes": "del mes",
        "delario": "del año",
        "mill novecientos": "mil novecientos",
        "diasdelmes": "dias del mes"
    }

    for malo, bueno in reemplazos.items():

        texto = texto.replace(
            malo,
            bueno
        )

    return texto

def parsear_partida(texto):

    texto = normalizar_texto_fijo(texto)

    texto_original = texto

    texto = texto.lower()

    texto = texto.replace("\n", " ")

    datos = {

        "num_partida": None,
        "centro": None,
        "fecha_bautizo": None,

        "nom_lai": None,
        "ap_pat_lai": None,
        "ap_mat_lai": None,

        "fecha_nac_lai": None,

        "nom_p_lai": None,
        "ap_pat_p_lai": None,
        "ap_mat_p_lai": None,

        "nom_m_lai": None,
        "ap_pat_m_lai": None,
        "ap_mat_m_lai": None,

        "lugar_nac_lai": None,

        "nom_pad_1_sac": None,
        "nom_pad_2_sac": None
    }

    # ==================================================
    # NUMERO PARTIDA
    # ==================================================

    m = re.search(
        r"\b(?:n[o0]|no)?\s*(\d{1,4})\b",
        texto
    )

    if m:

        datos["num_partida"] = m.group(1)

    # ==================================================
    # CENTRO
    # En la iglesia parroquial de XXXXX a los
    # ==================================================

    m = re.search(
        r"parroquial\s+de\s+(.*?)\s+(?:a\s*los|alos)",
        texto
    )

    if m:

        datos["centro"] = (
            m.group(1)
            .strip()
            .title()
        )

    # ==================================================
    # FECHA BAUTIZO
    # a los XX dias del mes de XXXX
    # ==================================================

    m = re.search(
        r"(?:a\s*los|alos)(.*?)(?:bautic)",
        texto
    )

    if m:

        datos["fecha_bautizo"] = convertir_fecha(
            m.group(1)
        )

    # ==================================================
    # BAUTIZADO
    # bautice XXXXX nacido
    # ==================================================

    m = re.search(
        r"bauti\w*\s+(.*?)(?:nacido|macido|uncitoet|4\s+de)",
        texto
    )

    if m:

        nombre_completo = (
            m.group(1)
            .strip()
        )

        partes = nombre_completo.split()

        if len(partes) >= 3:

            datos["nom_lai"] = " ".join(
                partes[:-2]
            )

            datos["ap_pat_lai"] = partes[-2]

            datos["ap_mat_lai"] = partes[-1]

    # ==================================================
    # FECHA NACIMIENTO
    # ==================================================

    m = re.search(
        r"(\d{1,2}\s+de\s+\w+\s+de\s+\d{4})",
        texto
    )

    if m:

        datos["fecha_nac_lai"] = convertir_fecha(
            m.group(1)
        )

    # ==================================================
    # PADRE
    # fecha nacimiento -> natural de
    # ==================================================

    m = re.search(
        r"\d{4}\s+(.*?)\s+natural",
        texto
    )

    if m:

        padre = m.group(1).strip()

        partes = padre.split()

        if len(partes) >= 3:

            datos["nom_p_lai"] = partes[0]

            datos["ap_pat_p_lai"] = partes[1]

            datos["ap_mat_p_lai"] = " ".join(
                partes[2:]
            )

    # ==================================================
    # MADRE
    # y de XXXXX natural
    # ==================================================

    m = re.search(
        r"(?:y\s+de|sur)\s+(.*?)\s+natural",
        texto
    )

    if m:

        madre = m.group(1).strip()

        partes = madre.split()

        if len(partes) >= 3:

            datos["nom_m_lai"] = partes[0]

            datos["ap_pat_m_lai"] = partes[1]

            datos["ap_mat_m_lai"] = " ".join(
                partes[2:]
            )

    # ==================================================
    # LUGAR NACIMIENTO
    # primer "natural de"
    # ==================================================

    m = re.search(
        r"natural\s+de\s+([a-z\s]+?)\s+(?:y\s+de|sur)",
        texto
    )

    if m:

        datos["lugar_nac_lai"] = (
            m.group(1)
            .strip()
            .title()
        )

    # ==================================================
    # PADRINO
    # fue padrino XXXXX y
    # ==================================================

    m = re.search(
        r"(?:fuepadino|padirno|padrino)\s+(.*?)\s+y",
        texto
    )

    if m:

        datos["nom_pad_1_sac"] = (
            m.group(1)
            .strip()
            .title()
        )

    # ==================================================
    # MADRINA
    # y XXXXX certifico
    # ==================================================

    m = re.search(
        r"\sy\s+(.*?)\s+(?:certifico|padre)",
        texto
    )

    if m:

        datos["nom_pad_2_sac"] = (
            m.group(1)
            .strip()
            .title()
        )

    return datos

    lineas = [

        limpiar_linea(x)

        for x in texto.split("\n")

        if x.strip()
    ]

    datos = {

        "num_partida": None,
        "centro": None,
        "fecha_bautizo": None,

        "nom_lai": None,
        "ap_pat_lai": None,
        "ap_mat_lai": None,

        "fecha_nac_lai": None,

        "nom_p_lai": None,
        "ap_pat_p_lai": None,
        "ap_mat_p_lai": None,

        "nom_m_lai": None,
        "ap_pat_m_lai": None,
        "ap_mat_m_lai": None,

        "lugar_nac_lai": None,

        "nom_pad_1_sac": None,
        "nom_pad_2_sac": None
    }

    # ----------------------------------
    # NUMERO PARTIDA
    # ----------------------------------

    m = re.search(
        r"\b(\d{1,3})\b",
        texto
    )

    if m:

        datos["num_partida"] = m.group(1)

    # ----------------------------------
    # RECORRER LINEAS
    # ----------------------------------

    for i, linea in enumerate(lineas):

        linea_l = linea.lower()

        # CENTRO

        if (
            "parroquial" in linea_l
            and "de" in linea_l
        ):

            m = re.search(
                r"parroquial\s+de\s+(.*)",
                linea_l
            )

            if m:

                datos["centro"] = (
                    m.group(1)
                    .strip()
                    .title()
                )

        # FECHA BAUTIZO

        if (
            "dias" in linea_l
            or "diasdelmes" in linea_l
        ):

            datos["fecha_bautizo"] = (
                convertir_fecha(
                    linea_l
                )
            )

        # BAUTIZADO

        if parecido(linea_l, "bautice"):

            texto_bautizado = re.sub(
                r"bauti\w*",
                "",
                linea_l
            )

            texto_bautizado = re.sub(
                r"uncitoet|nacido.*|macido.*",
                "",
                texto_bautizado
            )

            partes = texto_bautizado.split()

            if len(partes) >= 4:

                datos["nom_lai"] = " ".join(
                    partes[:-2]
                )

                datos["ap_pat_lai"] = partes[-2]

                datos["ap_mat_lai"] = partes[-1]

        # FECHA NACIMIENTO

        if re.search(
            r"\d{1,2}\s+de\s+\w+\s+de\s+\d{4}",
            linea_l
        ):

            datos["fecha_nac_lai"] = (
                convertir_fecha(
                    linea_l
                )
            )

        # PADRE

        if (
            "chipana" in linea_l
            or "poma" in linea_l
        ):

            partes = linea.split()

            if len(partes) >= 3:

                datos["nom_p_lai"] = (
                    partes[0]
                )

                datos["ap_pat_p_lai"] = (
                    partes[1]
                )

                datos["ap_mat_p_lai"] = (
                    " ".join(
                        partes[2:]
                    )
                )

        # MADRE

        if (
            "fabiola" in linea_l
        ):

            partes = linea.split()

            if len(partes) >= 3:

                datos["nom_m_lai"] = (
                    partes[0]
                )

                datos["ap_pat_m_lai"] = (
                    partes[1]
                )

                datos["ap_mat_m_lai"] = (
                    " ".join(
                        partes[2:]
                    )
                )

        # LUGAR

        if "la paz" in linea_l:

            datos["lugar_nac_lai"] = (
                "La Paz"
            )

        # PADRINO

        if (
            "julio" in linea_l
            or "ramon" in linea_l
        ):

            m = re.search(
                r"(julio.*)",
                linea,
                re.I
            )

            if m:

                datos["nom_pad_1_sac"] = (
                    m.group(1)
                )

        # MADRINA

        if (
            "esther" in linea_l
        ):

            m = re.search(
                r"(esther.*)",
                linea,
                re.I
            )

            if m:

                datos["nom_pad_2_sac"] = (
                    m.group(1)
                )

    return datos
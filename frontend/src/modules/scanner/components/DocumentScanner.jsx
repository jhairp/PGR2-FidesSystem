import { useState } from 'react'

import scannerService from '../services/scannerService'

import '../styles/scanner.css'

import ScannerForm from './ScannerForm'

export default function DocumentScanner({

    createBautizo,
    usuarios,
    centros,
    loading

}) {

    const [image, setImage] = useState(null)

    const [scanning, setScanning] = useState(false)

    const [deteccion, setDeteccion] = useState(null)

    const [datosOCR, setDatosOCR] =
    useState(null)
    
    const [textoOCR, setTextoOCR] =
    useState('')

    const handleFile = async (e) => {

        console.log("archivo seleccionado")

        const file = e.target.files[0]

        if (!file) return

        setImage(
            URL.createObjectURL(file)
        )

        setScanning(true)

        try {

            console.log("Antes de enviar")

            const resultado =
                await scannerService.detectar(
                    file
                )

            console.log("Resultado recibido")
            console.log(resultado)

            setDatosOCR(resultado.datos)
            setTextoOCR(resultado.texto_ocr || '')

        } catch (error) {

            console.error("ERROR OCR")

            console.error(error)

        } finally {

            setScanning(false)
        }
    }

    return (

        <div className="
            max-w-7xl
            mx-auto
        ">

            <h1 className="
                text-4xl
                font-black
                mb-8
                text-slate-800
            ">

                Escáner de Partidas

            </h1>

            {!image && (

                <label className="
                    border-2
                    border-dashed
                    border-slate-300

                    rounded-3xl

                    h-80

                    flex
                    flex-col

                    justify-center
                    items-center

                    cursor-pointer

                    hover:border-emerald-500

                    transition-all
                ">

                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFile}
                    />

                    <div className="text-center">

                        <h2 className="
                            text-2xl
                            font-bold
                            mb-2
                        ">
                            Seleccionar Imagen
                        </h2>

                        <p className="text-slate-500">

                            Haz clic para cargar una partida

                        </p>

                    </div>

                </label>

            )}

            {image && (

                <div className="
                    mt-8
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-8
                ">

                    <div>

    <h3 className="
        font-bold
        mb-3
    ">
        Original
    </h3>

    <div className="
        relative
        rounded-3xl
        overflow-hidden
        border
    ">

        <img
            src={image}
            alt=""
            className="w-full"
        />

    </div>

</div>
<div>

    <ScannerForm

    datosOCR={datosOCR}

    textoOCR={textoOCR}

    usuarios={usuarios}
    
    centros={centros}

    loading={loading}

    onGuardar={createBautizo}

/>

</div>

                </div>

            )}

        </div>
    )
}
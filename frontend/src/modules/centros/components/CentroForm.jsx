import { useEffect, useState } from "react";

import { useNavigate }
from "react-router-dom";

import {
    MapPin,
    Home,
    Save,
} from "lucide-react";

import TopAlert
from "../../../components/ui/TopAlert";

import ActionOverlay
from "../../../components/ui/ActionOverlay";

import CentroMap
from "./CentroMap";

import centroService
from "../services/centroService";

import api
from "../../../api/axios";

export default function CentroForm({

    centroId = null,
    initialData = null,
    isEdit = false,
    onSuccess

}) {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [parroquias,
        setParroquias] =
        useState([]);

    const [overlay, setOverlay] =
        useState({
            show: false,
            type: "loading"
        });

    const [topAlert, setTopAlert] =
        useState({
            show: false,
            type: "success",
            message: ""
        });

    const [errors, setErrors] =
        useState({});

    const [uploadingImage,
        setUploadingImage] =
        useState(false);

    const [dragOver,
        setDragOver] =
        useState(false);
            
    const [data, setData] = useState(

        initialData || {

            nom_cen: "",
            telf_cen: "",
        capacidad_cen: "",
            pais_cen: "BOLIVIA",
            municipio_cen: "",
            ciudad_cen: "",
            provincia_cen: "",
            calle_cen: "",
            coordenadas_cen: "",
            estado_cen: "activo",
            parroquia: ""

        }
    );

    useEffect(() => {

        loadParroquias();

        if (centroId) {

            loadCentro();
        }

    }, []);

    const loadParroquias =
        async () => {

            try {

                const response =
                    await api.get(
                        "/parroquias/"
                    );

                setParroquias(
                    response.data
                );

            } catch (error) {

                console.log(
                    error.response.data
                );
            }
        };

    const loadCentro =
        async () => {

            try {

                setLoading(true);

                const response =
                    await centroService.getById(
                        centroId
                    );

                setData({

                    nom_cen:
                        response.nom_cen || "",

                    telf_cen:
                        response.telf_cen || "",
                        
                    capacidad_cen:
                        response.capacidad_cen || "",
                    
                    parroquia:
                        response.parroquia || "",

                    pais_cen:
                        response.pais_cen || "",

                    ciudad_cen:
                        response.ciudad_cen || "",

                    provincia_cen:
                        response.provincia_cen || "",

                    municipio_cen:
                        response.municipio_cen || "",

                    calle_cen:
                        response.calle_cen || "",

                    coordenadas_cen:
                        response.coordenadas_cen ||
                        "-16.5000,-68.1500",

                    imagenes:
                        response.imagenes || [],

                });

            } catch (error) {

                    console.log(
                        error.response.data
                    );

            } finally {

                setLoading(false);
            }
        };

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;

        setData((prev) => ({

            ...prev,

            [name]: value

        }));
    };

    const handleSubmit =
    async (e) => {

        e.preventDefault();

        try {

            setErrors({});

            const actionType =
                centroId
                    ? "actualizado"
                    : "creado";

            setOverlay({
                show: true,
                type: actionType
            });

            if (centroId) {

                await centroService.update(
                    centroId,
                    data
                );

            } else {

                const payload = {

                    ...data,

                    id_par_1:
                        data.parroquia
                };

                await centroService.create(
                    payload
                );
            }

            setTimeout(() => {

                setOverlay({
                    show: false,
                    type: actionType
                });

            }, 900);

            setTopAlert({

                show: true,

                type: "success",

                message:
                    centroId
                        ? "Centro actualizado correctamente"
                        : "Centro registrado correctamente"

            });

            setTimeout(() => {

                navigate(
                    "/centros"
                );

            }, 1400);

        } catch (error) {

            console.log(
                error.response.data
            );

            setOverlay({
                show: true,
                type: "error"
            });

            setTimeout(() => {

                setOverlay({
                    show: false,
                    type: "error"
                });

            }, 900);

            if (
                error.response?.data
            ) {

                setErrors(
                    error.response.data
                );
            }

            setTopAlert({

                show: true,

                type: "error",

                message:
                    "Error al guardar centro"

            });

        } finally {

            setTimeout(() => {

                setTopAlert({

                    show: false,
                    type: "success",
                    message: ""

                });

            }, 2500);
        }
    };

    const handleUploadImage =
        async (file) => {

            if (
                !file ||
                !centroId
            ) {
                return;
            }

            try {

                setUploadingImage(true);

                const formData =
                    new FormData();

                formData.append(
                    "imagen",
                    file
                );

                await api.post(

                    `/centros/${centroId}/subir-imagen/`,

                    formData,

                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

                await loadCentro();

                setTopAlert({

                    show: true,

                    type: "success",

                    message:
                        "Imagen subida correctamente"

                });

            } catch (error) {

                console.log(error);

                setTopAlert({

                    show: true,

                    type: "error",

                    message:
                        "Error al subir imagen"

                });

            } finally {

                setUploadingImage(false);
            }
        };

    const inputStyle = `
        w-full
        bg-white
        dark:bg-slate-800
        border-none
        rounded-2xl
        p-4
        text-sm
        font-bold
        text-slate-700
        dark:text-slate-200
        shadow-sm
        focus:ring-2
        focus:ring-indigo-500
        transition-all
        placeholder:text-slate-400
    `;

    const labelStyle = `
        block
        text-[9px]
        font-black
        uppercase
        text-slate-400
        dark:text-slate-500
        ml-2
        mb-1
        tracking-widest
    `;

    if (loading) {

        return (
            <div>
                Cargando...
            </div>
        );
    }

    return (

        <>

            <ActionOverlay
                isVisible={overlay.show}
                type={overlay.type}
            />

            <TopAlert
                show={topAlert.show}
                type={topAlert.type}
                message={topAlert.message}
            />

            <form
                onSubmit={handleSubmit}
                className="p-2"
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-12
                        gap-8
                        items-start
                    "
                >

                    {/* MAPA */}

                    <div
                        className="
                            lg:col-span-7
                            order-first
                            lg:order-1
                        "
                    >

                        <CentroMap
                            data={data}
                            setData={setData}
                        />

                    </div>

                    {/* FORM */}

                    <div
                        className="
                            lg:col-span-5
                            space-y-6
                            order-last
                            lg:order-2
                        "
                    >

                        {/* INFO GENERAL */}

                        <div
                            className="
                                bg-slate-50
                                dark:bg-slate-900/40
                                p-6
                                rounded-[2.5rem]
                                border
                                border-slate-100
                                dark:border-slate-800
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-6
                                "
                            >

                                <div
                                    className="
                                        p-2
                                        bg-indigo-500/10
                                        rounded-lg
                                        text-indigo-500
                                    "
                                >

                                    <Home size={18} />

                                </div>

                                <h4
                                    className="
                                        text-[11px]
                                        font-black
                                        uppercase
                                        text-slate-700
                                        dark:text-slate-200
                                    "
                                >

                                    Información General

                                </h4>

                            </div>

                            <div className="space-y-4">

                                <div>

                                    <label
                                        className={
                                            labelStyle
                                        }
                                    >

                                        Nombre del Centro

                                    </label>

                                    <input
                                        type="text"

                                        name="nom_cen"

                                        value={
                                            data.nom_cen
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className={
                                            inputStyle
                                        }
                                    />

                                </div>

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                    "
                                >

                                    <div>

                                        <label
                                            className={
                                                labelStyle
                                            }
                                        >

                                            Teléfono

                                        </label>

                                        <input
                                            type="text"

                                            name="telf_cen"

                                            value={
                                                data.telf_cen
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className={
                                                inputStyle
                                            }
                                        />

                                    </div>

                                    <div>

                                        <label
                                            className={
                                                labelStyle
                                            }
                                        >

                                            Capacidad

                                        </label>

                                        <input

                                            type="number"

                                            min="0"

                                            name="capacidad_cen"

                                            value={
                                                data.capacidad_cen
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className={
                                                inputStyle
                                            }

                                            placeholder="300"

                                        />

                                    </div>

                                    <div>

                                        <label
                                            className={
                                                labelStyle
                                            }
                                        >

                                            Parroquia

                                        </label>

                                        <select

                                            name="parroquia"

                                            value={
                                                data.parroquia
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className={
                                                inputStyle
                                            }
                                        >

                                            <option value="">
                                                Seleccionar
                                            </option>

                                            {
                                                parroquias.map(
                                                    (
                                                        p
                                                    ) => (

                                                        <option
                                                            key={
                                                                p.id_par
                                                            }

                                                            value={
                                                                p.id_par
                                                            }
                                                        >

                                                            {
                                                                p.nom_par
                                                            }

                                                        </option>

                                                    )
                                                )
                                            }

                                        </select>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* UBICACION */}

                        <div
                            className="
                                bg-slate-50
                                dark:bg-slate-900/40
                                p-6
                                rounded-[2.5rem]
                                border
                                border-slate-100
                                dark:border-slate-800
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                    mb-6
                                "
                            >

                                <div
                                    className="
                                        p-2
                                        bg-emerald-500/10
                                        rounded-lg
                                        text-emerald-500
                                    "
                                >

                                    <MapPin size={18} />

                                </div>

                                <h4
                                    className="
                                        text-[11px]
                                        font-black
                                        uppercase
                                        text-slate-700
                                        dark:text-slate-200
                                    "
                                >

                                    Ubicación

                                </h4>

                            </div>

                            <div className="space-y-4">

                                <div
                                    className="
                                        grid
                                        grid-cols-2
                                        gap-4
                                    "
                                >

                                    <div>

                                        <label
                                            className={
                                                labelStyle
                                            }
                                        >

                                            Ciudad

                                        </label>

                                        <input
                                            type="text"

                                            name="ciudad_cen"

                                            value={
                                                data.ciudad_cen
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className={
                                                inputStyle
                                            }
                                        />

                                    </div>

                                    <div>

                                        <label
                                            className={
                                                labelStyle
                                            }
                                        >

                                            Provincia

                                        </label>

                                        <input
                                            type="text"

                                            name="provincia_cen"

                                            value={
                                                data.provincia_cen
                                            }

                                            onChange={
                                                handleChange
                                            }

                                            className={
                                                inputStyle
                                            }
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label
                                        className={
                                            labelStyle
                                        }
                                    >

                                        Dirección

                                    </label>

                                    <textarea

                                        name="calle_cen"

                                        value={
                                            data.calle_cen
                                        }

                                        onChange={
                                            handleChange
                                        }

                                        className={`
                                            ${inputStyle}
                                            h-24
                                            resize-none
                                        `}
                                    />

                                </div>

                            </div>

                        </div>

                        {
                            centroId && (

                                <div
                                    className="
                                        bg-slate-50
                                        dark:bg-slate-900/40
                                        p-6
                                        rounded-[2.5rem]
                                        border
                                        border-slate-100
                                        dark:border-slate-800
                                    "
                                >

                                    <h4
                                        className="
                                            text-[11px]
                                            font-black
                                            uppercase
                                            mb-4
                                        "
                                    >

                                        Galería de Imágenes

                                    </h4>

                                    <div

                                        onDragOver={(e) => {

                                            e.preventDefault();

                                            setDragOver(true);
                                        }}

                                        onDragLeave={() => {

                                            setDragOver(false);
                                        }}

                                        onDrop={(e) => {

                                            e.preventDefault();

                                            setDragOver(false);

                                            const file =
                                                e.dataTransfer.files[0];

                                            handleUploadImage(
                                                file
                                            );
                                        }}

                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "upload-image"
                                                )
                                                .click()
                                        }

                                        className={`
                                            border-2
                                            border-dashed
                                            rounded-3xl
                                            p-10
                                            text-center
                                            cursor-pointer
                                            transition-all

                                            ${
                                                dragOver

                                                ? `
                                                    border-indigo-500
                                                    bg-indigo-50
                                                    dark:bg-indigo-900/20
                                                `

                                                : `
                                                    border-slate-300
                                                    dark:border-slate-700
                                                `
                                            }
                                        `}
                                    >

                                        <p
                                            className="
                                                font-bold
                                                text-slate-700
                                                dark:text-slate-200
                                            "
                                        >

                                            Arrastra imágenes aquí

                                        </p>

                                        <p
                                            className="
                                                text-sm
                                                text-slate-500
                                                mt-1
                                            "
                                        >

                                            o haz clic para seleccionar

                                        </p>

                                        {
                                            uploadingImage && (

                                                <p
                                                    className="
                                                        mt-4
                                                        font-bold
                                                        text-indigo-600
                                                    "
                                                >

                                                    Subiendo imagen...

                                                </p>
                                            )
                                        }

                                    </div>

                                    <input

                                        id="upload-image"

                                        hidden

                                        type="file"

                                        accept="image/*"

                                        onChange={(e) => {

                                            const file =
                                                e.target.files[0];

                                            if (file) {

                                                handleUploadImage(
                                                    file
                                                );
                                            }
                                        }}
                                    />

                                    <div
                                        className="
                                            grid
                                            grid-cols-2
                                            md:grid-cols-3
                                            gap-3
                                            mt-5
                                        "
                                    >

                                        {
                                            (
                                                data.imagenes || []
                                            ).map(
                                                (img) => (

                                                    <div
                                                        key={img.id_img}
                                                        className="
                                                            relative
                                                            group
                                                        "
                                                    >

                                                        <button

                                                            type="button"

                                                            onClick={
                                                                async () => {

                                                                    if (
                                                                        !window.confirm(
                                                                            "¿Eliminar imagen?"
                                                                        )
                                                                    ) {
                                                                        return;
                                                                    }

                                                                    await api.delete(

                                                                        `/imagenes-centro/${img.id_img}/`
                                                                    );

                                                                    await loadCentro();
                                                                }
                                                            }

                                                            className="
                                                                absolute
                                                                top-2
                                                                right-2
                                                                w-8
                                                                h-8
                                                                rounded-full
                                                                bg-red-600
                                                                hover:bg-red-700
                                                                text-white
                                                                font-bold
                                                                shadow-lg
                                                                z-10
                                                                opacity-0
                                                                group-hover:opacity-100
                                                                transition-all
                                                            "
                                                        >

                                                            ×

                                                        </button>

                                                        <img

                                                            src={
                                                                img.url_img
                                                            }

                                                            alt=""

                                                            className="
                                                                w-full
                                                                h-28
                                                                object-cover
                                                                rounded-2xl
                                                                border
                                                                border-slate-200
                                                                dark:border-slate-700
                                                                shadow-sm
                                                            "
                                                        />

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                </div>

                            )
                        }

                        {/* BOTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                font-black
                                uppercase
                                text-[11px]
                                tracking-[0.3em]
                                py-5
                                rounded-2xl
                                shadow-xl
                                shadow-indigo-500/20
                                transition-all
                                active:scale-95
                                disabled:opacity-50
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >

                            <Save size={18} />

                            {
                                centroId
                                    ? "Actualizar Centro"
                                    : "Registrar Centro"
                            }

                        </button>

                    </div>

                </div>

            </form>

        </>

    );
}
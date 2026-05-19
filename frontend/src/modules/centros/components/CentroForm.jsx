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

    const [data, setData] = useState(

        initialData || {

            nom_cen: "",
            telf_cen: "",
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

                console.log(error);
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

                });

            } catch (error) {

                console.log(error);

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

                await centroService.create(
                    data
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

            console.log(error);

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
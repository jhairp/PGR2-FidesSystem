import {
    useEffect,
    useRef,
    useState
} from "react";

import centroService
from "@/modules/centros/services/centroService";

import iglesiaIcon
from "@/assets/iglesiaicono.png";

export default function IglesiaMap() {

    const mapRef = useRef(null);

    const activeInfoWindowRef =
        useRef(null);

    const [centros, setCentros] =
        useState([]);

    const [filteredCentros,
    setFilteredCentros] =
        useState([]);

    const [userLocation,
    setUserLocation] =
        useState(null);

    // ================================
    // FILTROS
    // ================================

   const [search,
    setSearch] =
        useState("");

    const [selectedParroquia,
    setSelectedParroquia] =
        useState("");

    const [selectedCiudad,
    setSelectedCiudad] =
        useState("");

    const [selectedCapacidad,
    setSelectedCapacidad] =
        useState("");

    const [selectedDistance,
    setSelectedDistance] =
        useState("10");

    const [showFilters,
    setShowFilters] =
        useState(false);

    const [selectedImage,
    setSelectedImage] =
        useState(null);
    // ================================
    // CARGAR CENTROS
    // ================================

    useEffect(() => {

        loadCentros();

    }, []);

    // ================================
    // GEOLOCALIZACIÓN
    // ================================

    useEffect(() => {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setUserLocation({

                    lat:
                        position.coords.latitude,

                    lng:
                        position.coords.longitude
                });

            },

            (error) => {

                console.log(error);
            }
        );

    }, []);

    // ================================
    // MAPA
    // ================================

    useEffect(() => {

        if (filteredCentros.length > 0) {

            loadMap();
        }

    }, [filteredCentros, userLocation]);

    // ================================
    // OBTENER CENTROS
    // ================================

    const loadCentros = async () => {

        try {

            const response =
                await centroService.getAll();

            setCentros(response);

            setFilteredCentros(response);

        } catch (error) {

            console.log(error);
        }
    };

    // ================================
    // OPCIONES FILTROS
    // ================================

    const parroquias = [

        ...new Set(

            centros
                .map(
                    c => c.parroquia_nombre
                )
                .filter(Boolean)
        )
    ];

    const ciudades = [

        ...new Set(

            centros
                .map(
                    c => c.ciudad_cen
                )
                .filter(Boolean)
        )
    ];

    // ================================
    // DISTANCIA ENTRE PUNTOS
    // ================================

    const calculateDistance = (

        lat1,
        lon1,
        lat2,
        lon2

    ) => {

        const R = 6371;

        const dLat =
            (lat2 - lat1) *
            Math.PI / 180;

        const dLon =
            (lon2 - lon1) *
            Math.PI / 180;

        const a =

            Math.sin(dLat / 2) *
            Math.sin(dLat / 2)

            +

            Math.cos(lat1 * Math.PI / 180)

            *

            Math.cos(lat2 * Math.PI / 180)

            *

            Math.sin(dLon / 2)

            *

            Math.sin(dLon / 2);

        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );

        return R * c;
    };

    // ================================
    // BUSCAR
    // ================================

    const handleSearch = () => {

        const filtered =
            centros.filter((centro) => {

                const text =
                    search.toLowerCase();

                const matchSearch =

                    !search ||

                    centro.nom_cen
                        ?.toLowerCase()
                        .includes(text)

                    ||

                    centro.parroquia_nombre
                        ?.toLowerCase()
                        .includes(text)

                    ||

                    centro.ciudad_cen
                        ?.toLowerCase()
                        .includes(text)

                    ||

                    centro.capacidad_cen
                        ?.toString()
                        .includes(text);

                const matchParroquia =

                    !selectedParroquia ||

                    centro.parroquia_nombre ===
                    selectedParroquia;

                const matchCiudad =

                    !selectedCiudad ||

                    centro.ciudad_cen ===
                    selectedCiudad;

                const matchCapacidad =

                    !selectedCapacidad ||

                    Number(centro.capacidad_cen) ===
                    Number(selectedCapacidad);

                let matchDistance = true;

                if (
                    userLocation &&
                    centro.coordenadas_cen
                ) {

                    const [lat, lng] =
                        centro.coordenadas_cen
                            .split(",")
                            .map(Number);

                    const distance =
                        calculateDistance(

                            userLocation.lat,

                            userLocation.lng,

                            lat,

                            lng
                        );

                    matchDistance =
                        distance <=
                        Number(selectedDistance);
                }

                return (

                    matchSearch &&
                    matchParroquia &&
                    matchCiudad &&
                    matchCapacidad &&
                    matchDistance
                );
            });

        setFilteredCentros(filtered);
        setShowFilters(false);
    };

    // ================================
    // GOOGLE MAPS
    // ================================

    const loadMap = () => {

        if (
            window.google &&
            window.google.maps
        ) {

            initMap();

            return;
        }

        const existingScript =
            document.getElementById(
                "googleMaps"
            );

        if (existingScript) {

            existingScript.onload =
                initMap;

            return;
        }

        const script =
            document.createElement("script");

        script.id = "googleMaps";

        script.src =
            "https://maps.googleapis.com/maps/api/js?key=AIzaSyA15R_qyicFWzgNzWgRs8b1BhwouMTYa34&libraries=places";

        script.async = true;

        script.defer = true;

        script.onload = initMap;

        document.body.appendChild(script);
    };

    // ================================
    // INIT MAP
    // ================================

    const initMap = () => {

        if (
            !window.google ||
            !window.google.maps
        ) return;

        const center =
            userLocation || {

                lat: -16.5,

                lng: -68.15
            };

        const map =
            new window.google.maps.Map(
                mapRef.current,
                {

                    center,

                    zoom: 13,

                    disableDefaultUI: false,

                    zoomControl: true,

                    streetViewControl: false,

                    fullscreenControl: false,

                    mapTypeControl: false,
                }
            );

        // ============================
        // UBICACIÓN USUARIO
        // ============================

        if (userLocation) {

            new google.maps.Marker({

                position: userLocation,

                map,

                title: "Tu ubicación",

                icon: {

                    path:
                        google.maps.SymbolPath.CIRCLE,

                    scale: 10,

                    fillColor: "#2563eb",

                    fillOpacity: 1,

                    strokeColor: "#ffffff",

                    strokeWeight: 4,
                }
            });
        }

        // ============================
        // IGLESIAS
        // ============================

        (filteredCentros || [])

        .filter(
            (centro) =>
                centro.estado_cen === "activo"
        )

        .forEach((centro) => {

            if (!centro.coordenadas_cen)
                return;

            const [lat, lng] =
                centro.coordenadas_cen
                    .split(",")
                    .map(Number);

            const marker =
                new google.maps.Marker({

                    position: {
                        lat,
                        lng
                    },

                    map,

                    title: centro.nom_cen,

                    animation:
                        google.maps.Animation.DROP,

                    icon: {

                        url: iglesiaIcon,

                        scaledSize:
                            new google.maps.Size(
                                45,
                                45
                            ),

                        anchor:
                            new google.maps.Point(
                                22,
                                45
                            )
                    }
                });
                
            const imagenesHtml =

                centro.imagenes?.length

                    ? `

                        <div
                            style="
                                display:flex;
                                gap:8px;
                                margin-top:12px;
                                overflow-x:auto;
                            "
                        >

                            ${centro.imagenes.map(img => `

                                <img

                                    src="${img.url_img}"

                                    data-img="${img.url_img}"

                                    alt="Iglesia"

                                    style="
                                        width:80px;
                                        height:80px;
                                        object-fit:cover;
                                        border-radius:12px;
                                        border:1px solid #e2e8f0;
                                        flex-shrink:0;
                                        cursor:pointer;
                                        transition:.2s;
                                    "
                                />

                            `).join("")}

                        </div>

                    `

                    : `
                        <p
                            style="
                                margin-top:10px;
                                color:#64748b;
                                font-size:12px;
                            "
                        >
                            Sin imágenes
                        </p>
                    `;

            const infoWindow =
                new google.maps.InfoWindow({

                    content: `

                        <div style="
                            min-width:240px;
                            padding:10px;
                            font-family:Inter,sans-serif;
                        ">

                            <h2 style="
                                margin:0;
                                font-size:18px;
                                font-weight:900;
                                color:#0f172a;
                                text-transform:uppercase;
                            ">
                                ${centro.nom_cen}
                            </h2>

                            <p style="
                                margin-top:4px;
                                color:#4f46e5;
                                font-size:12px;
                                font-weight:800;
                                text-transform:uppercase;
                            ">
                                ${centro.parroquia_nombre || "Parroquia"}
                            </p>

                            <div style="
                                margin-top:14px;
                                padding-top:12px;
                                border-top:1px solid #e2e8f0;
                                display:flex;
                                flex-direction:column;
                                gap:8px;
                                font-size:14px;
                                color:#0f172a;
                                font-weight:700;
                            ">

                                <span>
                                    📍 ${centro.calle_cen || "Sin dirección"}
                                </span>

                                <span>
                                    📞 ${centro.telf_cen || "Sin teléfono"}
                                </span>

                            </div>

                            ${imagenesHtml}

                            <button
                                id="reservar-btn-${centro.id_cen}"
                                style="
                                    margin-top:16px;
                                    width:100%;
                                    border:none;
                                    background:#4f46e5;
                                    color:white;
                                    padding:12px;
                                    border-radius:14px;
                                    font-weight:800;
                                    cursor:pointer;
                                    font-size:14px;
                                "
                            >

                                Reservar misa

                            </button>

                        </div>
                        `
                });

            marker.addListener(
                "click",
                () => {

                    if (
                        activeInfoWindowRef.current
                    ) {

                        activeInfoWindowRef
                            .current
                            .close();
                    }

                    infoWindow.open({
                        anchor: marker,
                        map
                    });
                    google.maps.event.addListenerOnce(

                    infoWindow,

                    "domready",

                    () => {

                        const btn =
                            document.getElementById(
                                `reservar-btn-${centro.id_cen}`
                            );

                        if (btn) {

                            btn.onclick = () => {

                                window.location.href =
                                    `/calendario/${centro.id_cen}`;
                            };
                        }

                        const imagenes =
                            document.querySelectorAll(
                                "[data-img]"
                            );

                        imagenes.forEach((img) => {

                            img.onclick = () => {

                                setSelectedImage(
                                    img.dataset.img
                                );
                            };
                        });
                    }
                );

                    activeInfoWindowRef.current =
                        infoWindow;
                }
            );
        });
    };

    return (

        <div className="
            w-full
            h-full
            relative
        ">

            {/* FILTROS */}

            <div className="
                absolute
                top-4
                left-1/2
                -translate-x-1/2
                z-10
                w-[92%]
                md:w-auto
            ">

                {/* BOTÓN MOBILE */}

                <div className="md:hidden mb-3">

                    <button
                        onClick={() =>
                            setShowFilters(
                                !showFilters
                            )
                        }
                        className="
                            w-full
                            h-14
                            rounded-2xl
                            bg-white/95
                            backdrop-blur-xl
                            shadow-xl
                            font-black
                            text-slate-700
                            border
                            border-white/40
                        "
                    >

                        {
                            showFilters
                                ? 'Ocultar filtros'
                                : 'Mostrar filtros'
                        }

                    </button>

                </div>

                {/* PANEL */}

                <div className={`
                    bg-white/95
                    backdrop-blur-xl
                    rounded-[32px]
                    shadow-2xl
                    border
                    border-white/40
                    p-4
                    md:p-5
                    transition-all
                    duration-300

                    ${showFilters
                        ? 'block'
                        : 'hidden md:block'
                    }
                `}>

                    <div className="
                        flex
                        flex-col
                        lg:flex-row
                        gap-3
                    ">

                        {/* BUSCADOR */}

                        <input
                            type="text"
                            placeholder="Buscar iglesia..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            className="
                                h-12
                                md:h-14
                                px-5
                                rounded-2xl
                                border
                                border-slate-200
                                outline-none
                                font-semibold
                                w-full
                                lg:w-[240px]
                            "
                        />

                        {/* PARROQUIA */}

                        <select
                            value={selectedParroquia}
                            onChange={(e) =>
                                setSelectedParroquia(
                                    e.target.value
                                )
                            }
                            className="
                                h-12
                                md:h-14
                                px-5
                                rounded-2xl
                                border
                                border-slate-200
                                outline-none
                                font-semibold
                                w-full
                                lg:w-[220px]
                            "
                        >

                            <option value="">
                                Todas las parroquias
                            </option>

                            {
                                parroquias.map(
                                    (parroquia) => (

                                    <option
                                        key={parroquia}
                                        value={parroquia}
                                    >

                                        {parroquia}

                                    </option>
                                ))
                            }

                        </select>

                        {/* CIUDAD */}

                        <select
                            value={selectedCiudad}
                            onChange={(e) =>
                                setSelectedCiudad(
                                    e.target.value
                                )
                            }
                            className="
                                h-12
                                md:h-14
                                px-5
                                rounded-2xl
                                border
                                border-slate-200
                                outline-none
                                font-semibold
                                w-full
                                lg:w-[220px]
                            "
                        >

                            <option value="">
                                Todas las ciudades
                            </option>

                            {
                                ciudades.map(
                                    (ciudad) => (

                                    <option
                                        key={ciudad}
                                        value={ciudad}
                                    >

                                        {ciudad}

                                    </option>
                                ))
                            }

                        </select>

                        {/* CAPACIDAD */}

                        <select
                            value={selectedCapacidad}
                            onChange={(e) =>
                                setSelectedCapacidad(
                                    e.target.value
                                )
                            }
                            className="
                                h-12
                                md:h-14
                                px-5
                                rounded-2xl
                                border
                                border-slate-200
                                outline-none
                                font-semibold
                                w-full
                                lg:w-[220px]
                            "
                        >

                            <option value="">
                                Todas las capacidades
                            </option>

                            <option value="200">
                                200 personas
                            </option>

                            <option value="250">
                                250 personas
                            </option>

                            <option value="300">
                                300 personas
                            </option>

                            <option value="350">
                                350 personas
                            </option>

                            <option value="400">
                                400 personas
                            </option>

                            <option value="450">
                                450 personas
                            </option>

                            <option value="500">
                                500 personas
                            </option>

                        </select>

                        {/* DISTANCIA */}

                        <select
                            value={selectedDistance}
                            onChange={(e) =>
                                setSelectedDistance(
                                    e.target.value
                                )
                            }
                            className="
                                h-12
                                md:h-14
                                px-5
                                rounded-2xl
                                border
                                border-slate-200
                                outline-none
                                font-semibold
                                w-full
                                lg:w-[220px]
                            "
                        >

                            <option value="5">
                                5 km cerca de mí
                            </option>

                            <option value="10">
                                10 km cerca de mí
                            </option>

                            <option value="20">
                                20 km cerca de mí
                            </option>

                            <option value="50">
                                50 km cerca de mí
                            </option>

                        </select>

                        {/* BOTÓN */}

                        <button
                            onClick={handleSearch}
                            className="
                                h-12
                                md:h-14
                                px-8
                                rounded-2xl
                                bg-indigo-600
                                hover:bg-indigo-700
                                text-white
                                font-black
                                transition-all
                                shadow-xl
                                whitespace-nowrap
                            "
                        >

                            Buscar

                        </button>

                    </div>

                </div>

            </div>

            {/* MAPA */}

            <div
                ref={mapRef}
                className="
                    w-full
                    h-full
                "
            />

            {
    selectedImage && (

        <div
            onClick={() =>
                setSelectedImage(
                    null
                )
            }
            className="
                fixed
                inset-0
                bg-black/80
                z-[99999]
                flex
                items-center
                justify-center
                p-6
            "
        >

            <button
                className="
                    absolute
                    top-5
                    right-5
                    text-white
                    text-4xl
                    font-bold
                "
            >

                ×

            </button>

            <img

                src={
                    selectedImage
                }

                alt=""

                onClick={(e) =>
                    e.stopPropagation()
                }

                className="
                    max-w-[90vw]
                    max-h-[90vh]
                    rounded-3xl
                    shadow-2xl
                "
            />

        </div>

    )
}

        </div>
    );
}
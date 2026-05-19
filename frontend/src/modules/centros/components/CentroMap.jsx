import { useEffect, useRef, useState } from "react";

import centroService from "../services/centroService";

import iglesiaIcon from "../../../assets/iglesiaicono.png";

export default function CentroMap({
    data,
    setData
}) {

    if (!data) return null;

    const [centros, setCentros] = useState([]);
    
    const mapRef = useRef(null);

    const mapInstanceRef = useRef(null);

    const markerRef = useRef(null);

    const activeInfoWindowRef = useRef(null);

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

    const loadCentros = async () => {

        try {

            const response =
                await centroService.getAll();

            setCentros(response);

        } catch (error) {

            console.log(error);
        }
    };
    
    useEffect(() => {

        loadCentros();

    }, []);

    useEffect(() => {

        if (centros.length > 0) {

            loadMap();
        }

    }, [centros]);

    const initMap = () => {

    if (
        !window.google ||
        !window.google.maps
    ) return;

    const coordenadas =
        data?.coordenadas_cen ||
        "-16.5,-68.15";

    const [lat, lng] =
        coordenadas
            .split(",")
            .map(Number);

    const center = {
        lat,
        lng
    };

    const map =
        new window.google.maps.Map(
            mapRef.current,
            {
                center,
                zoom: 15
            }
        );

        centros.forEach((centro) => {

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

                    icon: {

                        url: iglesiaIcon,

                        scaledSize:
                            new window.google.maps.Size(
                                50,
                                50
                            ),

                        anchor:
                            new window.google.maps.Point(
                                25,
                                50
                            )
                    }

                });

            const infoWindow =
                new google.maps.InfoWindow({

                    content: `

                        <div style="
                            min-width:230px;
                            padding:4px 2px 2px 2px;
                            font-family:Inter,sans-serif;
                        ">

                            <div style="
                                display:flex;
                                flex-direction:column;
                                gap:2px;
                            ">

                                <h3 style="
                                    margin:0;
                                    padding:0;
                                    font-size:17px;
                                    font-weight:900;
                                    color:#0f172a;
                                    line-height:1.1;
                                    text-transform:uppercase;
                                ">
                                    ${centro.nom_cen}
                                </h3>

                                <p style="
                                    margin:0;
                                    padding:0;
                                    color:#4f46e5;
                                    font-size:11px;
                                    font-weight:800;
                                    letter-spacing:0.08em;
                                    text-transform:uppercase;
                                ">
                                    ${centro.parroquia_nombre}
                                </p>

                            </div>

                            <div style="
                                margin-top:14px;
                                padding-top:12px;
                                border-top:1px solid #e2e8f0;
                                display:flex;
                                flex-direction:column;
                                gap:8px;
                            ">

                                <div style="
                                    display:flex;
                                    align-items:center;
                                    gap:8px;
                                    color:#0f172a;
                                    font-size:14px;
                                    font-weight:700;
                                ">
                                     ${centro.telf_cen || "Sin teléfono"}
                                </div>

                            </div>

                        </div>
                        `
                });

            marker.addListener(
                "mouseover",
                () => {

                    marker.setAnimation(
                        window.google.maps.Animation.BOUNCE
                    );

                    setTimeout(() => {

                        marker.setAnimation(null);

                    }, 700);
                }
            );
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

                    activeInfoWindowRef.current =
                        infoWindow;
                }
            );
        });

    mapInstanceRef.current = map;

    const mainMarker =
        new window.google.maps.Marker({
            position: center,
            map,
            draggable: true
        });

    markerRef.current = mainMarker;

    const input =
        document.getElementById(
            "search-box"
        );

    const autocomplete =
        new window.google.maps.places.Autocomplete(
            input
        );

    autocomplete.bindTo("bounds", map);

    autocomplete.addListener(
        "place_changed",
        () => {

            const place =
                autocomplete.getPlace();

            if (
                !place.geometry ||
                !place.geometry.location
            ) return;

            map.setCenter(
                place.geometry.location
            );

            mainMarker.setPosition(
                place.geometry.location
            );

            fillAddressFields(place);
        }
    );

    mainMarker.addListener(
        "dragend",
        () => {

            const pos =
                mainMarker.getPosition();

            updateCoords(pos);

            reverseGeocode(pos);
        }
    );

    map.addListener(
        "click",
        (e) => {

            if (
                activeInfoWindowRef.current
            ) {

                activeInfoWindowRef
                    .current
                    .close();
            }

            mainMarker.setPosition(
                e.latLng
            );

            updateCoords(e.latLng);

            reverseGeocode(e.latLng);
        }
    );
};

    const updateCoords = (latLng) => {

        const lat = latLng.lat();

        const lng = latLng.lng();

        setData((prev) => ({
            ...prev,
            coordenadas_cen:
                `${lat},${lng}`
        }));
    };

    const reverseGeocode = (latLng) => {

        const geocoder =
            new window.google.maps.Geocoder();

        geocoder.geocode(
            { location: latLng },
            (results, status) => {

                if (
                    status === "OK" &&
                    results[0]
                ) {

                    fillAddressFields(
                        results[0]
                    );
                }
            }
        );
    };

    const fillAddressFields = (place) => {

        const comps =
            place.address_components || [];

        const find = (t) =>
            comps.find((c) =>
                c.types.includes(t)
            )?.long_name || "";

        const lat =
            place.geometry.location.lat();

        const lng =
            place.geometry.location.lng();

        setData((prev) => ({
            ...prev,

            calle_cen:
                (
                    place.formatted_address || ""
                ).toUpperCase(),

            pais_cen:
                find("country")
                    .toUpperCase(),

            ciudad_cen:
                find("locality")
                    .toUpperCase(),

            provincia_cen:
                find(
                    "administrative_area_level_1"
                ).toUpperCase(),

            municipio_cen:
                find(
                    "administrative_area_level_2"
                ).toUpperCase(),

            coordenadas_cen:
                `${lat},${lng}`
        }));
    };

    return (

        <div className="space-y-4">

            <input
                id="search-box"
                type="text"
                placeholder="Buscar dirección..."
                className="
                    w-full
                    p-4
                    rounded-2xl
                    border
                    border-slate-200
                    dark:border-slate-700
                    bg-white
                    dark:bg-[#11141D]
                    text-slate-700
                    dark:text-slate-200
                    placeholder:text-slate-400
                    dark:placeholder:text-slate-500
                    outline-none
                    transition-all
                    focus:ring-4
                    focus:ring-indigo-500/20
                    focus:border-indigo-500
                    shadow-sm
                "
            />

            <div
                ref={mapRef}
                className="
                    w-full
                    h-[500px]
                    rounded-3xl
                    overflow-hidden
                "
            />

        </div>
    );
}
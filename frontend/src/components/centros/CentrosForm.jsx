import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { getParroquias, getCentroById, saveCentro, updateCentro } from "api.js";

const CentrosForm = () => {
    const { id } = useParams();
    const history = useHistory();
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    
    const [parroquias, setParroquias] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nom_cen: "",
        telf_cen: "",
        id_par_1: "", // Este es el FK a Parroquias
        calle_cen: "",
        pais_cen: "Bolivia",
        ciudad_cen: "",
        provincia_cen: "",
        municipio_cen: "",
        estado_cen: "activo",
        coordenadas_cen: ""
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const parData = await getParroquias();
                setParroquias(parData || []);
                
                if (id) {
                    const centroData = await getCentroById(id);
                    setFormData(centroData);
                    initMap(centroData.coordenadas_cen);
                } else {
                    initMap();
                }
            } catch (err) {
                console.error("Error al cargar datos iniciales:", err);
                setParroquias([]); // Evita que la app truene, solo deja el select vacío
            }
        };

        fetchInitialData();
    }, [id]);

    const initMap = (coordsString = "-16.5000, -68.1500") => {
        if (!window.google || !window.google.maps) return;

        const [lat, lng] = coordsString.split(",").map(Number);
        const center = { lat: lat || -16.5000, lng: lng || -68.1500 };

        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: center,
            mapTypeControl: false,
            streetViewControl: false,
        });

        const marker = new window.google.maps.Marker({
            position: center,
            map: map,
            draggable: true,
        });
        markerRef.current = marker;

        // Autocomplete logic
        const input = document.getElementById("buscador-direccion");
        if (input && window.google.maps.places) {
            const autocomplete = new window.google.maps.places.Autocomplete(input);
            autocomplete.bindTo("bounds", map);
            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) return;
                map.setCenter(place.geometry.location);
                marker.setPosition(place.geometry.location);
                handleGeocode(place.geometry.location);
            });
        }

        map.addListener("click", (e) => {
            marker.setPosition(e.latLng);
            handleGeocode(e.latLng);
        });

        marker.addListener("dragend", () => {
            handleGeocode(marker.getPosition());
        });
    };

    const handleGeocode = (latLng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
                const comps = results[0].address_components;
                const getComp = (type) => comps.find(c => c.types.includes(type))?.long_name || "";

                setFormData(prev => ({
                    ...prev,
                    calle_cen: getComp("route") || results[0].formatted_address,
                    pais_cen: getComp("country"),
                    ciudad_cen: getComp("locality"),
                    municipio_cen: getComp("administrative_area_level_2"),
                    provincia_cen: getComp("administrative_area_level_1"),
                    coordenadas_cen: `${latLng.lat()},${latLng.lng()}`
                }));
            }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Si el campo es la parroquia, nos aseguramos de que sea un número (ID)
        setFormData({ 
            ...formData, 
            [name]: name === "id_par_1" ? parseInt(value) : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateCentro(id, formData);
                alert("Centro actualizado correctamente");
            } else {
                await saveCentro(formData);
                alert("Centro registrado correctamente");
            }
            history.push("/admin/centros");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Hubo un error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white p-6">
            <header className="flex items-center justify-between mb-6 border-b pb-4">
                <h3 className="font-semibold text-xl text-blueGray-700">
                    <i className="fas fa-church mr-2 text-blue-500"></i>
                    {id ? "Editar Información del Centro" : "Registrar Nuevo Centro Parroquial"}
                </h3>
            </header>
            
            <form onSubmit={handleSubmit}>
                <div className="flex flex-wrap">
                    {/* Columna Izquierda: Datos del formulario */}
                    <div className="w-full lg:w-4/12 px-4 border-r border-blueGray-100">
                        <div className="relative w-full mb-4">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nombre del Centro</label>
                            <input type="text" name="nom_cen" className="border-0 px-3 py-3 text-blueGray-600 bg-white rounded text-sm shadow focus:ring w-full ease-linear transition-all duration-150" 
                                value={formData.nom_cen} onChange={handleChange} placeholder="Ej. Capilla San José" required />
                        </div>

                        <div className="relative w-full mb-4">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Teléfono de Contacto</label>
                            <input type="text" name="telf_cen" className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:ring w-full" 
                                value={formData.telf_cen} onChange={handleChange} placeholder="Ej. 2224455" required />
                        </div>

                        <div className="relative w-full mb-4">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Parroquia Perteneciente</label>
                            <select name="id_par_1" className="border-0 px-3 py-3 bg-white rounded text-sm shadow focus:ring w-full" 
                                value={formData.id_par_1} onChange={handleChange} required>
                                <option value="">--- Seleccione una Parroquia ---</option>
                                {parroquias.map(p => (
                                    <option key={p.id_par} value={p.id_par}>
                                        {p.nom_par}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <hr className="my-4 border-blueGray-100" />

                        <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-500 text-xs font-bold mb-2">Información de Ubicación</label>
                            <div className="bg-blueGray-50 p-3 rounded border border-dashed border-blueGray-200">
                                <p className="text-xs text-blueGray-500 mb-1"><strong>Ciudad:</strong> {formData.ciudad_cen || 'No detectada'}</p>
                                <p className="text-xs text-blueGray-500"><strong>Calle:</strong> {formData.calle_cen || 'No detectada'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Mapa y buscador */}
                    <div className="w-full lg:w-8/12 px-4">
                        <div className="relative w-full mb-4">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Buscador de Direcciones</label>
                            <div className="relative flex w-full flex-wrap items-stretch mb-3">
                                <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input id="buscador-direccion" type="text" className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10" placeholder="Escribe el nombre de un lugar o calle..." />
                            </div>
                        </div>
                        
                        <div className="relative w-full mb-3">
                            <div ref={mapRef} style={{ height: "450px", width: "100%", borderRadius: "8px" }} className="border border-blueGray-300 shadow-lg"></div>
                            <p className="text-xs text-blueGray-400 mt-2 italic text-right">
                                * Arrastra el marcador rojo o haz clic en el mapa para ajustar la ubicación exacta.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Botonera inferior */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
                    <Link to="/admin/centros" className="text-blueGray-500 bg-transparent border border-solid border-blueGray-500 hover:bg-blueGray-500 hover:text-white active:bg-blueGray-600 font-bold uppercase text-xs px-6 py-3 rounded outline-none focus:outline-none ease-linear transition-all duration-150">
                        Cancelar
                    </Link>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`${loading ? 'bg-blueGray-300' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center`}
                    >
                        {loading ? (
                            <><i className="fas fa-spinner fa-spin mr-2"></i> Procesando...</>
                        ) : (
                            <><i className="fas fa-save mr-2"></i> {id ? "Guardar Cambios" : "Registrar Centro"}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CentrosForm;
import React, { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { MapPin, Home, Search, Navigation } from 'lucide-react';

export default function CentroForm({ centro = null, parroquias = [], onSuccess }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const { data, setData, post, put, processing, errors } = useForm({
        nom_cen: centro?.nom_cen || '',
        telf_cen: centro?.telf_cen || '',
        id_par_1: centro?.id_par_1 || '',
        pais_cen: centro?.pais_cen || '',
        ciudad_cen: centro?.ciudad_cen || '',
        provincia_cen: centro?.provincia_cen || '',
        municipio_cen: centro?.municipio_cen || '',
        calle_cen: centro?.calle_cen || '',
        coordenadas_cen: centro?.coordenadas_cen || '-16.5000,-68.1500',
    });

    useEffect(() => {
        if (typeof google === 'undefined') return;

        const initMap = async () => {
            const [lat, lng] = data.coordenadas_cen.split(',').map(Number);
            
            // Importamos las librerías necesarias de forma moderna
            const { Map } = await google.maps.importLibrary("maps");
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
            const { Autocomplete } = await google.maps.importLibrary("places");

            const map = new Map(mapRef.current, {
                center: { lat, lng },
                zoom: 15,
                mapId: "DEMO_MAP_ID", // Requerido para AdvancedMarkerElement
                disableDefaultUI: true,
                zoomControl: true,
            });

            mapInstanceRef.current = map;

            const marker = new AdvancedMarkerElement({
                map: map,
                position: { lat, lng },
                gmpDraggable: true,
                title: "Ubicación del Centro",
            });

            markerRef.current = marker;

            // Configurar Autocomplete
            const input = document.getElementById("search-box-modal");
            const autocomplete = new Autocomplete(input);
            autocomplete.bindTo("bounds", map);

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    map.setCenter(place.geometry.location);
                    marker.position = place.geometry.location;
                    fillAddressFields(place);
                }
            });

            // Evento para arrastrar el marcador (Nuevo formato)
            marker.addListener("dragend", (event) => {
                const pos = marker.position;
                updateCoords(pos);
                reverseGeocode(pos);
            });

            // Clic en el mapa para mover marcador
            map.addListener("click", (e) => {
                marker.position = e.latLng;
                updateCoords(e.latLng);
                reverseGeocode(e.latLng);
            });
        };

        initMap();
    }, []);

    const updateCoords = (latLng) => {
        const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
        const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
        setData('coordenadas_cen', `${lat.toFixed(6)},${lng.toFixed(6)}`);
    };

    const reverseGeocode = (latLng) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) fillAddressFields(results[0]);
        });
    };

    const fillAddressFields = (place) => {
        const comps = place.address_components || [];
        const find = (t) => comps.find(c => c.types.includes(t))?.long_name || '';

        const lat = place.geometry.location?.lat() || data.coordenadas_cen.split(',')[0];
        const lng = place.geometry.location?.lng() || data.coordenadas_cen.split(',')[1];

        setData(prev => ({
            ...prev,
            calle_cen: (place.formatted_address || find("route")).toUpperCase(),
            pais_cen: find("country").toUpperCase(),
            ciudad_cen: find("locality").toUpperCase(),
            provincia_cen: find("administrative_area_level_1").toUpperCase(),
            municipio_cen: find("administrative_area_level_2").toUpperCase(),
            coordenadas_cen: `${lat},${lng}`
        }));
    };

    
    const submit = (e) => {
        e.preventDefault();
        const url = centro ? route('centros.update', centro.id_cen) : route('centros.store');
        
        (centro ? put : post)(url, {
            onSuccess: () => {
                // No necesitas hacer alert() aquí. 
                // Inertia viajará al Index y el useEffect de arriba detectará el flash.
                if (onSuccess) onSuccess();
            },
        });
    };

    const inputStyle = "w-full bg-white dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400";
    const labelStyle = "block text-[9px] font-black uppercase text-slate-400 dark:text-slate-500 ml-2 mb-1 tracking-widest";

    return (
        <form onSubmit={submit} className="p-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* COLUMNA MAPA (Primero en móvil) */}
                <div className="lg:col-span-7 order-first lg:order-1">
                    <div className="relative h-[450px] lg:h-[650px] group">
                        <div className="absolute top-6 left-6 right-6 z-10">
                            <div className="relative shadow-2xl">
                                <div className="absolute inset-y-0 left-5 flex items-center text-slate-400">
                                    <Search size={18} />
                                </div>
                                <input 
                                    id="search-box-modal" 
                                    type="text" 
                                    placeholder="Buscar dirección..." 
                                    className="w-full pl-14 pr-6 py-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-none rounded-3xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-2xl focus:ring-2 focus:ring-indigo-500 transition-all" 
                                />
                            </div>
                        </div>

                        <div ref={mapRef} className="w-full h-full rounded-[3rem] border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden" />
                    </div>
                </div>

                {/* COLUMNA DATOS */}
                <div className="lg:col-span-5 space-y-6 order-last lg:order-2">
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                                <Home size={18} />
                            </div>
                            <h4 className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-200">Info General</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={labelStyle}>Nombre del Centro</label>
                                <input type="text" value={data.nom_cen} onChange={e => setData('nom_cen', e.target.value.toUpperCase())} className={inputStyle} />
                                {errors.nom_cen && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 uppercase italic">{errors.nom_cen}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Teléfono</label>
                                    <input type="text" value={data.telf_cen} onChange={e => setData('telf_cen', e.target.value)} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Parroquia</label>
                                    <select value={data.id_par_1} onChange={e => setData('id_par_1', e.target.value)} className={`${inputStyle} truncate pr-8`}>
                                        <option value="">Seleccionar...</option>
                                        {parroquias.map(p => <option key={p.id_par} value={p.id_par}>{p.nom_par}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <MapPin size={18} />
                            </div>
                            <h4 className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-200">Ubicación</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Ciudad</label>
                                    <input type="text" value={data.ciudad_cen} onChange={e => setData('ciudad_cen', e.target.value.toUpperCase())} className={inputStyle} />
                                </div>
                                <div>
                                    <label className={labelStyle}>Provincia</label>
                                    <input type="text" value={data.provincia_cen} onChange={e => setData('provincia_cen', e.target.value.toUpperCase())} className={inputStyle} />
                                </div>
                            </div>
                            <textarea value={data.calle_cen} onChange={e => setData('calle_cen', e.target.value.toUpperCase())} className={`${inputStyle} h-24 resize-none`} placeholder="Dirección..." />
                        </div>
                    </div>

                    <button type="submit" disabled={processing} className="w-full bg-indigo-600 
                    hover:bg-indigo-700 text-white font-black uppercase text-[11px] tracking-[0.3em] 
                    py-5 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50">
                        {centro ? 'Actualizar Información' : 'Registrar Centro'}
                    </button>
                </div>
            </div>
        </form>
    );
}
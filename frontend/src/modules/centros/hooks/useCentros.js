import { useEffect, useState } from "react";

import centroService from "../services/centroService";

export default function useCentros() {

    const [centros, setCentros] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [showModal, setShowModal] =
        useState(false);

    const [selectedCentro,
        setSelectedCentro] =
        useState(null);

    const [searchQuery,
        setSearchQuery] =
        useState("");

    const [perPage,
        setPerPage] =
        useState(10);

    const [overlay, setOverlay] =
        useState({
            show: false,
            type: "creado"
        });

    const [topAlert, setTopAlert] =
        useState({
            show: false,
            type: "creado",
            message: ""
        });

    useEffect(() => {

        loadCentros();

    }, []);

    const loadCentros = async () => {

        try {

            setLoading(true);

            const data =
                await centroService.getAll();

            setCentros(data);

        } catch (error) {

            console.log(error);

            showErrorAlert(
                "Error al cargar centros"
            );

        } finally {

            setLoading(false);
        }
    };

    const showOverlay = (type) => {

        setOverlay({
            show: true,
            type
        });

        setTimeout(() => {

            setOverlay({
                show: false,
                type
            });

        }, 900);
    };

    const showTopAlert = (
        type,
        message
    ) => {

        setTopAlert({
            show: true,
            type,
            message
        });

        setTimeout(() => {

            setTopAlert({
                show: false,
                type,
                message: ""
            });

        }, 2500);
    };

    const showErrorAlert = (
        message
    ) => {

        setTopAlert({
            show: true,
            type: "error",
            message
        });

        setTimeout(() => {

            setTopAlert({
                show: false,
                type: "error",
                message: ""
            });

        }, 2500);
    };

    const toggleStatus =
        async (centro) => {

            try {

                const nuevoEstado =
                    centro.estado_cen === "activo"
                        ? "inactivo"
                        : "activo";

                await centroService.toggleStatus(
                    centro.id_cen
                );

                setCentros((prev) =>
                    prev.map((item) =>
                        item.id_cen === centro.id_cen
                            ? {
                                ...item,
                                estado_cen: nuevoEstado
                            }
                            : item
                    )
                );

                showOverlay(nuevoEstado);

                showTopAlert(
                    nuevoEstado,
                    nuevoEstado === "activo"
                        ? "Centro activado correctamente"
                        : "Centro desactivado correctamente"
                );

            } catch (error) {

                console.log(error);

                showOverlay("error");

                showErrorAlert(
                    "Error al actualizar estado"
                );
            }
        };

    const openView = (centro) => {

        setSelectedCentro(centro);

        setShowModal(true);
    };

    const cerrarModal = () => {

        setShowModal(false);

        setSelectedCentro(null);
    };

    // =========================
    // FILTRADO BUSCADOR
    // =========================

    const filteredCentros =
        centros.filter((centro) => {

            const query =
                searchQuery.toLowerCase();

            return (

                centro.nom_cen
                    ?.toLowerCase()
                    .includes(query)

                ||

                centro.parroquia_nombre
                    ?.toLowerCase()
                    .includes(query)

                ||

                centro.ciudad_cen
                    ?.toLowerCase()
                    .includes(query)

                ||

                centro.telf_cen
                    ?.toLowerCase()
                    .includes(query)
            );
        });

    return {

        centros,
        filteredCentros,

        loading,

        showModal,
        cerrarModal,

        selectedCentro,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        toggleStatus,

        openView,
    };
}
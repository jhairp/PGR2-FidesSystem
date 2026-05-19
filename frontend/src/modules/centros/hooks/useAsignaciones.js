import { useEffect, useState } from "react";

import detParService
from "../services/detParService";

import api from "../../../api/axios";

export default function useAsignaciones(
    centro
) {

    const [loading, setLoading] =
        useState(true);

    const [personas, setPersonas] =
        useState([]);

    const [asignados, setAsignados] =
        useState([]);

    useEffect(() => {

        if (centro) {

            loadData();
        }

    }, [centro]);

    const loadData = async () => {

        try {

            setLoading(true);

            // PERSONAS
            const personasRes =
                await api.get(
                    "/personas/"
                );

            setPersonas(
                personasRes.data
            );

            // ASIGNADOS
            const asignadosRes =
                await detParService.getByCentro(
                    centro.id_cen
                );

            setAsignados(
                asignadosRes
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // ASIGNAR
    // =========================

    const assignPersona =
    async (personaId) => {

        if (!personaId)
            return;

        try {

            await detParService.create({

                id_per_3: personaId,

                id_cen_1: centro.id_cen,
            });

            await loadData();

        } catch (error) {

            console.log(error);
        }
    };

    // =========================
    // QUITAR
    // =========================

    const removeAsignacion =
        async (id) => {

            try {

                await detParService.delete(
                    id
                );

                await loadData();

            } catch (error) {

                console.log(error);
            }
        };

    return {

        loading,

        personas,
        asignados,

        assignPersona,
        removeAsignacion,
    };
}
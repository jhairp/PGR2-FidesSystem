import { useEffect, useState }
from "react";

import horarioService
from "../services/horarioService";

export default function useHorariosCentro(
    centro
) {

    const [loading, setLoading] =
        useState(true);

    const [horarios, setHorarios] =
        useState([]);

    useEffect(() => {

        if (centro?.id_cen) {

            loadHorarios();
        }

    }, [centro?.id_cen]);

    const loadHorarios =
        async () => {

            try {

                setLoading(true);

                const data =
                    await horarioService.getByCentro(
                        centro.id_cen
                    );

                setHorarios(data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

    return {

        loading,

        horarios,
        setHorarios,

        loadHorarios,
    };
}
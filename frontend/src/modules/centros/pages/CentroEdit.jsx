import { useEffect, useState }
from "react";

import {
    useNavigate,
    useParams
}
from "react-router-dom";

import CentroForm
from "../components/CentroForm";

import centroService
from "../services/centroService";

import PageHeader
from "../../../components/ui/PageHeader";

export default function CentroEdit() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    const [centro, setCentro] =
        useState(null);

    useEffect(() => {

        loadCentro();

    }, []);

    const loadCentro = async () => {

        try {

            const data =
                await centroService.getById(id);

            setCentro(data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (

            <div className="p-10">
                Cargando...
            </div>
        );
    }

    return (

        <div className="space-y-8">

            <PageHeader
                title="Editar Centro"
                subtitle="Actualizar información"
            />

            <CentroForm
                initialData={centro}
                centroId={id}
            />

        </div>
    );
}
import { useNavigate }
from "react-router-dom";

import CentroForm
from "../components/CentroForm";

import PageHeader
from "../../../components/ui/PageHeader";

export default function CentroCreate() {

    const navigate = useNavigate();

    return (

        <div className="space-y-8">

            <PageHeader
                title="Nuevo Centro"
                subtitle="Registrar nuevo centro parroquial"
            />

            <CentroForm
                onSuccess={() =>
                    navigate("/centros")
                }
            />

        </div>
    );
}
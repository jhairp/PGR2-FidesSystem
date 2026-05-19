import { useState } from "react";

import { useNavigate } from "react-router-dom";

import useCentros from "../hooks/useCentros";

import CentroTable from "../components/CentroTable";
import CentroModal from "../components/AsignarPersonalModal";
import CentroViewCard from "../components/CentroViewCard";

import TableControls
from "../../../components/ui/TableControls";

import ActionOverlay
from "../../../components/ui/ActionOverlay";

import TopAlert
from "../../../components/ui/TopAlert";

import PageHeader
from "../../../components/ui/PageHeader";

import AsignarPersonalModal
from "../components/AsignarPersonalModal";

import {
    CreateButton,
    ReportButton,
} from "../../../components/ui/Buttons";

export default function CentrosIndex() {

    const navigate = useNavigate();

    const centrosHook = useCentros();

    const [showAssignModal,
        setShowAssignModal] =
        useState(false);

    const [selectedCentroAssign,
        setSelectedCentroAssign] =
        useState(null);

    const handleOpenAssign =
        (centro) => {

            setSelectedCentroAssign(
                centro
            );

            setShowAssignModal(true);
        };

    const handleCloseAssign =
        () => {

            setShowAssignModal(false);

            setSelectedCentroAssign(
                null
            );
        };
    const {

        filteredCentros,
        loading,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        toggleStatus,

        selectedCentro,

        showModal,
        cerrarModal,

    } = centrosHook;

    if (loading) {

        return <div>Cargando...</div>;
    }

    return (

        <div>

            <ActionOverlay
                isVisible={overlay.show}
                type={overlay.type}
            />

            <TopAlert
                show={topAlert.show}
                type={topAlert.type}
                message={topAlert.message}
            />

            <PageHeader
                title="Centros"
                subtitle="Gestión de Centros"

                actions={
                    <>

                        <ReportButton />

                        <CreateButton
                            onClick={() =>
                                navigate(
                                    "/centros/create"
                                )
                            }
                        >
                            Nuevo Centro
                        </CreateButton>

                    </>
                }
            />

            <TableControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                perPage={perPage}
                setPerPage={setPerPage}
            />

            <CentroTable
                centros={filteredCentros}
                toggleStatus={toggleStatus}

                onEdit={(centro) =>
                    navigate(
                        `/centros/edit/${centro.id_cen}`
                    )
                }

                onAssign={handleOpenAssign}

                onSchedule={(centro) =>
                    navigate(
                        `/centros/${centro.id_cen}/horarios`
                    )
                }
            />

            <AsignarPersonalModal

                show={showAssignModal}

                onClose={handleCloseAssign}

                centro={selectedCentroAssign}
            />

            <CentroModal
                show={showModal}
                onClose={cerrarModal}
            >

                <CentroViewCard
                    centro={selectedCentro}
                />

            </CentroModal>

        </div>
    );
}
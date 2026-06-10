import useBautizos from '../hooks/useBautizos'

import BautizoTable from '../components/BautizoTable'

import BautizoModal from '../components/BautizoModal'

import BautizoViewCard from '../components/BautizoViewCard'

import TableControls from '../../../components/ui/TableControls'

import ActionOverlay from '../../../components/ui/ActionOverlay'

import TopAlert from '../../../components/ui/TopAlert'

import PageHeader from '../../../components/ui/PageHeader'

import BautizoCreateModal from '../components/BautizoCreateModal'

import BautizoEditModal
from '../components/BautizoEditModal'

import ScannerModal from '../../scanner/components/ScannerModal'

import {
    CreateButton,
    ReportButton,
} from '../../../components/ui/Buttons'

import { ScanLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BautizosIndex() {

    const bautizosHook = useBautizos()
    const navigate = useNavigate()

    const {

        bautizos,
        loading,

        showModal,
        abrirModal,
        cerrarModal,

        showCreateModal,
        abrirCreateModal,
        cerrarCreateModal,

        createBautizo,

        saving,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        toggleStatus,

        openView,
        selectedBautizo,

        centros,
        usuarios,

        showEditModal,
        editingBautizo,

        openEdit,
        closeEdit,

        updateBautizo,

        showScannerModal,
        abrirScannerModal,
        cerrarScannerModal,

    } = bautizosHook


    if (loading) {

        return <div>Cargando...</div>
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
                title="Bautizos"
                subtitle="Gestión de Bautizos"

                actions={
                    <>
                        <ReportButton />

                        <button
                            onClick={abrirScannerModal}
                            className="
                                px-6 py-3
                                rounded-2xl
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                font-bold
                                flex items-center gap-2
                                transition-all
                            "
                        >
                            <ScanLine size={18} />
                            Escanear
                        </button>

                        <CreateButton
                            onClick={abrirCreateModal}
                        >
                            Nuevo Bautizo
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

            <BautizoTable
                bautizos={bautizos}

                toggleStatus={toggleStatus}

                onView={openView}
                onEdit={openEdit}
            />

            <BautizoModal
                show={showModal}
                onClose={cerrarModal}
            >

                <BautizoViewCard
                    bautizo={selectedBautizo}
                    onClose={cerrarModal}
                />

            </BautizoModal>

            <BautizoCreateModal
                show={showCreateModal}
                onClose={cerrarCreateModal}
                onSubmit={createBautizo}
                loading={saving}

                centros={centros}
                usuarios={usuarios}
            />

            <BautizoEditModal

                show={showEditModal}

                onClose={closeEdit}

                onSubmit={updateBautizo}

                loading={saving}

                bautizo={editingBautizo}

                usuarios={usuarios}

            />
            <ScannerModal

                show={showScannerModal}

                onClose={cerrarScannerModal}

                createBautizo={createBautizo}

                usuarios={usuarios}

                centros={centros}

                loading={saving}

            />

        </div>
    )
}
import useUsuarios from '../hooks/useUsuarios'
import UsuarioTable from '../components/UsuarioTable'
import UsuarioModal from '../components/UsuarioModal'
import UsuarioViewCard from '../components/UsuarioViewCard'
import TableControls from '../../../components/ui/TableControls'
import ActionOverlay from '../../../components/ui/ActionOverlay'
import TopAlert from '../../../components/ui/TopAlert'
import PageHeader from '../../../components/ui/PageHeader'
import {
    CreateButton,
    ReportButton,
} from '../../../components/ui/Buttons'

export default function UsuariosIndex() {

    const usuariosHook = useUsuarios()

    const {

        usuarios,
        loading,

        showModal,
        abrirModal,
        cerrarModal,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        toggleStatus,

        openView,
        selectedUser,

    } = usuariosHook

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
                title="Usuarios"
                subtitle="Gestión de Usuarios"

                actions={
                    <>

                        <ReportButton />

                        <CreateButton
                            onClick={abrirModal}
                        >
                            Nuevo Usuario
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

            <UsuarioTable
                usuarios={usuarios}
                toggleStatus={toggleStatus}
                onView={openView}
            />

            <UsuarioModal
                show={showModal}
                onClose={cerrarModal}
            >

                <UsuarioViewCard
                    user={selectedUser}
                    onClose={cerrarModal}
                />

            </UsuarioModal>

        </div>
    )
}
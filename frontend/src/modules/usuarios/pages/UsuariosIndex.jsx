import useUsuarios from '../hooks/useUsuarios'
import UsuarioTable from '../components/UsuarioTable'
import UsuarioModal from '../components/UsuarioModal'
import UsuarioViewCard from '../components/UsuarioViewCard'
import UserCardForm from '../components/UserCardForm'
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
        modalMode,
        cerrarModal,

        abrirCrear,
        abrirEditar,
        openView,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,

        perPage,
        setPerPage,

        toggleStatus,

        roles,
        formData,
        setData,
        errors,
        processing,
        handleSubmit,

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
                            onClick={abrirCrear}
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
                onEdit={abrirEditar}
            />

            <UsuarioModal
                show={showModal}
                onClose={cerrarModal}
            >

                {modalMode === 'view' ? (

                    <UsuarioViewCard
                        user={selectedUser}
                        onClose={cerrarModal}
                    />

                ) : (

                    <UserCardForm
                        data={formData}
                        setData={setData}
                        errors={errors}
                        roles={roles}
                        isEditing={modalMode === 'edit'}
                        submit={handleSubmit}
                        processing={processing}
                        isViewOnly={false}
                    />

                )}

            </UsuarioModal>

        </div>
    )
}
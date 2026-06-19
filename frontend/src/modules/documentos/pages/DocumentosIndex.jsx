import useDocumentos from '../hooks/useDocumentos'

import DocumentoTable        from '../components/DocumentoTable'
import DocumentoCreateModal  from '../components/DocumentoCreateModal'
import DocumentoEditModal    from '../components/DocumentoEditModal'
import DocumentoViewModal    from '../components/DocumentoViewModal'
import DocumentoDeleteConfirm from '../components/DocumentoDeleteConfirm'
import DocumentoEstadoModal  from '../components/DocumentoEstadoModal'

import PageHeader    from '../../../components/ui/PageHeader'
import TableControls from '../../../components/ui/TableControls'
import ActionOverlay from '../../../components/ui/ActionOverlay'
import TopAlert      from '../../../components/ui/TopAlert'

import { CreateButton } from '../../../components/ui/Buttons'

export default function DocumentosIndex() {

    const {
        documentos,
        sacramentos,
        loading,
        saving,

        overlay,
        topAlert,

        searchQuery,
        setSearchQuery,
        perPage,
        setPerPage,

        showCreateModal,
        abrirCreateModal,
        cerrarCreateModal,

        showEditModal,
        editingDoc,
        openEdit,
        closeEdit,

        showViewModal,
        viewingDoc,
        openView,
        cerrarView,

        showDeleteConfirm,
        confirmarEliminar,
        cerrarConfirmar,

        showEstadoModal,
        estadoDoc,
        openEstado,
        closeEstado,

        createDocumento,
        updateDocumento,
        cambiarEstado,
        eliminarDocumento,
    } = useDocumentos()

    if (loading) return <div>Cargando...</div>

    return (
        <div>

            {/* Feedback global */}
            <ActionOverlay
                isVisible={overlay.show}
                type={overlay.type}
            />

            <TopAlert
                show={topAlert.show}
                type={topAlert.type}
                message={topAlert.message}
            />

            {/* Cabecera — igual que Bautizos */}
            <PageHeader
                title="Documentos"
                subtitle="Gestión de Documentos Sacramentales"
                actions={
                    <CreateButton onClick={abrirCreateModal}>
                        Subir Documento
                    </CreateButton>
                }
            />

            {/* Buscador + paginación */}
            <TableControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                perPage={perPage}
                setPerPage={setPerPage}
            />

            {/* Tabla */}
            <DocumentoTable
                documentos={documentos}
                onView={openView}
                onEdit={openEdit}
                onDelete={confirmarEliminar}
                onEstado={openEstado}
            />

            {/* Modal: Ver */}
            <DocumentoViewModal
                show={showViewModal}
                onClose={cerrarView}
                documento={viewingDoc}
            />

            {/* Modal: Crear */}
            <DocumentoCreateModal
                show={showCreateModal}
                onClose={cerrarCreateModal}
                onSubmit={createDocumento}
                loading={saving}
                sacramentos={sacramentos}
            />

            {/* Modal: Editar */}
            <DocumentoEditModal
                show={showEditModal}
                onClose={closeEdit}
                onSubmit={updateDocumento}
                loading={saving}
                documento={editingDoc}
                sacramentos={sacramentos}
            />

            {/* Modal: Estado */}
            <DocumentoEstadoModal
                show={showEstadoModal}
                onClose={closeEstado}
                onSubmit={cambiarEstado}
                loading={saving}
                documento={estadoDoc}
            />

            {/* Confirmar eliminar */}
            <DocumentoDeleteConfirm
                show={showDeleteConfirm}
                onClose={cerrarConfirmar}
                onConfirm={eliminarDocumento}
            />

        </div>
    )
}

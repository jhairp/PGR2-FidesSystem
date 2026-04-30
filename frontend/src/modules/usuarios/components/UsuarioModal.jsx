import Modal from '../../../components/ui/Modal'

export default function UsuarioModal({
    show,
    onClose,
    children,
}) {

    return (

        <Modal
            show={show}
            onClose={onClose}
            maxWidth="4xl"
            padding={false}
        >
            {children}
        </Modal>
    )
}
import Modal from '../../../components/ui/Modal'

export default function BautizoModal({

    show,
    onClose,
    children

}) {

    return (

        <Modal
            show={show}
            onClose={onClose}
        >

            {children}

        </Modal>
    )
}
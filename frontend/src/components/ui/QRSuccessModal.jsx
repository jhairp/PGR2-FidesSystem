import Modal from "./Modal";

export default function QRSuccessModal({

    show,
    onClose,

}) {

    return (

        <Modal
            show={show}
            onClose={onClose}
            maxWidth="md"
            padding={false}
        >

            <div
                className="
                    bg-white
                    dark:bg-[#071224]

                    rounded-[2.5rem]

                    p-10

                    text-center

                    transition-colors
                    duration-300
                "
            >

                {/* TITULO */}

                <h2
                    className="
                        text-3xl
                        font-black

                        text-slate-800
                        dark:text-white

                        mb-3
                    "
                >

                    Reserva Confirmada

                </h2>

                <p
                    className="
                        text-slate-500
                        dark:text-slate-400

                        font-semibold

                        mb-8
                    "
                >

                    Escanea el código QR
                    para continuar

                </p>

                {/* QR */}

                <div
                    className="
                        flex
                        justify-center
                    "
                >

                    <img

                        src="/images/general/QR.png"

                        alt="QR"

                        className="
                            w-64
                            h-64

                            object-contain

                            rounded-3xl

                            shadow-2xl
                        "
                    />

                </div>

            </div>

        </Modal>
    );
}
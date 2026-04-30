export default function UsuarioForm({
    formData,
    handleChange,
    handleSubmit,
}) {

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                    type="text"
                    name="nom_per"
                    placeholder="Nombres"
                    value={formData.nom_per}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border"
                />

                <input
                    type="text"
                    name="ap_pat_per"
                    placeholder="Apellido Paterno"
                    value={formData.ap_pat_per}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border"
                />

                <input
                    type="text"
                    name="ap_mat_per"
                    placeholder="Apellido Materno"
                    value={formData.ap_mat_per}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border"
                />

                <input
                    type="text"
                    name="carnet_per"
                    placeholder="Carnet"
                    value={formData.carnet_per}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border"
                />

                <input
                    type="email"
                    name="correo_usu"
                    placeholder="Correo"
                    value={formData.correo_usu}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border"
                />

                <input
                    type="text"
                    name="cel_per"
                    placeholder="Celular"
                    value={formData.cel_per}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl border"
                />

            </div>

            <button
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest"
            >
                Guardar Usuario
            </button>

        </form>
    )
}
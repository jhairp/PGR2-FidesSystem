import { useEffect, useState } from 'react'

export default function ScannerForm({

    datosOCR,

    textoOCR,

    usuarios = [],

    centros=[],

    onGuardar,

    loading = false

}) {

    const [form, setForm] = useState({

        nom_lai: '',
        ap_pat_lai: '',
        ap_mat_lai: '',

        fecha_nac_lai: '',

        lugar_nac_lai: '',

        genero_lai: 'Masculino',

        estado_civ_lai: 'Soltero',

        domicilio_lai: '',

        nom_p_lai: '',
        ap_pat_p_lai: '',
        ap_mat_p_lai: '',

        nom_m_lai: '',
        ap_pat_m_lai: '',
        ap_mat_m_lai: '',

        fecha_sac: '',

        id_cen_2: 1,

        nom_pad_1_sac: '',
        gen_pad_1_sac: 'Masculino',

        nom_pad_2_sac: '',
        gen_pad_2_sac: 'Femenino',

        num_lib: '',
        pag_lib: '',
        par_lib: '',

        sacerdote_celebrante: '',
        sacerdote_certificador: '',
    })

    useEffect(() => {

        if (!datosOCR) return

        // Filtrar campos null/undefined para no romper inputs controlados
        const datosFiltrados = Object.fromEntries(
            Object.entries(datosOCR).filter(([, v]) => v !== null && v !== undefined)
        )

        setForm(prev => ({

            ...prev,

            ...datosFiltrados,

            fecha_sac: datosOCR.fecha_bautizo || prev.fecha_sac,

            par_lib: datosOCR.num_partida || prev.par_lib

        }))

    }, [datosOCR])

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]:
                e.target.value
        })
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        onGuardar(form)
    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            <h2 className="
                text-2xl
                font-black
            ">
                Datos Detectados
            </h2>

            <Grid>

                <Field
                    label="Nombres"
                    name="nom_lai"
                    value={form.nom_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Apellido Paterno"
                    name="ap_pat_lai"
                    value={form.ap_pat_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Apellido Materno"
                    name="ap_mat_lai"
                    value={form.ap_mat_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Fecha Nacimiento"
                    type="date"
                    name="fecha_nac_lai"
                    value={form.fecha_nac_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Lugar Nacimiento"
                    name="lugar_nac_lai"
                    value={form.lugar_nac_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Domicilio"
                    name="domicilio_lai"
                    value={form.domicilio_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Nombre Padre"
                    name="nom_p_lai"
                    value={form.nom_p_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Ap. Padre"
                    name="ap_pat_p_lai"
                    value={form.ap_pat_p_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Ap. Materno Padre"
                    name="ap_mat_p_lai"
                    value={form.ap_mat_p_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Nombre Madre"
                    name="nom_m_lai"
                    value={form.nom_m_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Ap. Madre"
                    name="ap_pat_m_lai"
                    value={form.ap_pat_m_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Ap. Materno Madre"
                    name="ap_mat_m_lai"
                    value={form.ap_mat_m_lai}
                    onChange={handleChange}
                />

                <Field
                    label="Padrino"
                    name="nom_pad_1_sac"
                    value={form.nom_pad_1_sac}
                    onChange={handleChange}
                />

                <Field
                    label="Madrina"
                    name="nom_pad_2_sac"
                    value={form.nom_pad_2_sac}
                    onChange={handleChange}
                />

                <Field
                    label="Fecha Bautizo"
                    type="date"
                    name="fecha_sac"
                    value={form.fecha_sac}
                    onChange={handleChange}
                />

                <Field
                    label="Libro"
                    name="num_lib"
                    value={form.num_lib}
                    onChange={handleChange}
                />

                <Field
                    label="Página"
                    name="pag_lib"
                    value={form.pag_lib}
                    onChange={handleChange}
                />

                <Field
                    label="Partida"
                    name="par_lib"
                    value={form.par_lib}
                    onChange={handleChange}
                />

            </Grid>

            <div>

                <label className="
                    block
                    mb-2
                    font-bold
                ">
                    Centro Parroquial
                </label>

                <select

                    name="id_cen_2"

                    value={form.id_cen_2}

                    onChange={handleChange}

                    className="
                        w-full
                        px-4 py-3
                        rounded-xl
                        border
                    "
                >

                    {centros.map((centro) => (

                        <option

                            key={centro.id_cen}

                            value={centro.id_cen}

                        >

                            {centro.nom_cen}

                        </option>

                    ))}

                </select>

            </div>
            <div className="
                grid
                md:grid-cols-2
                gap-4
            ">

                <div>

                    <label className="
                        block
                        mb-2
                        font-bold
                    ">
                        Sacerdote Celebrante
                    </label>

                    <select

                        name="sacerdote_celebrante"

                        value={form.sacerdote_celebrante}

                        onChange={handleChange}

                        className="
                            w-full
                            px-4 py-3
                            rounded-xl
                            border
                        "
                    >

                        <option value="">
                            Seleccionar
                        </option>

                        {usuarios.map(user => (

                            <option
                                key={user.id_usu}
                                value={user.persona.id_per}
                            >
                                {user.persona.nom_per}
                                {' '}
                                {user.persona.ap_pat_per}
                            </option>

                        ))}

                    </select>

                </div>

                <div>

                    <label className="
                        block
                        mb-2
                        font-bold
                    ">
                        Sacerdote Certificador
                    </label>

                    <select

                        name="sacerdote_certificador"

                        value={form.sacerdote_certificador}

                        onChange={handleChange}

                        className="
                            w-full
                            px-4 py-3
                            rounded-xl
                            border
                        "
                    >

                        <option value="">
                            Seleccionar
                        </option>

                        {usuarios.map(user => (

                            <option
                                key={user.id_usu}
                                value={user.persona.id_per}
                            >
                                {user.persona.nom_per}
                                {' '}
                                {user.persona.ap_pat_per}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            <button

                type="submit"

                disabled={loading}

                className="
                    w-full

                    py-4

                    rounded-2xl

                    bg-indigo-600

                    text-white

                    font-black
                "
            >

                Registrar Bautizo

            </button>

        </form>
    )
}

function Grid({ children }) {

    return (

        <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-4
        ">
            {children}
        </div>
    )
}

function Field({

    label,
    ...props

}) {

    return (

        <div>

            <label className="
                block
                mb-2

                text-sm
                font-bold
            ">
                {label}
            </label>

            <input

                {...props}

                className="
                    w-full

                    px-4 py-3

                    rounded-xl

                    border
                "
            />

        </div>
    )
}
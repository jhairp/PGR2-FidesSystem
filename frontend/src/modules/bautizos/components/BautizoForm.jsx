import { useState } from 'react'

export default function BautizoForm({

    onSubmit,
    initialData = {},
    loading = false,

    centros = [],
    usuarios = [],

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

        ...initialData
    })

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        onSubmit(form)
    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-14"
        >

            {/* ====================================== */}
            {/* DATOS DEL BAUTIZADO */}
            {/* ====================================== */}

            <Section title="Datos del Bautizado">

                <Grid columns={3}>

                    <Input
                        name="nom_lai"
                        placeholder="Nombres"
                        value={form.nom_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="ap_pat_lai"
                        placeholder="Apellido Paterno"
                        value={form.ap_pat_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="ap_mat_lai"
                        placeholder="Apellido Materno"
                        value={form.ap_mat_lai}
                        onChange={handleChange}
                    />

                    <Input
                        type="date"
                        name="fecha_nac_lai"
                        value={form.fecha_nac_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="lugar_nac_lai"
                        placeholder="Lugar de Nacimiento"
                        value={form.lugar_nac_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="domicilio_lai"
                        placeholder="Domicilio"
                        value={form.domicilio_lai}
                        onChange={handleChange}
                    />

                </Grid>

            </Section>

            {/* ====================================== */}
            {/* PADRES */}
            {/* ====================================== */}

            <Section title="Padres">

                <Grid columns={3}>

                    <Input
                        name="nom_p_lai"
                        placeholder="Nombre del Padre"
                        value={form.nom_p_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="ap_pat_p_lai"
                        placeholder="Apellido Paterno Padre"
                        value={form.ap_pat_p_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="ap_mat_p_lai"
                        placeholder="Apellido Materno Padre"
                        value={form.ap_mat_p_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="nom_m_lai"
                        placeholder="Nombre de la Madre"
                        value={form.nom_m_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="ap_pat_m_lai"
                        placeholder="Apellido Paterno Madre"
                        value={form.ap_pat_m_lai}
                        onChange={handleChange}
                    />

                    <Input
                        name="ap_mat_m_lai"
                        placeholder="Apellido Materno Madre"
                        value={form.ap_mat_m_lai}
                        onChange={handleChange}
                    />

                </Grid>

            </Section>

            {/* ====================================== */}
            {/* SACRAMENTO */}
            {/* ====================================== */}

            <Section title="Sacramento">

                <Grid columns={3}>

                    <Input
                        type="date"
                        name="fecha_sac"
                        value={form.fecha_sac}
                        onChange={handleChange}
                    />

                    <input
                        type="hidden"
                        name="id_cen_2"
                        value="1"
                    />

                    <Select
                        name="genero_lai"
                        value={form.genero_lai}
                        onChange={handleChange}
                    >

                        <option value="Masculino">
                            Masculino
                        </option>

                        <option value="Femenino">
                            Femenino
                        </option>

                    </Select>

                </Grid>

            </Section>

            {/* ====================================== */}
            {/* PADRINOS */}
            {/* ====================================== */}

            <Section title="Padrinos">

                <Grid columns={2}>

                    <Input
                        name="nom_pad_1_sac"
                        placeholder="Padrino"
                        value={form.nom_pad_1_sac}
                        onChange={handleChange}
                    />

                    <Input
                        name="nom_pad_2_sac"
                        placeholder="Madrina"
                        value={form.nom_pad_2_sac}
                        onChange={handleChange}
                    />

                </Grid>

            </Section>

            {/* ====================================== */}
            {/* LIBRO SACRAMENTAL */}
            {/* ====================================== */}

            <Section title="Libro Sacramental">

                <Grid columns={3}>

                    <Input
                        name="num_lib"
                        placeholder="Libro"
                        value={form.num_lib}
                        onChange={handleChange}
                    />

                    <Input
                        name="pag_lib"
                        placeholder="Página"
                        value={form.pag_lib}
                        onChange={handleChange}
                    />

                    <Input
                        name="par_lib"
                        placeholder="Partida"
                        value={form.par_lib}
                        onChange={handleChange}
                    />

                </Grid>

            </Section>

            {/* ====================================== */}
            {/* SACERDOTES */}
            {/* ====================================== */}

            <Section title="Sacerdotes">

                <Grid columns={2}>

                    <Select
                        name="sacerdote_celebrante"
                        value={form.sacerdote_celebrante}
                        onChange={handleChange}
                    >

                        <option value="">
                            Sacerdote Celebrante
                        </option>

                        {usuarios.map((user) => (

                            <option
                                key={user.id_usu}
                                value={user.id_usu}
                            >

                                {user.persona?.nom_per}
                                {' '}
                                {user.persona?.ap_pat_per}

                            </option>

                        ))}

                    </Select>

                    <Select
                        name="sacerdote_certificador"
                        value={form.sacerdote_certificador}
                        onChange={handleChange}
                    >

                        <option value="">
                            Sacerdote Certificador
                        </option>

                        {usuarios.map((user) => (

                            <option
                                key={user.id_usu}
                                value={user.id_usu}
                            >

                                {user.persona?.nom_per}
                                {' '}
                                {user.persona?.ap_pat_per}

                            </option>

                        ))}

                    </Select>

                </Grid>

            </Section>

            {/* BOTÓN */}

            <div className="
                flex justify-end
                pt-6
            ">

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        px-12 py-5

                        rounded-2xl

                        bg-indigo-600
                        hover:bg-indigo-700

                        text-white

                        font-black
                        uppercase

                        tracking-[0.2em]
                        text-xs

                        transition-all

                        shadow-xl shadow-indigo-500/20
                    "
                >

                    {
                        loading
                            ? 'Guardando...'
                            : 'Registrar Bautizo'
                    }

                </button>

            </div>

        </form>
    )
}

/* ====================================== */
/* COMPONENTES AUX */
/* ====================================== */

function Section({

    title,
    children

}) {

    return (

        <div className="space-y-7">

            <div className="
                flex items-center gap-4
            ">

                <div className="
                    w-2 h-9
                    rounded-full
                    bg-indigo-600
                " />

                <h2 className="
                    text-2xl
                    font-black

                    uppercase

                    tracking-[0.15em]

                    text-slate-700
                    dark:text-white
                ">

                    {title}

                </h2>

            </div>

            {children}

        </div>
    )
}

function Grid({

    children,
    columns = 2

}) {

    const cols = {

        1: 'xl:grid-cols-1',

        2: 'xl:grid-cols-2',

        3: 'xl:grid-cols-3',

        4: 'xl:grid-cols-4',
    }

    return (

        <div className={`
            grid
            grid-cols-1
            md:grid-cols-2
            ${cols[columns]}
            gap-7
        `}>

            {children}

        </div>
    )
}

function Input(props) {

    return (

        <input
            {...props}
            className="
                w-full

                px-6 py-5

                rounded-2xl

                border border-slate-200
                dark:border-slate-700

                bg-slate-50/70
                dark:bg-slate-900/50

                text-slate-700
                dark:text-white

                text-sm
                font-semibold

                outline-none

                transition-all

                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
            "
        />
    )
}

function Select({

    children,
    ...props

}) {

    return (

        <select
            {...props}
            className="
                w-full

                px-6 py-5

                rounded-2xl

                border border-slate-200
                dark:border-slate-700

                bg-slate-50/70
                dark:bg-slate-900/50

                text-slate-700
                dark:text-white

                text-sm
                font-semibold

                outline-none

                transition-all

                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-500/10
            "
        >

            {children}

        </select>
    )
}
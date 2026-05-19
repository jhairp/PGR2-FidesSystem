export default function CentroViewCard({
    centro
}) {

    if (!centro) return null;

    return (

        <div className="space-y-4">

            <div>

                <h2
                    className="
                        text-2xl
                        font-bold
                    "
                >
                    {centro.nom_cen}
                </h2>

                <p className="text-slate-500">
                    {
                        centro.parroquia_nombre
                    }
                </p>

            </div>

            <div
                className="
                    grid
                    grid-cols-2
                    gap-4
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        Ciudad
                    </p>

                    <p>
                        {centro.ciudad_cen}
                    </p>

                </div>

                <div>

                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        Municipio
                    </p>

                    <p>
                        {
                            centro.municipio_cen
                        }
                    </p>

                </div>

                <div>

                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        Provincia
                    </p>

                    <p>
                        {
                            centro.provincia_cen
                        }
                    </p>

                </div>

                <div>

                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        País
                    </p>

                    <p>
                        {centro.pais_cen}
                    </p>

                </div>

            </div>

            <div>

                <p
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    Dirección
                </p>

                <p>
                    {centro.calle_cen}
                </p>

            </div>

            <div>

                <p
                    className="
                        text-sm
                        text-slate-500
                    "
                >
                    Coordenadas
                </p>

                <p>
                    {
                        centro.coordenadas_cen
                    }
                </p>

            </div>

        </div>
    );
}
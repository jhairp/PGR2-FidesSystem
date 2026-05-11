export default function BautizoViewCard({

    bautizo

}) {

    if (!bautizo) return null

    return (

        <div className="space-y-4">

            <h2 className="text-2xl font-bold">

                Detalle del Bautizo

            </h2>

            <div>

                <strong>Bautizado:</strong>

                {' '}

                {bautizo.bautizado}

            </div>

            <div>

                <strong>Fecha:</strong>

                {' '}

                {bautizo.fecha_sac}

            </div>

            <div>

                <strong>Centro:</strong>

                {' '}

                {bautizo.centro}

            </div>

            <div>

                <strong>Libro:</strong>

                {' '}

                {bautizo.libro}

            </div>

            <div>

                <strong>Estado:</strong>

                {' '}

                {bautizo.estado_sac}

            </div>

        </div>
    )
}
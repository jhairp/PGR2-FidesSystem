export default function LibroSacramentalCard({

    libro,
    pagina,
    partida

}) {

    return (

        <div className="border rounded-xl p-4">

            <h3 className="font-bold mb-2">

                Libro Sacramental

            </h3>

            <p>
                Libro: {libro}
            </p>

            <p>
                Página: {pagina}
            </p>

            <p>
                Partida: {partida}
            </p>

        </div>
    )
}
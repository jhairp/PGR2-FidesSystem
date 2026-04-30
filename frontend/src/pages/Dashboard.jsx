export default function Dashboard() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white">
          Dashboard
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Bienvenido al Sistema Parroquial
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white dark:bg-[#11141D] rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400 uppercase font-bold">
            Usuarios
          </p>

          <h2 className="text-4xl font-black mt-4 dark:text-white">
            120
          </h2>
        </div>

        <div className="bg-white dark:bg-[#11141D] rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400 uppercase font-bold">
            Centros
          </p>

          <h2 className="text-4xl font-black mt-4 dark:text-white">
            15
          </h2>
        </div>

      </div>

    </div>
  )
}
export default function PageHeader({
    title,
    subtitle,
    actions,
}) {

    return (

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-4">

            <div>

                <h1 className="text-4xl font-black dark:text-white uppercase tracking-tighter text-indigo-600">

                    {title}

                </h1>

                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 ml-1">

                    {subtitle}

                </p>

            </div>

            <div className="flex gap-3">

                {actions}

            </div>

        </header>
    )
}
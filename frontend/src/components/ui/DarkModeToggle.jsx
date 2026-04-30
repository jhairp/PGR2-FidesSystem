import { Sun, Moon } from 'lucide-react';

export default function DarkModeToggle({ isDark }) {
    return (
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 transition-all">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </div>
    );
}

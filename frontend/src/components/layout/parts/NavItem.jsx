import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavItem({ href, icon, label, active, onClick }) {
    return (
        <Link to={href} onClick={onClick} className="block group">
            <motion.div 
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300
                    ${active 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/25 font-bold' 
                        : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
                `}
            >
                <span className={`transition-colors duration-300 ${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                    {icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                    {label}
                </span>
                {active && (
                    <motion.div layoutId="activeIndicator" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
            </motion.div>
        </Link>
    );
}
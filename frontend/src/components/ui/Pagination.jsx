import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mt-8 pb-8">
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all active:scale-90 ${
                        currentPage === i + 1 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                        : 'bg-white dark:bg-[#11141D] text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-800'
                    }`}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
}
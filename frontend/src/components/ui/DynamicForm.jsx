import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DynamicForm({ fields, data, setData, errors, processing, submitText }) {
    
    // Clases base para inputs y selects
    const baseInputClasses = `w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-5 font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all focus:ring-2 disabled:opacity-50`;

    return (
        <div className="space-y-6">
            {fields.map((field) => (
                <div key={field.name} className="space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-2">
                        {field.label}
                    </label>

                    {field.type === 'select' ? (
                        <select
                            value={data[field.name] || ''}
                            disabled={processing}
                            className={`${baseInputClasses} appearance-none ${
                                errors[field.name] ? 'ring-2 ring-rose-500' : 'focus:ring-indigo-500'
                            }`}
                            onChange={e => setData(field.name, e.target.value)}
                        >
                            <option value="" className="dark:bg-slate-900">Seleccione una opción</option>
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value} className="dark:bg-slate-900">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input 
                            type={field.type || 'text'} 
                            value={data[field.name] || ''} 
                            placeholder={field.placeholder}
                            disabled={processing}
                            className={`${baseInputClasses} ${
                                 errors[field.name] ? 'ring-2 ring-rose-500' : 'focus:ring-indigo-500'
                            }`}
                            onChange={e => setData(field.name, e.target.value)}
                        />
                    )}

                    {errors[field.name] && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1 mt-1 ml-2 text-rose-500 font-black text-[10px] uppercase"
                        >
                            <AlertCircle size={14} /> {errors[field.name]}
                        </motion.div>
                    )}
                </div>
            ))}

            <motion.button 
                type="submit" 
                disabled={processing}
                whileHover={{ scale: processing ? 1 : 1.01 }}
                whileTap={{ scale: processing ? 1 : 0.98 }}
                className={`w-full p-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl 
                    ${processing 
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                    }`}
            >
                {processing ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Procesando datos...
                    </>
                ) : (
                    submitText
                )}
            </motion.button>
        </div>
    );
}
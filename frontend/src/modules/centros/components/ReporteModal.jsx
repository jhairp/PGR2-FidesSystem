import React from 'react';
import Modal from '@/Components/UI/Modal'; 
import { FileText } from 'lucide-react';

export default function ReporteModal({ show, onClose, pdfUrl }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="5xl">
            <div className="flex flex-col h-[85vh] bg-slate-50 dark:bg-[#0F1117] overflow-hidden rounded-2xl">
                
                {/* Cabecera Minimalista */}
                <div className="flex items-center justify-between p-5 bg-white dark:bg-[#161922] border-b dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tighter text-slate-700 dark:text-slate-200">
                                Vista Previa del Documento
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Reporte de Centros
                            </p>
                        </div>
                    </div>
                    {/* Eliminamos el div de botones aquí para limpieza total */}
                </div>
                
                {/* Cuerpo del Reporte */}
                <div className="flex-1 relative bg-slate-100 dark:bg-slate-950 p-4">
                    {pdfUrl ? (
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border dark:border-slate-800">
                            <iframe 
                                src={`${pdfUrl}#toolbar=0`} 
                                className="w-full h-full border-none"
                                title="Visor de Reporte"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={24} />
                            </div>
                            <div className="text-center">
                                <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">
                                    Generando Documento
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
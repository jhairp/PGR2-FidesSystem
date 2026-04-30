import React from 'react';
import Modal from '@/Components/UI/Modal'; 
import { FileText, X } from 'lucide-react';

export default function ReporteModal({ show, onClose, pdfUrl, titulo = "Vista Previa", subtitulo = "Documento del Sistema" }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="5xl" padding={false}>
            <div className="flex flex-col h-[85vh] bg-slate-50 dark:bg-[#0F1117] overflow-hidden rounded-2xl">
                
                {/* Cabecera */}
                <div className="flex items-center justify-between p-5 bg-white dark:bg-[#161922] border-b dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-tighter text-slate-700 dark:text-slate-200">
                                {titulo}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {subtitulo}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Cuerpo del Reporte */}
                <div className="flex-1 relative bg-slate-100 dark:bg-slate-950 p-4">
                    {pdfUrl ? (
                        <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border dark:border-slate-800 animate-in fade-in zoom-in duration-300">
                            <iframe 
                                src={`${pdfUrl}#toolbar=1`} // Cambié toolbar=1 para que puedan imprimir/descargar
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
                            <span className="block text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse text-center">
                                Generando Reporte PDF...
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
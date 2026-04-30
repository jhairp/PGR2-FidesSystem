import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

export default function Modal({ 
    show, 
    onClose, 
    title, 
    children, 
    maxWidth = 'md', // Por defecto sigue siendo pequeño para no romper otros módulos
    padding = true   // Nueva prop para controlar el espacio interno
}) {
    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className={`w-full ${maxWidthClass} transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#11141D] shadow-2xl transition-all border border-slate-100 dark:border-slate-800 relative`}>
                                
                                {title ? (
                                    /* DISEÑO CLÁSICO (Para otros módulos) */
                                    <div className="p-8">
                                        <div className="flex justify-between items-center mb-6">
                                            <Dialog.Title className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                {title}
                                            </Dialog.Title>
                                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                                <X size={20} className="text-slate-400" />
                                            </button>
                                        </div>
                                        {children}
                                    </div>
                                ) : (
                                    /* DISEÑO "FULL CANVAS" (Para tu Carnet) */
                                    <>
                                        <button 
                                            onClick={onClose} 
                                            className="absolute top-5 right-5 z-[110] p-2 bg-black/5 hover:bg-black/10 rounded-full transition-all text-slate-400 hover:text-red-500"
                                        >
                                            <X size={20} />
                                        </button>
                                        <div className={padding ? 'p-8' : ''}>
                                            {children}
                                        </div>
                                    </>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
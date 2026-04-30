import { useState, useEffect } from "react";
import { usePage } from '@inertiajs/react'; // Importamos usePage aquí

export function useCentroAlerts(flashProp, showModal) {
    const { flash } = usePage().props; // Es mejor obtener el flash directamente del estado de Inertia
    const [showAlert, setShowAlert] = useState(false);
    const [overlay, setOverlay] = useState({ show: false, type: 'creado' });
    const [alertConfig, setAlertConfig] = useState({ type: 'creado', message: '' });

    const configs = {
        creado: { type: 'success', message: 'Centro registrado correctamente' },
        editado: { type: 'editado', message: 'Información actualizada correctamente' },
        activo: { type: 'success', message: 'Centro activado' },
        inactivo: { type: 'warning', message: 'Centro desactivado' },
  
        asignado: { type: 'assign', message: 'Personal asignado correctamente' },
        desasignado: { type: 'assign', message: 'Personal desasignado correctamente' },
    };

    useEffect(() => {
        // Cada vez que flash.tipo_alerta exista, disparamos la lógica
        if (flash?.tipo_alerta) {
            const currentConfig = configs[flash.tipo_alerta] || configs.editado;

            setAlertConfig(currentConfig);
            setOverlay({ show: true, type: flash.tipo_alerta });
            setShowAlert(true);

            // Limpiamos los efectos visuales
            const timerOverlay = setTimeout(() => {
                setOverlay(prev => ({ ...prev, show: false }));
            }, 1200);

            const timerAlert = setTimeout(() => {
                setShowAlert(false);
                // IMPORTANTE: Limpiamos el flash manualmente en el cliente
                // para que la próxima vez que llegue el mismo tipo, React note el cambio
                flash.tipo_alerta = null; 
            }, 4000);

            return () => {
                clearTimeout(timerOverlay);
                clearTimeout(timerAlert);
            };
        }
    }, [flash, flash?.tipo_alerta]); // Escuchamos el objeto flash entero

    return { showAlert, alertConfig, overlay };
}
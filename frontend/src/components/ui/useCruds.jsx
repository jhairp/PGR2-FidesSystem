import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';

export function useCrud(initialValues, routeName) {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const form = useForm(initialValues);

    const openCreate = () => {
        setIsEditing(false);
        form.reset();
        setShowModal(true);
    };

    const openEdit = (item, idField) => {
        setEditId(item[idField]);
        setIsEditing(true);
        // Llenar el formulario con los datos del item
        const dataToSet = {};
        Object.keys(initialValues).forEach(key => {
            dataToSet[key] = item[key] ?? '';
        });
        form.setData(dataToSet);
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const action = isEditing 
            ? route(`${routeName}.update`, editId) 
            : route(`${routeName}.store`);
        
        // Usamos post para ambos pero Laravel permite _method: 'PUT'
        // O usamos put/post según corresponda:
        const method = isEditing ? 'put' : 'post';

        form[method](action, {
            onSuccess: () => closeModal(),
        });
    };

    const closeModal = () => {
        setShowModal(false);
        form.reset();
    };

    const changeStatus = (id) => {
        router.patch(route(`${routeName}.estado`, id), {}, { preserveScroll: true });
    };

    const deleteLogic = (id) => {
        if (confirm('¿Mover este registro a la papelera?')) {
            router.delete(route(`${routeName}.destroyLogic`, id), { preserveScroll: true });
        }
    };

    return { ...form, showModal, isEditing, openCreate, openEdit, closeModal, submit, changeStatus, deleteLogic };
}
// Fuente única de permisos por rol. Reemplaza los `[1,2,3].includes` dispersos.
// Roles (Rols.id_rol): 1 Super Admin, 2 Sacerdote, 3 Secretario, 4 Fiel.
export const ROLES = { SUPER_ADMIN: 1, SACERDOTE: 2, SECRETARIO: 3, FIEL: 4 }

// módulo -> roles que LO VEN (menú / ruta)
const VISIBLE = {
    usuarios:   [1, 2],
    centros:    [1],
    bautizos:   [1, 2, 3],
    documentos: [1, 2],
    calendario: [1, 2, 3, 4],
    iglesias:   [1, 4],
    scanner:    [1, 2, 3],
}

// módulo -> roles que pueden CREAR/EDITAR/ELIMINAR (calendario: solo estos crean; Fiel solo ve)
const ESCRIBE = {
    usuarios:   [1, 2],
    centros:    [1],
    bautizos:   [1, 2, 3],
    documentos: [1, 2],
    calendario: [1, 2, 3],
}

export const puedeVer    = (user, mod) => !!VISIBLE[mod]?.includes(user?.id_rol_1)
export const puedeEditar = (user, mod) => !!ESCRIBE[mod]?.includes(user?.id_rol_1)

// Nombres de rol (no hay endpoint de roles; son fijos 1-4).
export const ROLES_NOMBRES = {
    1: 'Super Administrador',
    2: 'Sacerdote',
    3: 'Secretario',
    4: 'Fiel',
}

// Roles que cada solicitante puede asignar al crear/editar usuarios.
// SuperAdmin: todos; Sacerdote: solo Secretario; otros: ninguno.
const ASIGNABLES = { 1: [1, 2, 3, 4], 2: [3] }

export const rolesAsignables = (user) =>
    (ASIGNABLES[user?.id_rol_1] || []).map(id => ({
        id_rol: id,
        nom_rol: ROLES_NOMBRES[id],
    }))

// ponytail: dos mapas + includes. Sin clase ni hook nuevo; los componentes ya tienen useAuth().user.
// check mínimo de la lógica:
console.assert(puedeVer({ id_rol_1: 1 }, 'centros'), 'SuperAdmin debe ver centros')
console.assert(!puedeEditar({ id_rol_1: 4 }, 'bautizos'), 'Fiel no debe editar bautizos')
console.assert(puedeVer({ id_rol_1: 4 }, 'calendario') && !puedeEditar({ id_rol_1: 4 }, 'calendario'), 'Fiel ve calendario pero no edita')
console.assert(!puedeVer({ id_rol_1: 3 }, 'usuarios'), 'Secretario no debe ver usuarios')

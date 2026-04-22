import React, { useState, useEffect } from "react";
import axios from "axios";

const UsuarioForm = (props) => {
  const id = props.match.params.id;
  const history = props.history;

  const [formData, setFormData] = useState({
    nom_per: "",
    ap_pat_per: "",
    carnet_per: "",
    cel_per: "",
    correo_usu: "",
    id_rol_1: "1",
    password: "",        // Campo para la contraseña
    confirm_password: "" // Campo para confirmar
  });

  useEffect(() => {
    if (id) {
      const obtenerUsuario = async () => {
        try {
          const res = await axios.get(`http://localhost:8000/api/usuarios/${id}/`);
          const u = res.data;
          setFormData({
            ...formData,
            nom_per: u.persona?.nom_per || "",
            ap_pat_per: u.persona?.ap_pat_per || "",
            carnet_per: u.persona?.carnet_per || "",
            cel_per: u.persona?.cel_per || "",
            correo_usu: u.correo_usu || "",
            id_rol_1: u.id_rol_1 || "1",
          });
        } catch (error) {
          console.error("Error al cargar datos", error);
        }
      };
      obtenerUsuario();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN DE CONTRASEÑAS (Solo si es un registro nuevo)
    if (!id) {
      if (formData.password !== formData.confirm_password) {
        alert("Las contraseñas no coinciden. Por favor, verifica.");
        return;
      }
      if (formData.password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/usuarios/${id}/editar/`, formData);
        alert("Usuario actualizado correctamente");
      } else {
        // Al crear, enviamos el password que el usuario escribió
        await axios.post("http://localhost:8000/api/crear-personal/", formData);
        alert("Trabajador creado exitosamente.");
      }
      history.push("/admin/usuarios");
    } catch (error) {
      alert("Error al guardar: " + (error.response?.data?.error || "Error de servidor"));
    }
  };

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
      <div className="rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex justify-between">
          <h6 className="text-blueGray-700 text-xl font-bold">
            {id ? "Editar Trabajador" : "Registrar Nuevo Trabajador"}
          </h6>
          <button
            onClick={() => history.push("/admin/usuarios")}
            className="bg-blueGray-700 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none"
          >
            Volver
          </button>
        </div>
      </div>
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form onSubmit={handleSubmit}>
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Información Personal</h6>
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Nombre</label>
              <input type="text" name="nom_per" value={formData.nom_per} onChange={handleChange} className="border-0 px-3 py-3 w-full rounded shadow text-sm" required />
            </div>
            <div className="w-full lg:w-6/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Apellidos</label>
              <input type="text" name="ap_pat_per" value={formData.ap_pat_per} onChange={handleChange} className="border-0 px-3 py-3 w-full rounded shadow text-sm" />
            </div>
          </div>

          <hr className="mt-6 border-b-1 border-blueGray-300" />
          <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">Credenciales y Rol</h6>
          
          <div className="flex flex-wrap">
            <div className="w-full lg:w-4/12 px-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Correo</label>
              <input type="email" name="correo_usu" value={formData.correo_usu} onChange={handleChange} className="border-0 px-3 py-3 w-full rounded shadow text-sm" required />
            </div>

            {/* SECCIÓN DE CONTRASEÑAS (Ocultar si estamos editando para mayor seguridad) */}
            {!id && (
              <>
                <div className="w-full lg:w-4/12 px-4">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Contraseña</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="border-0 px-3 py-3 w-full rounded shadow text-sm" required />
                </div>
                <div className="w-full lg:w-4/12 px-4">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Confirmar Contraseña</label>
                  <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} className="border-0 px-3 py-3 w-full rounded shadow text-sm" required />
                </div>
              </>
            )}

            <div className="w-full lg:w-4/12 px-4 mt-4">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Rol</label>
              <select name="id_rol_1" value={formData.id_rol_1} onChange={handleChange} className="border-0 px-3 py-3 w-full rounded shadow text-sm">
                <option value="1">Administrador</option>
                <option value="2">Secretario/a</option>
                <option value="3">Sacerdote</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="mt-6 bg-lightBlue-500 text-white font-bold uppercase text-xs px-6 py-3 rounded shadow hover:shadow-lg">
            {id ? "Guardar Cambios" : "Registrar Trabajador"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsuarioForm;
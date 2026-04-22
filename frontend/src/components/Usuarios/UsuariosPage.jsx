const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
const [mostrarForm, setMostrarForm] = useState(false);

// Función para cuando el usuario hace clic en "Editar" en la tabla
const handleEditClick = (usuario) => {
  setUsuarioSeleccionado(usuario);
  setMostrarForm(true);
};

// Función para cuando hace clic en "Nuevo"
const handleNuevoClick = () => {
  setUsuarioSeleccionado(null);
  setMostrarForm(true);
};
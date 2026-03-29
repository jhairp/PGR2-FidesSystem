import { useEffect, useState } from 'react'
import { getSaludo } from './api'

function App() {
  const [datos, setDatos] = useState({ mensaje: "Cargando..." });

  useEffect(() => {
    // Llamamos a la API al cargar el componente
    getSaludo().then(res => setDatos(res));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>React + Django</h1>
      <div style={{ padding: '20px', border: '1px solid #ddd', display: 'inline-block' }}>
        <p>Respuesta del servidor:</p>
        <h2 style={{ color: '#61dafb' }}>{datos.mensaje}</h2>
      </div>
    </div>
  )
}

export default App
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [historial, setHistorial] = useState([]);
  const [imagenCargando, setImagenCargando] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false); 

  const validarPregunta = (texto) => {
    const regex = /^¿.*\?|.*\?$/;
    return regex.test(texto.trim());
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!validarPregunta(pregunta)) {
      setError('La pregunta debe estar entre signos de interrogación (¿...?) o terminar con "?".');
      setRespuesta(null);
      setImagen(null);
      return;
    }

    try {
      const respuestaAPI = await axios.get('https://yesno.wtf/api');
      setRespuesta(respuestaAPI.data.answer);
      setImagenCargando(true);
      setImagen(respuestaAPI.data.image);
      setError('');

      setHistorial([
        { pregunta, respuesta: respuestaAPI.data.answer },
        ...historial,
      ]);

      setPregunta('');

    } catch (err) {
      setError('Hubo un error al consultar la API.');
    }
  };

  const obtenerClaseRespuesta = () => {
    switch (respuesta) {
      case 'yes':
        return 'App yes';
      case 'no':
        return 'App no';
      case 'maybe':
        return 'App maybe';
      default:
        return 'App';
    }
  };

  return (
    <div className={obtenerClaseRespuesta()}>
      <h1>Preguntale a la app</h1>
      <form onSubmit={manejarEnvio}>
        <input
          type="text"
          placeholder="Escribí tu pregunta..."
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>

      {error && <p className="error">{error}</p>}

      {respuesta && (
        <div className="respuesta">
          <h2>{respuesta.toUpperCase()}</h2>

          {imagen && (
            <>
              {imagenCargando && <p className="cargando">Cargando imagen...</p>}
              <img
                src={imagen}
                alt="respuesta"
                onLoad={() => setImagenCargando(false)}
                style={{ display: imagenCargando ? 'none' : 'block' }}
              />
            </>
          )}
        </div>
      )}

      {historial.length > 0 && (
        <div className="historial">
          <button
            className="btn-toggle-historial"
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
          >
            {mostrarHistorial ? 'Ocultar Historial' : 'Mostrar Historial'}
          </button>

          {mostrarHistorial && (
            <ul>
              {historial.map((item, index) => (
                <li key={index}>
                  <strong>{item.pregunta}</strong> → {item.respuesta.toUpperCase()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

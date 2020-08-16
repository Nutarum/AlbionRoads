import React from 'react';
import logo from './logo.svg';
import './App.css';
import { AlbionMap } from "./Components/AlbionMap/albionMap.js"

function App() {
  return (
    <div className="App">

      <AlbionMap></AlbionMap>      
    </div>
  );
}

export default App;

//TODO:

//que no se puedan repetir nombres de zonas, ni caminos entre zonas (ojo porque no las estamos borrando, solo dejanto temps)

//importar y exportar


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Planner from './features/planner/Planner.jsx'
import Agente from './features/agente/Agente.jsx'
import PesquisaConcorrentes from './features/pesquisaConcorrentes/PesquisaConcorrentes.jsx'
import DossiesIndex from './features/dossies/DossiesIndex.jsx'
import SquareGarden from './features/dossies/squareGarden/SquareGarden.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/planner" element={<Planner />} />
        <Route path="/agente" element={<Agente />} />
        <Route path="/pesquisa_concorrentes" element={<PesquisaConcorrentes />} />
        <Route path="/dossies" element={<DossiesIndex />} />
        <Route path="/dossies/square-garden" element={<SquareGarden />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

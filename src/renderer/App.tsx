import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Scene from './lab/Scene';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scene />} />
      </Routes>
    </Router>
  );
}

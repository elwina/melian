import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Scene from './Scene';
import Scene2 from './Scene2';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scene2 />} />
      </Routes>
    </Router>
  );
}

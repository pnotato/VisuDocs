import './App.css'
import EditorPage from './editor/page.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './layout/page.jsx';
import Dashboard from './dashboard/page.jsx';
import Home from './home/page.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/editor/:id" element={<EditorPage />} />
        <Route element={<BaseLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}


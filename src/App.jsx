import './App.css'
import CodeEditor from './components/Editor/Editor.jsx'
import Home from './components/Home/Home.jsx';
import SignIn from './components/SignIn/signin.jsx';
import SignUp from './components/SignIn/SignUp.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './layout/page.jsx';
import Dashboard from './dashboard/page.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<BaseLayout />}>
          <Route path="/" element={''} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:id" element={<CodeEditor />} />
          <Route path="/editor" element={<CodeEditor />} />
        </Route>
      </Routes>
    </Router>
  );
}


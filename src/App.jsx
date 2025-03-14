import './App.css'
import CodeEditor from './components/Editor/Editor.jsx'
import Home from './components/Home/Home.jsx';
import SignIn from './components/SignIn/signin.jsx';
import SignUp from './components/SignIn/SignUp.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:id" element={<CodeEditor />} />
        <Route path="/editor" element={<CodeEditor />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App

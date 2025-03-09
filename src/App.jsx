import './App.css'
import CodeEditor from './components/Editor/Editor.jsx'
import Home from './components/Home/Home.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {
  const router = createBrowserRouter([
    {
      path: "/editor",
      element: <CodeEditor />
    },
    {
      path: "/",
      element: <Home />
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />   
    </>
  )
}

export default App

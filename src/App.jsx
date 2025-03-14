import './App.css'
import CodeEditor from './components/Editor/Editor.jsx'
import Home from './components/Home/Home.jsx';
import SignIn from './components/SignIn/signin.jsx';
import SignUp from './components/SignIn/SignUp.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <CodeEditor />
    },
    {
      path: "/editor",
      element: <CodeEditor />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/signin",
      element: <SignIn />
    },
    {
      path: "/signup",
      element: <SignUp />
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />   
    </>
  )
}

export default App

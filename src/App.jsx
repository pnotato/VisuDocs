import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CodeEditor from './components/Editor/Editor.jsx'
import Selector from './components/Editor/Selector.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    
    <CodeEditor />
    </>
  )
}

export default App

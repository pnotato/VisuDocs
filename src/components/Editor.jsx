import { Editor } from "@monaco-editor/react";
import { useState, useRef } from "react";
import Selector from "./Selector.jsx";
import { CODE_SNIPPETS } from "../constants.js";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('javascript');

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    }
    
    const onSelect = (language) => {
        setLanguage(language);
        setValue(
            CODE_SNIPPETS[language]
        )
    }

    return (
        <div>
            <Selector language={language} onSelect={onSelect} />
            <Editor 
                height="90vh" 
                width="50vw" 
                theme="vs-dark"
                language={language} 
                defaultValue="// some comment" 
                onMount={onMount}
                value ={value}
                onChange={(value) => setValue(value)}
                />
        </div>
    )
}

export default CodeEditor
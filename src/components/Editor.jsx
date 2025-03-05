import { Editor } from "@monaco-editor/react";
import { useState, useRef } from "react";
import Selector from "./Selector.jsx";
import { CODE_SNIPPETS } from "../constants.js";
import './Editor.css'
import Output from "./Output.jsx";

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
        <div className={'interface'}>
            <div className={'code-editor'}>
                <Selector language={language} onSelect={onSelect} />
                <Editor 
                    theme="vs-dark"
                    language={language} 
                    defaultValue="// some comment" 
                    onMount={onMount}
                    value ={value}
                    onChange={(value) => setValue(value)}
                    />
            </div>
            <Output editorRef={editorRef} language={language} />
        </div>
    )
}

export default CodeEditor
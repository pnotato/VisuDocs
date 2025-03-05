import { Editor } from "@monaco-editor/react";
import { useState, useRef } from "react";
import Selector from "./Selector.jsx";
import { CODE_SNIPPETS } from "../../constants.js";
import './Editor.css'
import Output from "./Output.jsx";
import Button from "./Button.jsx";
import { executeCode } from "../api.js";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState(null);

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

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setIsLoading(true)
            const {run: result} = await executeCode(language, sourceCode);
            setOutput(result.output)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false); // used for loading spinner
        }
    }

    return (
        <div className={'interface'}>
            <div className={'code-editor'}>
                <div className={'code-editor-options'}>
                    <Selector language={language} onSelect={onSelect} />
                    <Button onClick={runCode}/>
                </div>
                <Editor 
                    theme="vs-dark"
                    language={language} 
                    defaultValue="// some comment" 
                    onMount={onMount}
                    value={value}
                    onChange={(value) => setValue(value)}
                    options={{
                        fontSize: 14 // Adjust this value as needed
                    }}
                    />
            </div>
            <div className={'code-output'}>
                <div className="code-chat"></div>
                <div className={'code-output-box'}>
                    <a className={'code-output-text'}>{output ? output : 'Click "Run Code" to see the output here.'}</a>
                </div>
            </div>
            
        </div>
    )
}

export default CodeEditor
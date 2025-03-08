import { Editor } from "@monaco-editor/react";
import { useState, useRef } from "react";
import Selector from "./Selector.jsx";
import { CODE_SNIPPETS } from "../../constants.js";
import { FILE_EXTENSIONS } from "../../constants.js";
import './Editor.css'
import Button from "../Button/Button.jsx";
import { executeCode } from "../api.js";
import { LuSettings, LuDownload } from "react-icons/lu";
import Modal from "../Modal/Modal.jsx";

const CodeEditor = () => {
    const editorRef = useRef();
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(false);
    const [ModalState, setModalState] = useState(false);
    const [fontSize, setFontSize] = useState(14);

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
        setOutput("Loading...")
        setError(false)
        try {
            setIsLoading(true)
            const { run: result } = await executeCode(language, sourceCode);
            setOutput(result.output)
            console.log(result)
            if (result.stderr) {
                setError(true);
            }
            if (result.signal == "SIGKILL") {
                throw "SIGKILL"
                // Generally this occurs if your code takes too long, i.e long for loops
                // In which the piston API kills the process.
            }
        } catch (error) {
            console.log(error)
            setError(true);
            setOutput("Timed out.")
        } finally {

            setIsLoading(false); // used for loading spinner
        }
    }

    const downloadScript = (content, fileType) => {
        const filename = fileType || "file.txt";
        const mimeTypes = {
            js: "text/javascript",
            ts: "application/typescript",
            py: "text/x-python",
            java: "text/x-java-source",
            cs: "text/plain", // No official MIME for C#
            php: "application/x-httpd-php",
        };
        const extension = filename.split(".").pop();
        const mimeType = mimeTypes[extension] || "text/plain";

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <div className={'interface'}>
            <div className={'code-editor'}>
                <div className={'code-editor-options'}>
                    <div className={'selector-options'}>
                        <Selector language={language} onSelect={onSelect} />
                        <Button Icon={<LuSettings />} onClick={() => setModalState(true)} />
                        <Button Icon={<LuDownload />} onClick={() => downloadScript(value, FILE_EXTENSIONS[language])} />
                    </div>


                    <Button Label="Run Code" onClick={runCode} />
                </div>
                <Modal open={ModalState} setOpen={setModalState} 
                    fontSize={fontSize} setFontSize={setFontSize}/>
                <Editor
                    theme="vs-dark"
                    language={language}
                    defaultValue="// Code goes here!"
                    onMount={onMount}
                    value={value}
                    onChange={(value) => setValue(value)}
                    options={{
                        fontSize: fontSize
                    }}
                />
            </div>
            <div className={'code-output'}>
                <div className="code-chat">
                    <div className={'code-chat-options'}>
                        <Button Label="Share" onClick={runCode} />
                        <Button Label="Sign In" onClick={runCode} />
                    </div>
                </div>
                <div className={'code-output-box'}>
                    <a style={{ color: error ? 'red' : output ? 'white' : 'grey' }}
                        className={'code-output-text'}>
                        {error ? 'Error: ' + output : output ? output : 'Click "Run Code" to see the output here.'}</a>
                </div>
            </div>

        </div>
    )
}

export default CodeEditor
import { executeCode } from "./api";
import { useState } from "react";

const Output = ({editorRef, language}) => {

    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
        <div className={'code-output-box'}>
            Output
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={runCode}>
            Run Code
            </button>
            <div className={'code-output'}>
                {output ? output : 'Click "Run Code" to see the output here'}
            </div>
        </div>
    )
}

export default Output
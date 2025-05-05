// Old version of the Editor, just for reference

import { Editor } from "@monaco-editor/react";
import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CODE_SNIPPETS, FILE_EXTENSIONS } from "../../constants.js";
import { executeCode } from "../api.js";
import { useSelector } from "react-redux";
import { axiosp as axios } from "../../../proxy.js";

// Stylizing
import './Editor.css'
import Button from "../Button/Button.jsx";
import Selector from "./Selector.jsx";
import EditorSettingsModal from "../Modal/EditorSettings.jsx";
import ShareModal from "../Modal/Share.jsx";
import SignInModal from '../Modal/SignIn.jsx'
import SignOutModal from "../Modal/SignOut.jsx";
import { LuSettings, LuDownload } from "react-icons/lu";

// Socketing
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000")

// Old version of the Editor, just for reference

const CodeEditor = ({ roomCode }) => {

    const editorRef = useRef();
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isLoading, setIsLoading] = useState(false);
    const [output, setOutput] = useState(null);
    const [error, setError] = useState(false);
    const [EditorSettings, EditorSettingsOpen] = useState(false);
    const [ShareMenu, ShareMenuOpen] = useState(false);
    const [SignInMenu, SignInMenuOpen] = useState(false);
    const [SignOutMenu, SignOutMenuOpen] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const [saving, setSaving] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const currentUser = useSelector(state=>state.user.currentUser) // redux to get user from storage


    const { id } = useParams();

    useEffect(() => {
        if (id) {
            socket.emit('join-room', id);
            
            // Request the current user count in the room
            socket.emit('get-user-count', id, (userCount) => {
                console.log(`Users in room: ${userCount}`);
                
                if (userCount === 1) {
                    
                    axios.get(`/api/projects/${id}`)
                        .then((res) => {
                            if (res.data && res.data.code) {
                                setValue(res.data.code);
                                setLanguage(res.data.language)
                                socket.emit('language-update', { room: id, language: res.data.language });
                                
                            }
                        })
                        .catch((error) => {
                            console.error("Error fetching project code:", error);
                        });
                }
            });
        }
        
        return () => {
            if (id) {
                socket.emit('leave-room', id);
            }
        };
    }, [id]);

    useEffect(() => {
        // Listen for incoming chat messages
        socket.on('chat-message-return', ({ room, message }) => {
            if (room === id) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        // Load chat history when joining a room
        socket.on('chat-history', ({ room, messages }) => {
            if (room === id) {
                setMessages(messages);
            }
        });

        return () => {
            socket.off('message-update-return');
            socket.off('chat-history');
        };
    }, [id]);

    const sendMessage = () => {
        if (message.trim() && id) {
            socket.emit('message-update', { room: id, message });
            setMessage("");
        }
    };

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    }

    const onSelect = (newLanguage) => {
        setLanguage(newLanguage);
        // setValue(CODE_SNIPPETS[newLanguage]);
 
        if (id) {
            socket.emit('language-update', { room: id, language: newLanguage });
        }
    }

    const onEditorUpdate = (value) => {
        if (id) {
            socket.emit('editor-update', { room: id, value });
        }
    }

    // used so that when a new user joins the code is consistent
    // problem before was that new users would join with default code, resulting in everyone else in the room's code being replaced.
    useEffect(() => {
        const handleEditorUpdate = ({ room, value }) => {
            if (room === id) {
                setValue(value);
            }
        };

        socket.on('editor-update-return', handleEditorUpdate);

        return () => {
            socket.off('editor-update-return', handleEditorUpdate);
        };
    }, [id]);
 
    useEffect(() => {
        const handleLanguageUpdate = ({ room, language }) => {
            if (room === id) {
                setLanguage(language);
                console.log(language)
            }
        };
 
        socket.on('language-update-return', handleLanguageUpdate);
 
        return () => {
            socket.off('language-update-return', handleLanguageUpdate);
        };
    }, [id]);

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
                // In which the piston API just kills the process.
            }
        } catch (error) {
            console.log(error)
            setError(true);
            setOutput("Timed out.")
        } finally {
            setIsLoading(false); // used for loading spinner
        }
    }

    const saveProject = async () => {    
        setSaving(true);
        try {
            const res = await axios.put(`/api/projects/${id}`, { ownerId: currentUser._id, code: value });
            console.log("Project saved successfully:", res.data);
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setSaving(false);
        }
    };

    const downloadScript = (content, fileType) => {
        const filename = fileType || "file.txt";
        const mimeTypes = {
            js: "text/javascript",
            ts: "application/typescript",
            py: "text/x-python",
            java: "text/x-java-source",
            cs: "text/plain",
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
        <div className='interface'>
            <div className='code-editor'>
                <div className='code-editor-options'>
                    <div className='selector-options'>
                        <Selector language={language} onSelect={onSelect} />
                        <Button Icon={<LuSettings />} onClick={() => EditorSettingsOpen(true)} />
                        <Button Icon={<LuDownload />} onClick={() => downloadScript(value)} />
                        <Button Label={saving ? "Saving..." : "Save"} onClick={saveProject} />
                    </div>


                    <Button Label="Run Code" onClick={runCode} />
                </div>
                <EditorSettingsModal open={EditorSettings} setOpen={EditorSettingsOpen} 
                    fontSize={fontSize} setFontSize={setFontSize}/>
                <ShareModal open={ShareMenu} setOpen={ShareMenuOpen}/>
                <SignInModal open={SignInMenu} setOpen={SignInMenuOpen} />
                <SignOutModal open={SignOutMenu} setOpen={SignOutMenuOpen} />
                <Editor
                    theme="vs-dark"
                    language={language}
                    defaultValue="// Code goes here!"
                    onMount={onMount}
                    value={value}
                    onChange={(value) => {
                        // setValue(value);
                        onEditorUpdate(value);
                    }}
                    options={{
                        fontSize: fontSize
                    }}
                />
            </div>
            <div className={'code-output'}>
                <div className="code-chat">

                    <div className={'code-chat-options'}>
                        <Button Label="Share" onClick={() => ShareMenuOpen(true)}/>
                        <Button Icon={currentUser ? <img style={{ height: '3vh', borderRadius: '20px' }} src={currentUser.img} /> : 'Sign In'} onClick={currentUser ? () => SignOutMenuOpen(true) : () => SignInMenuOpen(true)} />
                    </div>
                    <div className="chat-messages">
    {messages.map((msg, index) => (
        <div key={index} className="chat-message">{msg}</div>
    ))}
</div>
<div className="chat-input">
    <input 
        type="text" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="Type a message..." 
    />
    <Button Label="Send" onClick={sendMessage} />
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
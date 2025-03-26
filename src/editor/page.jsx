import { useState, useRef, useEffect } from "react";
import { LuSquareTerminal, LuShare2, LuPlay, LuSettings } from "react-icons/lu";
import {
  HiOutlineChatAlt,
  HiOutlineCloudDownload,
  HiOutlineSave,
} from "react-icons/hi";

import { LANGUAGE_VERSIONS, FILE_EXTENSIONS } from "../constants";

import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { io } from "socket.io-client";
import { executeCode } from "../components/api";
import { axiosp as axios } from "../../proxy"; // import axios from 'axios'
const socket = io("ws://localhost:3000");

import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Output from "../components/Output/Output";
import Chat from "../components/Chat/Chat";
import EditorComponent from "../components/Editor/EditorComponent";
import { FcGoogle } from "react-icons/fc";

export default function EditorPage() {
  const [showChat, setShowChat] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [outputHeight, setOutputHeight] = useState(200);
  const [chatWidth, setChatWidth] = useState(300);
  const outputRef = useRef(null);
  const chatRef = useRef(null);
  const isResizingOutput = useRef(false);
  const isResizingChat = useRef(false);
  const editorRef = useRef();
  const saveTimeoutRef = useRef(null);
  const languageOptions = ["javascript", "typescript", "python", "java", "csharp",  "php"];
  // -- Values for monaco editor

  const [projectTitle, setProjectTitle] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectLanguage, setProjectLanguage] = useState('javascript');
  const [projectMessages, setProjectMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const [editorSize, setEditorSize] = useState(14);

  // -- Values for output box
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  //

  // -- Executing Code
  const runCode = async () => {
    const sourceCode = projectCode;
    if (!sourceCode) return;
    setOutput("Loading...");
    setShowOutput(true);
    setError(false);
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(projectLanguage, sourceCode);
      setOutput(result.output);
      if (result.stderr) {
        setError(true);
      }
      if (result.signal == "SIGKILL") {
        throw "SIGKILL";
        // Generally this occurs if your code takes too long, i.e long for loops
        // In which the piston API just kills the process.
      }
    } catch (error) {
      setError(true);
      if (error === "SIGKILL") {
        setOutput("Timed out. Your code may be taking too long to run, forcing the Piston API to stop after a time limit has been reached.");
      }
      else {
        setOutput("Timed out.");  
    }
      
      setIsLoading(false);
    } finally {
      setIsLoading(false); // used for loading spinner
    }
  };

const saveCode = async () => {
    try {
        setIsSaving(true);
        await axios.put(`/api/projects/${id}`, {
            code: projectCode,
            language: projectLanguage,
            title: projectTitle,
            message: projectMessages,
            lastupdated: new Date().toISOString()
        }, { withCredentials: true });
        setLastSaved(new Date());
    } catch (error) {
        console.error("Save failed:", error);
    } finally {
        setIsSaving(false);
    }
};

// -- Downloading Code

const downloadScript = (content) => {
    const filename = (projectTitle || "file") + "." + FILE_EXTENSIONS[projectLanguage];
    const mimeTypes = {
      js: "text/javascript",
      ts: "application/typescript",
      py: "text/x-python",
      java: "text/x-java-source",
      cs: "text/plain",
      php: "application/x-httpd-php",
    };
    const extension = FILE_EXTENSIONS[projectLanguage];
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


  // -- Sign in

  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [authTab, setAuthTab] = useState("signin");

  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        "/api/auth/signup",
        { name, email, password },
        { withCredentials: true }
      );
      dispatch(loginSuccess(res.data));
      navigate("/");
      setShowAuthModal(false);
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        "/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );
      dispatch(loginSuccess(res.data));
      navigate("/dashboard");
      setShowAuthModal(false);
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        axios
          .post(
            "/api/auth/google",
            {
              name: result.user.displayName,
              email: result.user.email,
              img: result.user.photoURL,
            },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(loginSuccess(res.data));
            setShowAuthModal(false);
          });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  // -- useEffects for resizing the chat and output windows.

  useEffect(() => {
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        if (isResizingOutput.current && outputRef.current) {
          const bottom = outputRef.current.getBoundingClientRect().bottom;
          const newHeight = Math.max(80, Math.min(400, bottom - e.clientY));
          setOutputHeight(newHeight);
        }

        if (isResizingChat.current && chatRef.current) {
          const right = chatRef.current.getBoundingClientRect().right;
          const newWidth = Math.max(200, Math.min(500, right - e.clientX));
          setChatWidth(newWidth);
        }
      });
    };

    const handleMouseUp = () => {
      isResizingOutput.current = false;
      isResizingChat.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // -- useEffects for websockets
  const { id } = useParams();
  useEffect(() => {
    if (id) {
        async function fetchData() {
            await axios.get(`/api/projects/${id}`)
            .then((res) => {
              if (res.data) {
                setProjectCode(res.data.code);
                setProjectLanguage(res.data.language);
                setProjectTitle(res.data.title);
                if (res.data.lastupdated) {
                  setLastSaved(new Date(res.data.lastupdated));
                }
              }
              setHasMounted(true);
            })
            .catch((error) => {
              console.error("Error loading initial project from MongoDB:", error);
            });
        }
        fetchData()
      socket.emit("join-room", id);
      socket.emit("request-redis-data", id);
    }
 
    return () => {
      if (id) {
        socket.emit("leave-room", id);
      }
    };
  }, [id]);

  const onSelect = (newLanguage) => {
    setProjectLanguage(newLanguage);
    // setValue(CODE_SNIPPETS[newLanguage]);

    if (id) {
        socket.emit('language-update', { room: id, language: newLanguage });
    }
}

const onNewMessage = (text) => {
    const message = {
      sender: currentUser ? currentUser.name : "Anonymous",
      text,
      timestamp: Date.now(),
    };
    const newMessages = [...projectMessages, message];
    setProjectMessages(newMessages);
    if (id) {
      socket.emit("message-update", { room: id, messages: newMessages });
    }
  };

  const onEditorUpdate = (value) => {
    if (id) {
      socket.emit("editor-update", { room: id, value });

    }
  };

  const onTitleUpdate = (value) => {
    if (id) {
        socket.emit("title-update", { room: id, title: value })
    }
  }

  // used so that when a new user joins the code is consistent
  // problem before was that new users would join with default code, resulting in everyone else in the room's code being replaced.
  useEffect(() => {
    const handleEditorUpdate = ({ room, value }) => {
      if (room === id) {
        setProjectCode(value);
      }
    };

    socket.on("editor-update-return", handleEditorUpdate);

    return () => {
      socket.off("editor-update-return", handleEditorUpdate);
    };
  }, [id]);

  useEffect(() => {
    const handleLanguageUpdate = ({ room, language }) => {
      if (room === id) {
        setProjectLanguage(language);

      }
    };

    socket.on("language-update-return", handleLanguageUpdate);

    return () => {
      socket.off("language-update-return", handleLanguageUpdate);
    };
  }, [id]);

  useEffect(() => {
    const handleMessageUpdate = ({ room, messages }) => {
      if (room === id) {
        setProjectMessages(messages);
      }
    };
    socket.on("message-update-return", handleMessageUpdate);
    return () => socket.off("message-update-return", handleMessageUpdate);
  }, [id]);

  useEffect(() => {
    const handleTitleUpdate = ({ room, title }) => {
      if (room === id && title !== projectTitle) {
        setProjectTitle(title);
      }
    };
  
    socket.on("title-update-return", handleTitleUpdate);
  
    return () => {
      socket.off("title-update-return", handleTitleUpdate);
    };
  }, [id, projectTitle]);

  useEffect(() => {
    if (!id || !hasMounted) return;
        
    saveTimeoutRef.current = setTimeout(() => {
        
      saveCode();
      saveTimeoutRef.current = null;
    }, 3000);
 
    return () => clearTimeout(saveTimeoutRef.current);
  }, [projectCode, projectLanguage, projectTitle]);

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="border-b border-gray-800 bg-black">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                onClick={() => navigate("/dashboard")}
                src="/icons/icon.png"
                alt="Logo"
                className="h-8 w-auto cursor-pointer"
              />
              <input
                type="text"
                defaultValue={projectTitle}
                onChange={(e) => {

                    onTitleUpdate(e.target.value);
                  }}
                className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button onClick={runCode} className="h-10 w-10 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition duration-150 ease-in-out active:scale-95">
                  <LuPlay className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Run Code
                </span>
              </div>
              {showShare && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px]">
                            <h3 className="text-lg font-semibold mb-4">Share Project</h3>
                            <input
                                type="text"
                                className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4"
                                value={document.URL}
                                readOnly
                                onClick={(e) => e.target.select()}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    className="bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-600 transition-colors"
                                    onClick={() => setShowShare(false)}
                                >
                                    Close
                                </button>
                                <button
                                    className="bg-purple-600 px-3 py-1.5 rounded hover:bg-purple-500 transition-colors"
                                    onClick={() => {
                                        navigator.clipboard.writeText(document.URL);
                                        setShowShare(false);
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                                {showSettings && (
                                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-[300px]">
                                            <h3 className="text-lg font-semibold mb-4">Project Settings</h3>
                                            <select
                                                className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4"
                                                value={projectLanguage}
                                                onChange={(e) => onSelect(e.target.value)}
                                            >
                                                {languageOptions.map((lang) => (
                                                    <option key={lang} value={lang}>{lang + " " + LANGUAGE_VERSIONS[lang]}</option>
                                                ))}
                                            </select>
                                            <div className="flex items-center gap-3 mb-4">
                                                <img
                                                    src={`/icons/${projectLanguage.toLowerCase()}.png`}
                                                    alt={projectLanguage}
                                                    className="w-8 h-8 object-contain rounded"
                                                />
                                                <span className="text-sm">{projectLanguage.charAt(0).toUpperCase() + projectLanguage.slice(1) + " (." + FILE_EXTENSIONS[projectLanguage] + ")"}</span>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="bg-gray-700 px-3 py-1.5 rounded hover:bg-gray-600 transition-colors"
                                                    onClick={() => setShowSettings(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
              <div className="relative group">
                <button onClick={() => setShowSettings(true)} className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <LuSettings className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Settings
                </span>
              </div>

              <div className="relative group">
                <button onClick={saveCode} className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <HiOutlineSave className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Save File
                </span>
              </div>

              <div className="relative group">
                <button onClick={() => downloadScript(projectCode)} className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <HiOutlineCloudDownload className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Download
                </span>
              </div>

              <div className="relative group">
                <button
                  className={`h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium border ${
                    showChat
                      ? "bg-purple-600 hover:bg-purple-700 border-transparent text-white"
                      : "border-gray-600 hover:bg-gray-700"
                  } transition duration-150 ease-in-out active:scale-95`}
                  onClick={() => setShowChat((prev) => !prev)}
                >
                  <HiOutlineChatAlt className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {showChat ? "Hide Chat" : "Show Chat"}
                </span>
              </div>

              <div className="relative group">
                <button
                  className={`h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium border ${
                    showOutput
                      ? "bg-purple-600 hover:bg-purple-700 border-transparent text-white"
                      : "border-gray-600 hover:bg-gray-700"
                  } transition duration-150 ease-in-out active:scale-95`}
                  onClick={() => setShowOutput((prev) => !prev)}
                >
                  <LuSquareTerminal className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {showOutput ? "Hide Output" : "Show Output"}
                </span>
              </div>

              <div className="relative group">
                <button onClick={() => setShowShare(true)} className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <LuShare2 className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Share
                </span>
              </div>

              <div className="ml-2">
                {currentUser ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt={currentUser.name}
                          src={currentUser.img}
                          className="size-8 rounded-full"
                        />
                      </MenuButton>
                    </div>
                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-black border-1 border-gray-800 py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                    >
                      <MenuItem>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-50 data-focus:bg-gray-800 data-focus:outline-hidden"
                        >
                          Your Profile
                        </a>
                      </MenuItem>
                      <MenuItem>
                        <a
                          onClick={(e) => handleLogout(e)}
                          className="block px-4 py-2 text-sm text-red-500 data-focus:bg-gray-800 data-focus:outline-hidden"
                        >
                          Sign out
                        </a>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAuthTab("signin");
                        setShowAuthModal(true);
                      }}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white rounded p-6 w-96 relative">
            <div className="flex justify-center gap-4 mb-4 border-b border-gray-700">
              <button
                className={`px-4 py-2 ${
                  authTab === "signin"
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setAuthTab("signin")}
              >
                Sign In
              </button>
              <button
                className={`px-4 py-2 ${
                  authTab === "register"
                    ? "border-b-2 border-white text-white"
                    : "text-gray-400"
                }`}
                onClick={() => setAuthTab("register")}
              >
                Register
              </button>
            </div>

            {/* Shared form structure */}
            {authTab === "signin" ? (
              <>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-4 p-2 bg-gray-800 text-white border border-gray-600 rounded"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mb-2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full mb-4 p-2 bg-gray-800 text-white border border-gray-600 rounded"
                />
              </>
            )}

            <div className="flex justify-between items-center">
              <div>
                <button
                  className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-700"
                  onClick={() => setShowAuthModal(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  title="Sign in with Google"
                  onClick={handleGoogleLogin}
                  className="h-10 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded flex items-center justify-center"
                >
                  <FcGoogle className="h-5 w-5" />
                </button>
                <button
                  onClick={authTab === "signin" ? handleLogin : handleSignUp}
                  className={`px-4 py-2 rounded ${
                    authTab === "signin"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white`}
                >
                  {authTab === "signin" ? "Sign In" : "Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div
          className={`flex-1 flex flex-col ${showChat ? "w-2/3" : "w-full"}`}
        >
          <EditorComponent
            key={projectLanguage} // This will force the editor to update when the language changes
            projectCode={projectCode}
            projectLanguage={projectLanguage}
            editorSize={editorSize}
            editorRef={editorRef}
            onEditorUpdate={onEditorUpdate}
            isSaving={isSaving}
            lastSaved={lastSaved}
          />
          {/* Output Box */}

          <Output
            showOutput={showOutput}
            output={output}
            outputRef={outputRef}
            outputHeight={outputHeight}
            isResizingOutput={isResizingOutput}
            isLoading={isLoading}
            colour={error ? 'text-red-500' : 'text-grey-400'}
          />
        </div>
        <Chat
  showChat={showChat}
  chatRef={chatRef}
  setChatWidth={setChatWidth}
  chatWidth={chatWidth}
  isResizingChat={isResizingChat}
  messages={projectMessages}
  onSendMessage={onNewMessage}
        />
      </div>
      
    </div>
  );
}

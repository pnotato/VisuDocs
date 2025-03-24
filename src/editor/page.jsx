import { useState, useRef, useEffect } from "react";
import { LuSquareTerminal, LuShare2, LuPlay, LuSettings } from "react-icons/lu";
import {
  HiOutlineChatAlt,
  HiOutlineCloudDownload,
  HiOutlineSave,
} from "react-icons/hi";

import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { executeCode } from "../components/api";
import { axiosp } from "../../proxy"; // import axios from 'axios'
const socket = io("ws://localhost:3000");

import { Editor } from "@monaco-editor/react";

export default function EditorPage() {
  const [showChat, setShowChat] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [outputHeight, setOutputHeight] = useState(200);
  const [chatWidth, setChatWidth] = useState(300);
  const outputRef = useRef(null);
  const chatRef = useRef(null);
  const isResizingOutput = useRef(false);
  const isResizingChat = useRef(false);
  const editorRef = useRef();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectLanguage, setProjectLanguage] = useState("");
  const [projectMessages, setProjectMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
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

  const onMount = async (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    const themeData = await import(
      "monaco-themes/themes/Brilliance Black.json"
    );
    monaco.editor.defineTheme("brilliance-black", themeData);
    monaco.editor.setTheme("brilliance-black");
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="border-b border-gray-800 bg-black">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/icons/icon.png" alt="Logo" className="h-8 w-auto" />
              <input
                type="text"
                defaultValue="Project Name"
                className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <button className="h-10 w-10 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition duration-150 ease-in-out active:scale-95">
                  <LuPlay className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Run Code
                </span>
              </div>

              <div className="relative group">
                <button className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <LuSettings className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Settings
                </span>
              </div>

              <div className="relative group">
                <button className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <HiOutlineSave className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Save File
                </span>
              </div>

              <div className="relative group">
                <button className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
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
                <button className="h-10 w-10 flex items-center justify-center border border-gray-600 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition duration-150 ease-in-out active:scale-95">
                  <LuShare2 className="h-5 w-5" />
                </button>
                <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  Share
                </span>
              </div>

              <div className="ml-2">
                <button className="h-10 px-4 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium transition duration-150 ease-in-out active:scale-95">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div
          className={`flex-1 flex flex-col ${showChat ? "w-2/3" : "w-full"}`}
        >
          <div className="flex-1 overflow-auto px-4 py-2 font-mono text-sm bg-black">
            <Editor onMount={onMount} />
          </div>
          {/* Output Box */}
          {showOutput && (
            <>
              <div
                className="h-1 cursor-ns-resize bg-gray-800"
                onMouseDown={() => (isResizingOutput.current = true)}
              />
              <div
                ref={outputRef}
                style={{ height: `${outputHeight}px` }}
                className="border-t border-gray-700 px-4 py-4 text-sm text-gray-400 bg-gray-950 resize-y overflow-auto font-mono"
              >
                Output will appear here after running code...
              </div>
            </>
          )}
        </div>

        {/* Chat Panel */}
        {showChat && (
          <>
            <div
              className="w-1 cursor-ew-resize bg-gray-800"
              onMouseDown={() => (isResizingChat.current = true)}
            />
            <div
              ref={chatRef}
              style={{ width: `${chatWidth}px` }}
              className="flex flex-col border-l border-gray-800 bg-gray-950"
            >
              <div className="p-2 border-b border-gray-800 font-semibold text-sm">
                Messages
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-1 text-sm space-y-2">
                <div>
                  <p className="text-purple-400 font-semibold">
                    Alice{" "}
                    <span className="text-xs text-gray-500">10:01 AM</span>
                  </p>
                  <p>Started working on the layout.</p>
                </div>
                <div>
                  <p className="text-purple-400 font-semibold">
                    Bob <span className="text-xs text-gray-500">10:05 AM</span>
                  </p>
                  <p>Cool! I’ll hook up the backend next.</p>
                </div>
              </div>
              <div className="border-t border-gray-800 p-2">
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-2 py-1 rounded bg-gray-800 text-white text-sm"
                    placeholder="Type a message..."
                  />
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition duration-150 ease-in-out active:scale-95">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

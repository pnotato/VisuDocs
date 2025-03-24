import { useState, useRef, useEffect } from "react";

export default function EditorPage() {
  const [showChat, setShowChat] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [outputHeight, setOutputHeight] = useState(200);
  const [chatWidth, setChatWidth] = useState(300);
  const outputRef = useRef(null);
  const chatRef = useRef(null);
  const isResizingOutput = useRef(false);
  const isResizingChat = useRef(false);

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

  return (
    <div className="h-screen flex flex-col bg-black text-white">

      <div className="border-b border-gray-800 bg-black">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/icons/icon.png" alt="Logo" className="h-8 w-auto" />
              <a className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium text-white">Project Name</a>
            </div>
            <div className="flex items-center gap-2">
              <button className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Run</button>
              <button className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium">Save</button>
              <button className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium">Download</button>
              <button className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setShowChat(prev => !prev)}>
                {showChat ? 'Hide Chat' : 'Show Chat'}
              </button>
              <button className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium" onClick={() => setShowOutput(prev => !prev)}>
                {showOutput ? 'Hide Output' : 'Show Output'}
              </button>
              <button className="border border-gray-600 px-3 py-2 rounded-md text-sm font-medium">Share</button>
              <div className="ml-2">
                <button className="bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">Sign In</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className={`flex-1 flex flex-col ${showChat ? "w-2/3" : "w-full"}`}>
          <div className="flex-1 overflow-auto px-4 py-2 font-mono text-sm bg-black">
            <p className="text-gray-500">// Write your code here</p>
            <p>console.log('Hello, world!');</p>
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
          <div
            ref={chatRef}
            style={{ width: `${chatWidth}px` }}
            className="relative flex flex-col border-l border-gray-800 bg-gray-950"
          >
            <div
              className="w-1 cursor-ew-resize bg-gray-800 absolute left-0 top-0 bottom-0 z-10"
              onMouseDown={() => (isResizingChat.current = true)}
            />
            <div className="p-2 border-b border-gray-800 font-semibold text-sm">Team Chat</div>
            <div className="flex-1 overflow-y-auto px-2 py-1 text-sm space-y-2">
              <div>
                <p className="text-purple-300 font-semibold">Alice <span className="text-xs text-gray-500">10:01 AM</span></p>
                <p>Started working on the layout.</p>
              </div>
              <div>
                <p className="text-purple-300 font-semibold">Bob <span className="text-xs text-gray-500">10:05 AM</span></p>
                <p>Cool! I’ll hook up the backend next.</p>
              </div>
            </div>
            <div className="border-t border-gray-800 p-2">
              <div className="flex gap-2">
                <input className="flex-1 px-2 py-1 rounded bg-gray-800 text-white text-sm" placeholder="Type a message..." />
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm">Send</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
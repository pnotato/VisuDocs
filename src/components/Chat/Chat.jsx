import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("ws://localhost:3000")

export default function Chat({ messages, showChat, chatRef, chatWidth, isResizingChat, onSendMessage }) {
    const [newMessage, setNewMessage] = useState("");
    
    return(
        <>
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
                <div className="flex-1 overflow-y-auto px-2 py-1 text-sm space-y-2">
  {messages.map((msg, idx) => (
    <div key={idx}>
      <p className="text-purple-400 font-semibold">
        {msg.sender} <span className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleTimeString()}</span>
      </p>
      <p>{msg.text}</p>
    </div>
  ))}
</div>
                </div>
                <div className="border-t border-gray-800 p-2">
                  <div className="flex gap-2">
                  <input
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  className="flex-1 px-2 py-1 rounded bg-gray-800 text-white text-sm"
  placeholder="Type a message..."
/>
<button
  onClick={() => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  }}
  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition duration-150 ease-in-out active:scale-95"
>
  Send
</button>
                  </div>
                </div>
              </div>
            </>
          )}
          </>
    )
}
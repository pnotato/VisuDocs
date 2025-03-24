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

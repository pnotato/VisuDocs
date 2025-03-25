export default function Output({ showOutput, output, outputRef, outputHeight, isResizingOutput, isLoading, colour }) {
    return(
        <>
            {showOutput && (
            <>
              <div
                className="h-1 cursor-ns-resize bg-gray-800"
                onMouseDown={() => (isResizingOutput.current = true)}
              />
              <div
                ref={outputRef}
                style={{ height: `${outputHeight}px` }}
                className={`border-t border-gray-700 px-4 py-4 text-sm ${colour} bg-gray-950 resize-y overflow-auto font-mono`}
              >
                {isLoading ? "Running Code..." : output ? output : "Output will appear here after running code..."}
              </div>
            </>
          )}
        </>
    )
}
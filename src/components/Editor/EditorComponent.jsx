import { Editor } from "@monaco-editor/react";

export default function EditorComponent({
  projectCode,
  projectLanguage,
  editorSize,
  editorRef,
  onEditorUpdate,
  isSaving,
  lastSaved
}) {
  // Monaco Theming
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
    <div className="flex-1 overflow-auto px-4 py-2 font-mono text-sm bg-black relative">
      <Editor
        onChange={(projectCode) => {
          // setValue(value);
          onEditorUpdate(projectCode);
        }}
        onMount={onMount}
        language={projectLanguage}
        value={projectCode}
        options={{
          fontSize: editorSize,
          minimap: {
            enabled: false
          }
        }}
      />
      <div className="absolute bottom-2 right-2 px-2 py-1 text-xs text-gray-300 bg-gray-800 border border-gray-600 rounded">
        {isSaving ? "Saving..." : lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : ""}
      </div>
    </div>
  );
}

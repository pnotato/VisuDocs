import { Editor } from "@monaco-editor/react";

export default function EditorComponent({
  projectCode,
  projectLanguage,
  editorSize,
  editorRef,
  onEditorUpdate
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
    <div className="flex-1 overflow-auto px-4 py-2 font-mono text-sm bg-black">
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
        }}
      />
    </div>
  );
}

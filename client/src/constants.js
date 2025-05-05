export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
}

export const CODE_SNIPPETS = {
    javascript: `function foo() {\n\tconsole.log("Hello, world!");\n}\n\nfoo();\n`,
    typescript: `function foo() {\n\tconsole.log("Hello, world!");\n}\n\nfoo();\n`,
    python: `def foo():\n\tprint("Hello, world!")\n\nfoo()\n`,
    java: `public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello world!");\n\t}\n}\n`,
    csharp:
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello world!");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$str = 'Hello, world!';\necho $str;\n",
  };

export const FILE_EXTENSIONS = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  csharp: "cs",
  php: "php",
}
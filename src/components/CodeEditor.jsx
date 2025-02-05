import { useState, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Code2, Github, Play } from "lucide-react";

const starterCode = {
  javascript: `// JavaScript Playground
console.log("Hello, World!");`,

  cpp: `// C++ Playground
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,

  java: `// Java Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
};

const CodeEditor = () => {
  const [fontSize, setFontSize] = useState(17);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(localStorage.getItem("savedCode") || starterCode[language]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputs, setInput] = useState(""); 

  useEffect(() => {
    localStorage.setItem("savedCode", code);
  }, [code]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setCode(starterCode[selectedLang]);
  };

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://44.198.9.154:3000/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, inputs }), 
      });

      const result = await response.json();
      console.log(result);

      if (result.error) {
        setOutput(`Compilation Error:\n${result.error}`);
      } else {
        setOutput(result.output || "Error: No output received");
      }
    } catch (error) {
      setOutput(`Error executing code: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <header className="border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-blue-500" />
              <div>
                <h1 className="font-semibold">CodeCraft</h1>
                <p className="text-xs text-gray-400">Interactive Code Editor</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 rounded bg-gray-800 px-3 py-1">
              <Github className="h-4 w-4" />
              <span>GitHub Dark</span>
            </button>

            <select
              value={language}
              onChange={handleLanguageChange}
              className="rounded bg-gray-800 px-3 py-1 hover:cursor-pointer"
            >
              <option value="java">☕ Java</option>
              <option value="cpp">🟦 C++</option>
              <option value="javascript">🟨 JavaScript</option>
            </select>

            <button
              onClick={handleRunCode}
              className={`flex items-center hover:cursor-pointer space-x-2 rounded px-3 py-1 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Running...</span>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Run Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Code Editor */}
        <div className="rounded-lg border border-gray-800 bg-[#1E1E1E]">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
            <span className="text-sm text-gray-400">Code Editor</span>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Font Size</span>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="w-24"
              />
              <span className="text-sm text-gray-400">{fontSize}</span>
            </div>
          </div>
          <MonacoEditor
            height="calc(100vh - 320px)"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{ fontSize }}
          />
        </div>

        {/* Output Section */}
        <div className="rounded-lg border border-gray-800 bg-[#1E1E1E]">
          <div className="border-b border-gray-800 px-4 py-2">
            <h2 className="text-sm text-gray-400">Output</h2>
          </div>
          {loading ? (
            <div className="flex h-[calc(50vh-90px)] items-center justify-center text-gray-400">
              <div className="text-center animate-pulse">
                <p>Executing Code...</p>
              </div>
            </div>
          ) : output ? (
            <pre
              className={`p-4 overflow-y-auto whitespace-pre-wrap break-words ${output.includes("Error") || output.includes("Compilation Error")
                ? "text-red-400"
                : "text-white"
              }`}
              style={{ maxHeight: "calc(50vh - 100px)" }}
            >
              {output}
            </pre>
          ) : (
            <div className="flex h-[calc(50vh-90px)] items-center justify-center text-gray-400">
              <div className="text-center">
                <Play className="mx-auto h-8 w-8 opacity-20" />
                <p className="mt-2">Run your code to see the output here...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Field  */}
        <div className="rounded-lg border border-gray-800 bg-[#1E1E1E] col-start-2 col-start-end">
          <div className="px-4 py-2">
            <h2 className="text-sm text-gray-400">Input</h2>
            <textarea
              value={inputs}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-24 mt-2 p-2 rounded bg-gray-700 text-white"
              placeholder="Enter input for the program..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

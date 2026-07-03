import { useState, useEffect } from 'react';
// import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import Editor from "react-simple-code-editor"
import Editor from "@monaco-editor/react";
// import "prismjs/themes/prism-tomorrow.css"
// import Prism from "prismjs"
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import './App.css'

console.log("Editor:", Editor);

function App() {
  // const [count, setCount] = useState(0)

  const [code, setCode] = useState(`function sum() {
  return 1+1; 
}`)

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);

  const [leftWidth, setLeftWidth] = useState(50);

  const [dragging, setDragging] = useState(false);

  async function reviewCode() {
    try {
      setLoading(true);   // Start loading

      const response = await axios.post(
        "https://ai-code-review-m4xu.onrender.com/ai/get-review",
        {
          code: code
        }
      );

      console.log(response.data);

      setReview(response.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);  // Stop loading
    }
  }
  // useEffect(() => {
  //   Prism.highlightAll()
  // })

  function handleMouseMove(e) {
    if (!dragging) return;

    const width = (e.clientX / window.innerWidth) * 100;

    if (width > 20 && width < 80) {
      setLeftWidth(width);
    }
  }

  useEffect(() => {
    function stopDragging() {
      setDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDragging);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDragging);
    };
  }, [dragging]);


  return (
    <>
      <main>
        <div
          className="left"
          style={{ width: `${leftWidth}%` }}
        >
          <div className="code">
            {
              <Editor
                height="500px"
                theme="vs-dark"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
              />

                /* <Editor 
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
                  padding={10}
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                    border: "1px solid #ddd",
                    height: "100%",
                    width: "100%"
                  }}
                />*/ }

          </div>
          <div
            className="review"
            onClick={loading ? null : reviewCode}
            style={{
              backgroundColor: loading ? "#ff9800" : "rgb(219, 219, 255)",
              color: loading ? "white" : "black",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "⏳ Reviewing..." : "Review"}
          </div>
        </div>
        <div
          className="divider"
          onMouseDown={() => setDragging(true)}
        ></div>
        <div
          className="right"
          style={{ width: `${100 - leftWidth}%` }}
        >
          <div className="review-header">
            <h2>🤖 AI Code Reviewer</h2>
          </div>
          {loading ? (
            <div className="loading-text">
              🤖 AI is analyzing your code...<br />
              ✔ Checking syntax...<br />
              ✔ Finding bugs...<br />
              ✔ Looking for optimizations...<br />
              ✔ Generating suggestions...
            </div>
          ) : (
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {review}
            </ReactMarkdown>
          )}
        </div>
      </main>
    </>
  )
}


export default App

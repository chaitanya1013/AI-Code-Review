import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import Editor from "react-simple-code-editor"
import Editor from "@monaco-editor/react";
import "prismjs/themes/prism-tomorrow.css"
import Prism from "prismjs"
import axios from "axios";
import './App.css'

console.log("Editor:", Editor);

function App() {
  const [count, setCount] = useState(0)

  const [code, setCode] = useState(`function sum() {
  return 1+1; 
}`)

  const [review, setReview] = useState("");

  async function reviewCode() {
    try {

        const response = await axios.post(
            "http://localhost:3000/ai/get-review",
            {
                code: code
            }
        );

        setReview(response.data.review);

    } catch (err) {
        console.log(err);
    }
}

  useEffect(() => {
    Prism.highlightAll()
  })
  return (
    <>
      <main>
          <div className="left">
            <div className="code">
                {
                    <Editor
                    height="500px"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value)}
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
            <div className="review" onClick={reviewCode}>Review</div>
          </div>
          <div className="right">{review}</div>
      </main>
    </>
  )
}


export default App

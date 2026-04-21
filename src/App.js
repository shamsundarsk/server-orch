import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);

  const send = async () => {
    if (!input) return;

    setStarted(true);

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch(
      `http://127.0.0.1:8000/ask?q=${encodeURIComponent(input)}`
    );
    const data = await res.json();

    const botMsg = { role: "bot", content: data.answer };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  };

  return (
    <div className={`app ${started ? "chat-mode" : ""}`}>
      {!started && (
        <div className="center">
          <h1>Hi, welcome to Server-Orch</h1>
          <div className="inputBox centerInput">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your servers..."
            />
            <button onClick={send}>→</button>
          </div>
        </div>
      )}

      {started && (
        <>
          <div className="chat">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>

          <div className="inputBox bottomInput">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
            />
            <button onClick={send}>→</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
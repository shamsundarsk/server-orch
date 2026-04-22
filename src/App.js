import { useState } from "react";
import "./App.css";

const API_URL =
  "https://so-serverolrch-ffg3edbranfdcygr.canadacentral-01.azurewebsites.net";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input || loading) return;

    setStarted(true);

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/ask?q=${encodeURIComponent(input)}`
      );

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      const botMsg = {
        role: "bot",
        content: data.answer || "No response from AI",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "⚠️ Failed to connect to backend",
        },
      ]);
    }

    setLoading(false);
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
              onKeyDown={(e) => e.key === "Enter" && send()}
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

            {loading && <div className="msg bot">Thinking...</div>}
          </div>

          <div className="inputBox bottomInput">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send}>→</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
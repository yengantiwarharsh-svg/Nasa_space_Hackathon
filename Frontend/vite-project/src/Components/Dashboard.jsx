import React, { useState } from "react";
import axios from "axios";


const Dashboard = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = localStorage.getItem("username") || "Guest";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", { question });
      const aiAnswer = res.data.answer || res.data.error || "No response from model.";
      setAnswer(aiAnswer);
      setHistory((prev) => [{ question, answer: aiAnswer }, ...prev.slice(0, 4)]); 
    } catch (error) {
      console.error(error);
      setAnswer("❌ Error fetching response from the model.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      
      <header className="dashboard-header">
        <h1 className="dashboard-title">🚀 NASA AI Research Dashboard</h1>
        <div className="user-info">
          <span className="user-icon">👩‍🚀</span>
          <span className="username">Welcome, {username}</span>
        </div>
      </header>

      <div className="dashboard-body">
        
        <aside className="sidebar">
          <h2 className="sidebar-title">🧭 Recent Questions</h2>
          {history.length === 0 ? (
            <p className="no-history">No questions yet.</p>
          ) : (
            <ul className="history-list">
              {history.map((item, index) => (
                <li key={index} className="history-item">
                  <strong>Q:</strong> {item.question}
                  <p className="history-answer">
                    <strong>A:</strong> {item.answer.slice(0, 80)}...
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>

       
        <main className="dashboard-main">
          <form className="query-form" onSubmit={handleSubmit}>
            <label className="form-label">Ask a Scientific Question </label>
            <input
              type="text"
              placeholder="e.g. How does microgravity affect stem cells?"
              className="form-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type="submit" className="form-button" disabled={loading}>
              {loading ? "🔄 Analyzing..." : "💡 Ask AI Developed by Instinct Devs "}
            </button>
          </form>

          {loading && (
            <div className="loading-box">
              <div className="loader"></div>
              <p>AI is analyzing your question...</p>
            </div>
          )}

          {answer && !loading && (
            <div className="answer-box">
              <h2 className="answer-title">🧠 AI Research </h2>
              <p className="answer-text">{answer}</p>
            </div>
          )}
        </main>
      </div>

      
      <footer className="dashboard-footer">
        © {new Date().getFullYear()} NASA Space Hackathon | Built by Instinct Developers
      </footer>
    </div>
  );
};

export default Dashboard;

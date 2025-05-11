import React, { useState } from "react";
import "./index.css"; // make sure this line is here

function App() {
  const [guesses, setGuesses] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [currentResult, setCurrentResult] = useState("");
  const [remainingWords, setRemainingWords] = useState([]);
  const [bestGuess, setBestGuess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedWord = currentWord.trim().toLowerCase();
    const trimmedResult = currentResult.trim().toLowerCase();

    if (trimmedWord.length !== 5 || trimmedResult.length !== 5) {
      setError("Both fields must be exactly 5 characters (no spaces).");
      return;
    }

    const newGuesses = [...guesses, { word: trimmedWord, result: trimmedResult }];
    setGuesses(newGuesses);

    if (trimmedResult === "ggggg") {
      alert("🎉 You solved it! Resetting...");
      resetGame();
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guesses: newGuesses }),
      });

      const data = await res.json();
      setRemainingWords(data.remaining);
      setBestGuess(data.best_guess);
      setError("");
    } catch (err) {
      setError("❌ Couldn't connect to server.");
    }

    setCurrentWord("");
    setCurrentResult("");
  };

  const resetGame = () => {
    setGuesses([]);
    setCurrentWord("");
    setCurrentResult("");
    setRemainingWords([]);
    setBestGuess("");
    setError("");
  };

  const fillGuess = (word) => {
    setCurrentWord(word);
  };

  return (
    <div>
      <h1>🧠 Wordle Solver</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Guess (e.g. crane)"
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
        />
        <input
          type="text"
          placeholder="Result (e.g. bygyg)"
          value={currentResult}
          onChange={(e) => setCurrentResult(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button onClick={resetGame} style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "1rem"
        }}>
          🔁 Restart Game
        </button>
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {guesses.length > 0 && (
        <>
          <h2>Guess History</h2>
          <ul>
            {guesses.map((g, i) => (
              <li key={i}>
                <code
                  style={{ cursor: "pointer" }}
                  title="Click to reuse this guess"
                  onClick={() => fillGuess(g.word)}
                >
                  {g.word}
                </code> — <code>{g.result}</code>
              </li>
            ))}
          </ul>
        </>
      )}

      {remainingWords.length > 0 && (
        <>
          <h2>Remaining Possible Words</h2>
          <div className="word-grid">
            {remainingWords.map((word, i) => (
              <div
              className="word-tile"
              key={i}
              onClick={() => fillGuess(word)}
              title="Click to use this word as your guess"
              style={{ cursor: "pointer" }}
            >
              {word}
            </div>
            
            ))}
          </div>
        </>
      )}

      {bestGuess && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2>💡 Suggested Next Guess</h2>
          <div
            onClick={() => fillGuess(bestGuess)}
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#4caf50",
              cursor: "pointer",
              textDecoration: "underline"
            }}
            title="Click to use this as your next guess"
          >
            {bestGuess}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import { useState } from "react";
import "./PromptBox.css";

const MODELS = ["Phoenix v2", "Alchemy v3", "Kino XL", "DreamShaper", "SDXL Turbo"];

const PromptBox = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Phoenix v2");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      await onGenerate?.({ prompt, model: selectedModel });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prompt-box">
      {/* Header */}
      <div className="prompt-box__header">
        <p className="prompt-box__eyebrow">Try it now</p>
        <h2 className="prompt-box__title">Describe anything. See it instantly.</h2>
      </div>

      {/* Input row */}
      <div className="prompt-box__row">
        <span className="prompt-box__sparkle" aria-hidden="true">✦</span>
        <input
          type="text"
          className="prompt-box__input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          placeholder="A futuristic city at dusk, neon reflections on rain-soaked streets, cinematic..."
          disabled={loading}
        />
        <button
          className={`prompt-box__btn ${loading ? "prompt-box__btn--loading" : ""}`}
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <span className="prompt-box__spinner" />
              Generating…
            </>
          ) : (
            <>✦ Generate</>
          )}
        </button>
      </div>

      {/* Model chips */}
      <div className="prompt-box__models">
        {MODELS.map((m) => (
          <button
            key={m}
            className={`prompt-box__chip ${
              selectedModel === m ? "prompt-box__chip--active" : ""
            }`}
            onClick={() => setSelectedModel(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptBox;
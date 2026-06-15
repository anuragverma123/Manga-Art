import { useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ImageCard from "../../components/ImageCard/ImageCard";
import "./Generate.css";

const Generate = () => {
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);  // File object
  const [imagePreview, setImagePreview]   = useState(null);  // data-URL
  const [model, setModel]         = useState("manga-v1");
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef = useRef(null);

  /* ── Image helpers ──────────────────────────────────── */
  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => loadFile(e.target.files?.[0]);

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ── Drag-and-drop ──────────────────────────────────── */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

/* ── Generate ───────────────────────────────────────── */
  const handleGenerate = async () => {
    if (!selectedImage || loading) return;
    setLoading(true);

    // 1. Pack the binary image file and model metadata into multipart data
    const formData = new FormData();
    formData.append("image", selectedImage); // Matches request.files['image'] in Flask
    formData.append("model", model);

    try {
      // 2. Fire the asynchronous network request straight to your local Flask API
      const response = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Backend process completely successful:", data);
        
        // 3. Inject the successful response metadata straight into the UI results grid
        setResults((prev) => [
          {
            title: data.filename || selectedImage.name.slice(0, 32),
            model: model,
            author: "@you",
            // Right now, we still show imagePreview. Once your ML model is ready, 
            // we will change this to display the transformed manga image URL!
            imageUrl: imagePreview, 
          },
          ...prev,
        ]);
      } else {
        alert(`Server Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Network connection to Flask failed:", error);
      alert("Could not connect to the backend server. Make sure Flask is running on port 5000!");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <DashboardLayout>
      <div className="generate-page">

        {/* Header */}
        <div className="generate-page__header">
          <p className="generate-page__eyebrow">🎨 MAGI Studio</p>
          <h1 className="generate-page__title">Generate Manga Art</h1>
          <p className="generate-page__sub">
            Upload a reference image and let AI transform it into stunning
            manga art.
          </p>
        </div>

        {/* ── Image upload box ──────────────────────────── */}
        <div
          className={`generate-page__dropzone${dragOver ? " generate-page__dropzone--over" : ""}${imagePreview ? " generate-page__dropzone--filled" : ""}`}
          onClick={() => !imagePreview && fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <>
              <img
                src={imagePreview}
                alt="Reference"
                className="generate-page__dropzone-img"
              />
              <div className="generate-page__dropzone-overlay">
                <button
                  className="generate-page__change-btn"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Change image
                </button>
                <button
                  className="generate-page__remove-btn"
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                >
                  ✕ Remove
                </button>
              </div>
            </>
          ) : (
            <div className="generate-page__dropzone-placeholder">
              <div className="generate-page__dropzone-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p className="generate-page__dropzone-title">Drop your image here</p>
              <p className="generate-page__dropzone-sub">or click to browse gallery</p>
              <span className="generate-page__dropzone-types">PNG · JPG · WEBP</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="generate-page__file-input"
          onChange={handleImageChange}
        />

        {/* ── Model selector + Generate button ─────────── */}
        <div className="generate-page__actions">
          <select
            className="generate-page__model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="manga-v1">Manga v1</option>
            <option value="manga-v2">Manga v2</option>
            <option value="anime-xl">Anime XL</option>
            <option value="sketch">Sketch Style</option>
          </select>

          <button
            className={`generate-page__generate-btn${loading ? " generate-page__generate-btn--loading" : ""}`}
            onClick={handleGenerate}
            disabled={!selectedImage || loading}
          >
            {loading ? (
              <><span className="generate-page__spinner" />Generating…</>
            ) : (
              "✦ Generate"
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <section className="generate-page__results">
            <p className="generate-page__results-label">
              Your generations ({results.length})
            </p>
            <div className="generate-page__grid">
              {results.map((item, i) => (
                <ImageCard key={i} {...item} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {results.length === 0 && !loading && (
          <div className="generate-page__empty">
            <div className="generate-page__empty-icon">✦</div>
            <p className="generate-page__empty-title">Your Canvas Awaits</p>
            <p className="generate-page__empty-sub">
              Upload a reference image above, pick a style, and hit Generate.
            </p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Generate;
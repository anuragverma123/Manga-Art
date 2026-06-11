import { useState, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Hero from "../../components/Hero/Hero";
import ImageCard from "../../components/ImageCard/ImageCard";
import "./Home.css";

/* ── Sample community images ────────────────────────── */
const FEATURED = [
  { title: "Celestial Wanderer", model: "Phoenix v2",   author: "@astr0_kai", tall: true,  imageUrl: null },
  { title: "Forest Growth",      model: "Alchemy v2",   author: "@verde",     tall: false, imageUrl: null },
  { title: "Core Reactor",       model: "SDXL",         author: "@reaktor",   tall: false, imageUrl: null },
  { title: "Cyber Hex",          model: "Kino XL",      author: "@hexr",      tall: false, imageUrl: null },
  { title: "Orbital Ring",       model: "DreamShaper",  author: "@orbit",     tall: false, imageUrl: null },
  { title: "Flow State",         model: "Alchemy v2",   author: "@floww",     tall: false, imageUrl: null },
];

const FEATURES = [
  { icon: "🎨", title: "AI Manga Generation",    desc: "Transform images into stunning manga characters, scenes, and story panels using advanced AI." },
  { icon: "✏️", title: "Manga Canvas",           desc: "Sketch ideas and enhance them with AI. Turn rough concepts into detailed manga artwork instantly." },
  { icon: "🌟", title: "Style Consistency",      desc: "Maintain a consistent manga style across characters, environments, and story panels." },
  { icon: "🚀", title: "High-Quality Rendering", desc: "Generate crisp, detailed manga artwork optimised for digital publishing and sharing." },
  { icon: "🖌️", title: "Smart Editing",          desc: "Modify specific parts of your artwork while preserving the overall composition and style." },
  { icon: "🤖", title: "Custom AI Models",       desc: "Fine-tune AI models for unique manga styles, characters, and storytelling experiences." },
];

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [model,         setModel]         = useState("manga-v1");
  const [loading,       setLoading]       = useState(false);
  const [dragOver,      setDragOver]      = useState(false);
  const fileInputRef = useRef(null);

  /* ── Image helpers ──────────────────────────────────── */
  const loadFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  /* ── Generate ───────────────────────────────────────── */
  const handleGenerate = async () => {
    if (!selectedImage) return;
    setLoading(true);

    // TODO: replace with your real API call, e.g.:
    // const formData = new FormData();
    // formData.append("model", model);
    // formData.append("image", selectedImage);
    // const res = await generateImage(formData);

    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
  };

  /* ── Render ─────────────────────────────────────────── */
  return (
    <DashboardLayout>
      <div className="home">

        {/* Hero */}
        <Hero />

        {/* ── Image upload box ──────────────────────────── */}
        <section className="home__section">

          <p className="home__eyebrow">🎨 Start Creating</p>
          <h2 className="home__section-title">Upload &amp; Generate</h2>
          <p className="home__section-sub">
            Drop in a reference image and let AI transform it into manga art.
          </p>

          {/* Dropzone */}
          <div
            className={`home__dropzone${dragOver ? " home__dropzone--over" : ""}${imagePreview ? " home__dropzone--filled" : ""}`}
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
                  className="home__dropzone-img"
                />
                <div className="home__dropzone-overlay">
                  <button
                    className="home__change-btn"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    Change image
                  </button>
                  <button
                    className="home__remove-btn"
                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                  >
                    ✕ Remove
                  </button>
                </div>
              </>
            ) : (
              <div className="home__dropzone-placeholder">
                <div className="home__dropzone-icon">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <p className="home__dropzone-title">Drop your image here</p>
                <p className="home__dropzone-sub">or click to browse gallery</p>
                <span className="home__dropzone-types">PNG · JPG · WEBP</span>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="home__file-input"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />

          {/* Model + Generate */}
          <div className="home__upload-actions">
            <select
              className="home__model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option value="manga-v1">Manga v1</option>
              <option value="manga-v2">Manga v2</option>
              <option value="anime-xl">Anime XL</option>
              <option value="sketch">Sketch Style</option>
            </select>

            <button
              className={`home__generate-btn${loading ? " home__generate-btn--loading" : ""}`}
              onClick={handleGenerate}
              disabled={!selectedImage || loading}
            >
              {loading
                ? <><span className="home__spinner" />Generating…</>
                : "✦ Generate"}
            </button>
          </div>
        </section>

        {/* Community gallery */}
        <section className="home__section">
          <div className="home__section-header">
            <div>
              <p className="home__eyebrow">Community showcase</p>
              <h2 className="home__section-title">What creators are making today</h2>
            </div>
            <button className="home__view-all">View all →</button>
          </div>
          <div className="home__gallery">
            {FEATURED.map((item, i) => (
              <ImageCard key={i} {...item} />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="home__section">
          <p className="home__eyebrow">Core tools</p>
          <h2 className="home__section-title home__section-title--wide">
            Everything You Need to Create Amazing Manga Art
          </h2>
          <p className="home__section-sub">
            From character generation to scene creation and manga storytelling — one platform, endless imagination.
          </p>
          <div className="home__features">
            {FEATURES.map((f, i) => (
              <div className="home__feature-card" key={i}>
                <div className="home__feature-icon">{f.icon}</div>
                <h3 className="home__feature-title">{f.title}</h3>
                <p className="home__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="home__section">
          <p className="home__eyebrow">Your dashboard</p>
          <h2 className="home__section-title">📖 Your Manga Dashboard</h2>
          <div className="home__stats">
            <div className="home__stat-card">
              <p className="home__stat-num">250</p>
              <p className="home__stat-label">Images Generated</p>
              <span className="home__stat-badge home__stat-badge--green">↑ +18 this week</span>
            </div>
            <div className="home__stat-card">
              <p className="home__stat-num">35</p>
              <p className="home__stat-label">Saved Creations</p>
              <span className="home__stat-badge home__stat-badge--green">↑ +4 today</span>
            </div>
            <div className="home__stat-card">
              <p className="home__stat-num">12</p>
              <p className="home__stat-label">Favourite Styles</p>
              <span className="home__stat-badge home__stat-badge--purple">★ 3 new unlocked</span>
            </div>
            <div className="home__stat-card">
              <p className="home__stat-num home__stat-num--purple">750</p>
              <p className="home__stat-label">Credits Remaining</p>
              <div className="home__credits-bar">
                <div className="home__credits-fill" style={{ width: "62%" }} />
              </div>
              <p className="home__credits-hint">62% of monthly plan</p>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Home;
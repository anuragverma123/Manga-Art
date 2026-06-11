import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      {/* Badge */}
      <div className="hero__badge">
        <span className="hero__badge-dot" />
        Now with real-time canvas generation
      </div>

      {/* Headline */}
      <h1 className="hero__title">
        Transform Your Ideas
        <br />
        with{" "}
        <span className="hero__title-gradient">into Amazing Manga Art</span>
        <br />
        with AI
      </h1>

      {/* Subtext */}
      <p className="hero__sub">
      Generate stunning manga characters, scenes, and story panels from simple text prompts in seconds. Powered by advanced AI creativity.
      </p>

      {/* CTA Buttons */}
      <div className="hero__cta">
        <button className="hero__btn hero__btn--primary">
          Start creating free →
        </button>
        <button className="hero__btn hero__btn--ghost">
          Explore the gallery
        </button>
      </div>

      {/* Stats bar */}
      <div className="hero__stats">
        {[
          { num: "4M+", label: "Active creators" },
          { num: "1.2B", label: "Images generated" },
          { num: "500+", label: "Fine-tuned models" },
          { num: "99%", label: "Uptime guarantee" },
        ].map((s) => (
          <div className="hero__stat" key={s.label}>
            <span className="hero__stat-num">{s.num}</span>
            <span className="hero__stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
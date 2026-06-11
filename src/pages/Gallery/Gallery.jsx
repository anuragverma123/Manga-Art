import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ImageCard from "../../components/ImageCard/ImageCard";
import "./Gallery.css";

const FILTERS = ["All", "Phoenix v2", "Alchemy v3", "Kino XL", "DreamShaper", "SDXL Turbo"];

const ALL_IMAGES = [
  { title: "Celestial Wanderer", model: "Phoenix v2",  author: "@astr0_kai", tall: true,  imageUrl: null },
  { title: "Forest Growth",      model: "Alchemy v3",  author: "@verde",     tall: false, imageUrl: null },
  { title: "Core Reactor",       model: "SDXL Turbo",  author: "@reaktor",   tall: false, imageUrl: null },
  { title: "Cyber Hex",          model: "Kino XL",     author: "@hexr",      tall: false, imageUrl: null },
  { title: "Orbital Ring",       model: "DreamShaper", author: "@orbit",     tall: false, imageUrl: null },
  { title: "Flow State",         model: "Alchemy v3",  author: "@floww",     tall: false, imageUrl: null },
  { title: "Neon Bloom",         model: "Phoenix v2",  author: "@bloom",     tall: false, imageUrl: null },
  { title: "Iron Dream",         model: "Kino XL",     author: "@dreamer",   tall: true,  imageUrl: null },
  { title: "Solaris",            model: "DreamShaper", author: "@solari",    tall: false, imageUrl: null },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? ALL_IMAGES
      : ALL_IMAGES.filter((img) => img.model === activeFilter);

  return (
    <DashboardLayout>
      <div className="gallery-page">

        {/* Header */}
        <div className="gallery-page__header">
          <p className="gallery-page__eyebrow">Community</p>
          <h1 className="gallery-page__title">Explore Manga Creations</h1>
          <p className="gallery-page__sub">
            Browse amazing AI-generated manga characters, scenes, and stories created by the MAGI community.
          </p>
        </div>

        {/* Filters */}
        <div className="gallery-page__filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`gallery-page__filter-chip ${
                activeFilter === f ? "gallery-page__filter-chip--active" : ""
              }`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-page__grid">
          {filtered.map((item, i) => (
            <ImageCard key={i} {...item} />
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Gallery;
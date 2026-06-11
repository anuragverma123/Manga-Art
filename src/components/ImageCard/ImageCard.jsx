import "./ImageCard.css";

const ImageCard = ({
  imageUrl = null,
  title = "Untitled",
  model = "Phoenix v2",
  author = "@user",
  tall = false,
  onClick,
}) => {
  return (
    <div
      className={`image-card ${tall ? "image-card--tall" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      {/* Image or placeholder */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="image-card__img"
          loading="lazy"
        />
      ) : (
        <div className="image-card__placeholder">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span>{title}</span>
        </div>
      )}

      {/* Hover overlay */}
      <div className="image-card__overlay">
        <div className="image-card__overlay-content">
          <p className="image-card__overlay-title">{title}</p>
          <p className="image-card__overlay-meta">
            {model} · {author}
          </p>
        </div>

        {/* Action icons */}
        <div className="image-card__overlay-actions">
          <button
            className="image-card__action-btn"
            aria-label="Like"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <button
            className="image-card__action-btn"
            aria-label="Save"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
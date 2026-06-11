import DashboardLayout from "../../layouts/DashboardLayout";
import ImageCard from "../../components/ImageCard/ImageCard";
import "./Profile.css";

const MY_IMAGES = [
  { title: "My First Gen",  model: "Phoenix v2",  author: "@you", imageUrl: null },
  { title: "Dark Forest",   model: "Alchemy v3",  author: "@you", imageUrl: null },
  { title: "Chrome City",   model: "Kino XL",     author: "@you", imageUrl: null },
  { title: "Lava Fields",   model: "DreamShaper", author: "@you", imageUrl: null },
];

const Profile = () => {
  return (
    <DashboardLayout>
      <div className="profile-page">

        {/* Avatar + info */}
        <div className="profile-page__header">
          <div className="profile-page__avatar">V</div>
          <div>
            <h1 className="profile-page__name">TEAM ASPIRONS 🚀</h1>
            <p className="profile-page__handle">teamaspirons@gmail.com</p>
            <p className="profile-page__bio">
          🚀 Building MAGI · Where AI Meets Manga Creativity
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-page__stats">
          {[
            { num: "250", label: "Images" },
            { num: "35",  label: "Saved" },
            { num: "12",  label: "Styles" },
            { num: "750", label: "Credits" },
          ].map((s) => (
            <div className="profile-page__stat" key={s.label}>
              <span className="profile-page__stat-num">{s.num}</span>
              <span className="profile-page__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Creations */}
        <section className="profile-page__section">
          <h2 className="profile-page__section-title">Your Creations</h2>
          <div className="profile-page__grid">
            {MY_IMAGES.map((img, i) => (
              <ImageCard key={i} {...img} />
            ))}
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
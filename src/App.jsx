import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home     from "./pages/Home/Home";
import Gallery  from "./pages/Gallery/Gallery";
import Generate from "./pages/Generate/Generate";
import Profile  from "./pages/Profile/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/gallery"  element={<Gallery />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/profile"  element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
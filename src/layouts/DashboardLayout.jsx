import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import "./DashboardLayout.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      {/* Top navbar (visible on mobile, hidden on desktop where sidebar takes over) */}
      <div className="dashboard-layout__topbar">
        <Navbar />
      </div>

      <div className="dashboard-layout__body">
        {/* Sidebar (desktop only) */}
        <Sidebar />

        {/* Main content */}
        <main className="dashboard-layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
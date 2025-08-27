import { News } from "./News.jsx";
import Topbar from "./Topbar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <Topbar />

      {/* Main content + News */}
      <div className="flex flex-1 w-full max-w-[1200px] mx-auto mt-4 px-4 gap-6">
        {/* Main content */}
        <div className="flex-1 h-[calc(100vh-64px)] overflow-y-auto">
          <Outlet />
        </div>

        {/* Sidebar / News */}
        <div className="w-[350px] hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16">
          <News />
        </div>
      </div>
    </div>
  );
}

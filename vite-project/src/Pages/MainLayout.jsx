import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar.jsx";

const MainLayout = () => {
  return (
    <div className="pt-20 flex flex-col absolute  h-screen"> {/* Push content below navbar */}
      <LeftSidebar />
      <div className="flex-1 fixed w-screen bg-gray-100 ">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

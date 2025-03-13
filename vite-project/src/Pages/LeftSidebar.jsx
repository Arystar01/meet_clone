import React from "react";
import { FaVideo } from "react-icons/fa";
import { IoChatbubbleEllipses, IoNotificationsCircleSharp } from "react-icons/io5";
import { RiUserCommunityFill } from "react-icons/ri";

const LeftSidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-20 bg-purple-300 flex items-center justify-between px-10 shadow-md z-50">
      {/* Logo */}
      <div className="text-xl font-bold">Logo</div>

      {/* Navigation Links */}
      <div className="flex gap-10">
        <a href="/" className="flex gap-2 items-center text-lg text-gray-800 hover:text-white">
          <FaVideo /> MEET
        </a>
        <a href="/chat" className="flex gap-2 items-center text-lg text-gray-800 hover:text-white">
          <IoChatbubbleEllipses /> Chats
        </a>
        <a href="/community" className="flex gap-2 items-center text-lg text-gray-800 hover:text-white">
          <RiUserCommunityFill /> Community
        </a>
        <a href="/activity" className="flex gap-2 items-center text-lg text-gray-800 hover:text-white">
          <IoNotificationsCircleSharp /> Activity
        </a>
      </div>
    </div>
  );
};

export default LeftSidebar;

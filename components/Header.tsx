import React from "react";
import ThemeToggleButton from "./models/ModeToggle";

interface HeaderProps {
  userName: string;
  profileImage: string;
}

const Header: React.FC<HeaderProps> = ({ userName, profileImage }) => {
  return (
    <header className="fixed-top d-flex justify-content-between align-items-center p-2 shadow-sm bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 transition-colors duration-300">
      {/* Whiteboard Name */}
      <h1 className="fs-5 mb-0 text-gray-900 dark:text-white">Whiteboard</h1>

      {/* User Profile Section */}
      <div className="d-flex align-items-center">
        <img
          src={profileImage}
          alt="User Avatar"
          className="rounded-circle me-2"
          style={{ width: "35px", height: "35px" }}
        />
        <span className="fs-6 d-none d-md-inline text-gray-900 dark:text-white">
          {userName}
        </span>
      </div>

      {/* Theme Toggle Button */}
      <ThemeToggleButton />
    </header>
  );
};

export default Header;

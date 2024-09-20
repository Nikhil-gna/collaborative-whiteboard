"use client";
import React from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const ThemeToggleButton = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
      className="bg-gray-800 dark:bg-gray-50 hover:bg-gray-600 dark:hover:bg-gray-300 transition-all duration-100 p-2 rounded-full shadow-lg flex justify-center items-center"
      style={{ width: "40px", height: "40px" }}
    >
      {currentTheme === "dark" ? (
        <FontAwesomeIcon icon={faSun} className="text-yellow-400 text-lg" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="text-zinc-50 text-lg" />
      )}
    </button>
  );
};

export default ThemeToggleButton;

import dynamic from "next/dynamic";
import React from "react";

// Dynamically import Whiteboard to prevent SSR
const Whiteboard = dynamic(() => import("../components/Main"), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <div>
      <h1>Real-Time Collaborative Whiteboard</h1>
      <Whiteboard />
    </div>
  );
};

export default Home;

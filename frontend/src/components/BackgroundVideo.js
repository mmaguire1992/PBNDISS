import React from 'react';

// Define a functional component for background video
const BackgroundVideo = () => {
  // Define the path to the video file
  const videoPath = "/production_id_4825102 (2160p).mp4";

  return (
    // Render a div container with a background video
    <div className="background-video">
      <video autoPlay loop muted style={{
        // Set styles for the video element
        position: "fixed",
        width: "100%",
        left: "50%",
        top: "50%",
        height: "100%",
        objectFit: "cover",
        transform: "translate(-50%, -50%)",
        zIndex: "-1"
      }}>
        <source src={videoPath} type="video/mp4" />
      </video>
    </div>
  );
};

export default BackgroundVideo;

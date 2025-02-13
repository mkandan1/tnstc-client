import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Maintenance = () => {
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      if (timeRemaining > 0) {
        setTimeRemaining(timeRemaining - 1);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (timeInSeconds) => {
    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(timeInSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center flex flex-col items-center bg-white shadow-xl p-8 rounded-lg w-full max-w-md">
        <Icon icon="noto:building-construction" className="text-8xl flex  text-yellow-500 mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 tracking-tight">We’re currently undergoing maintenance</h1>
        <p className="text-sm text-gray-600 mb-20 tracking-tight">The site will be back online shortly. Thank you for your patience!</p>

        {/* <div className="text-lg flex justify-center gap-x-2 font-semibold text-red-500 my-9">
          <p>Back in:</p>
          <span>{formatTime(timeRemaining)}</span>
        </div> */}

        <div className="mt-8 text-gray-500 text-sm">
          <p>&copy; 2024 Bright Academy. Developed with ❤️ by Looficats.</p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;

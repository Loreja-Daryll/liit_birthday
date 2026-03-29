import React, { useState } from 'react';
import RoomPage from './components/RoomPage';
import GardenPage from './components/GardenPage';
import './index.css';

export default function App() {
  const [isLanding, setIsLanding] = useState(false);

  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-hidden font-sans">
      {/* Global Shooting Stars Effect */}
      <div className="stars-container">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>

      {!isLanding ? (
        /* Kapag pinindot yung lamp, magiging true ang isLanding */
        <RoomPage onEnter={() => setIsLanding(true)} />
      ) : (
        /* Button sa Garden para makabalik sa Room kung gusto */
        <GardenPage onBack={() => setIsLanding(false)} />
      )}
    </div>
  );
}
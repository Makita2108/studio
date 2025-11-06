
import React, { useState, useEffect } from 'react';

// Define the structure for a single animation frame (a "pose")
type AnimationPose = {
  transform: string;
};

// Create the 5 specific poses for our stop-motion dance
const dancePoses: AnimationPose[] = [
  { transform: 'rotate(0deg)' },         // 1. Center
  { transform: 'rotate(-4deg)' },        // 2. Tilt Left
  { transform: 'rotate(0deg)' },         // 3. Center
  { transform: 'rotate(4deg)' },         // 4. Tilt Right
  { transform: 'rotate(0deg)' },         // 5. Center
];

type PlantAnimationProps = {
  moistureLevel: number;
};

export const PlantAnimation: React.FC<PlantAnimationProps> = ({ moistureLevel }) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);

  const getPlantState = () => {
    if (moistureLevel < 40) return 'droopy';
    if (moistureLevel > 85) return 'overwatered';
    return 'healthy';
  };

  const plantState = getPlantState();

  // This effect runs the animation loop
  useEffect(() => {
    let animationInterval: NodeJS.Timeout | undefined;

    if (plantState === 'healthy') {
      // If the plant is healthy, start the dance loop
      animationInterval = setInterval(() => {
        setCurrentPoseIndex(prevIndex => (prevIndex + 1) % dancePoses.length);
      }, 400); // Switch pose every 400ms
    }

    // This is a cleanup function. It runs when the plant is no longer healthy
    // or when the component is removed.
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [plantState]); // Re-run this effect whenever the plant's state changes

  // --- Prepare Styles based on State ---

  const basePlantStyle: React.CSSProperties = {
    // Use a transition to make the move between poses smooth
    transition: 'transform 0.4s ease-in-out',
    transformOrigin: 'bottom center',
  };

  let activePlantStyle: React.CSSProperties = { ...basePlantStyle };

  // Apply the correct style based on the plant's state
  if (plantState === 'healthy') {
    activePlantStyle.transform = dancePoses[currentPoseIndex].transform;
  } else if (plantState === 'droopy') {
    activePlantStyle.transform = 'rotate(2deg) scale(0.95)';
  } else if (plantState === 'overwatered') {
    activePlantStyle.transform = 'translateY(5px)';
  }
  
  // Specific tweaks for the droopy state
  const droopyLeafStyle: React.CSSProperties = plantState === 'droopy' ? { transform: 'rotate(20deg)', transformOrigin: 'bottom right' } : {};
  const droopyRightLeafStyle: React.CSSProperties = plantState === 'droopy' ? { transform: 'rotate(-20deg)', transformOrigin: 'bottom left' } : {};
  const droopyFlowerStyle: React.CSSProperties = plantState === 'droopy' ? { transform: 'rotate(15deg)', transformOrigin: 'center' } : {};

  // --- Sub-Components for Faces and Icons ---

  const Face = () => {
    if (plantState === 'droopy') return (<><circle cx="46" cy="30" r="1.5" fill="black" /><circle cx="54" cy="30" r="1.5" fill="black" /><path d="M47 36 q3 -4 6 0" stroke="black" strokeWidth="1" fill="none" /></>);
    if (plantState === 'overwatered') return (<><circle cx="46" cy="30" r="1.5" fill="black" /><circle cx="54" cy="30" r="1.5" fill="black" /><path d="M47 36 h6" stroke="black" strokeWidth="1" fill="none" /></>);
    return (<><circle cx="46" cy="30" r="1.5" fill="black" /><circle cx="54" cy="30" r="1.5" fill="black" /><path d="M47 35 q3 4 6 0" stroke="black" strokeWidth="1.2" fill="none" /></>);
  };

  const Sun = () => (<g style={{ opacity: plantState !== 'droopy' ? 1 : 0, transition: 'opacity 0.5s' }}><circle cx="25" cy="15" r="8" fill="yellow" /><line x1="25" y1="5" x2="25" y2="25" stroke="yellow" strokeWidth="2" /><line x1="15" y1="15" x2="35" y2="15" stroke="yellow" strokeWidth="2" /><line x1="18" y1="8" x2="32" y2="22" stroke="yellow" strokeWidth="2" /><line x1="18" y1="22" x2="32" y2="8" stroke="yellow" strokeWidth="2" /></g>);
  const SadCloud = () => (<g style={{ opacity: plantState === 'droopy' ? 1 : 0, transition: 'opacity 0.5s' }}><path d="M70 25 q-5 0 -5 -5 a5 5 0 0 1 5 -5 q0 -5 5 -5 a5 5 0 0 1 5 5 q5 0 5 5 a5 5 0 0 1 -5 5z" fill="#A0A0A0"/><line x1="72" y1="30" x2="70" y2="35" stroke="#4682B4" strokeWidth="2"/><line x1="78" y1="30" x2="76" y2="35" stroke="#4682B4" strokeWidth="2"/><path d="M72 20 q3 -4 6 0" stroke="black" strokeWidth="1" fill="none" /></g>);

  return (
    <div className="w-48 h-48 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <Sun />
        <SadCloud />
        <path d="M20 85 h60 v10 h-60 z" fill="#D2B48C" />
        <path d="M25 70 h50 l-5 15 h-40 z" fill="#8B4513" />
        <path d="M25 70 h50 a25,5 0 0,0 -50,0" fill="#5C4033" />
        
        {/* The entire plant group is animated using the active style */}
        <g style={activePlantStyle}>
          <path d="M50 70 Q 52 50 50 30" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" />
          
          <path d="M50 55 Q 40 50 30 40 C 35 50 45 55 50 55" fill="hsl(var(--primary))" style={droopyLeafStyle} />
          <path d="M50 55 Q 60 50 70 40 C 65 50 55 55 50 55" fill="hsl(var(--primary))" style={droopyRightLeafStyle} />
          <path d="M50 45 Q 42 40 35 30 C 40 38 48 43 50 45" fill="hsl(var(--primary))" style={droopyLeafStyle} />
          <path d="M50 45 Q 58 40 65 30 C 60 38 52 43 50 45" fill="hsl(var(--primary))" style={droopyRightLeafStyle} />

           <g style={droopyFlowerStyle}>
            <circle cx="50" cy="32" r="14" fill="hsl(var(--accent))" opacity="0.8"/>
            <circle cx="50" cy="32" r="10" fill="hsl(var(--accent))" />
            <Face />
          </g>
        </g>
      </svg>
    </div>
  );
};

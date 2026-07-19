import { useEffect, useRef } from 'react'

// Pixel art Conan the Barbarian using CSS/SVG — no external images
export default function ConanCharacter({ state = 'idle', direction = 'right', levelProgress = 0 }) {
  // state: idle | walking | attacking | victory | levelup | bossfight
  const animClass = `conan-${state} conan-dir-${direction}`

  return (
    <div className={`conan-wrapper ${animClass}`} aria-label="Conan the Barbarian">
      <svg
        viewBox="0 0 32 40"
        width="64"
        height="80"
        className="conan-sprite"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* === BODY ARMOR (leather/worn) === */}
        <rect x="10" y="16" width="12" height="12" fill="#6B4C2A" />
        <rect x="11" y="17" width="10" height="10" fill="#8B6340" />
        {/* Belt */}
        <rect x="9" y="26" width="14" height="3" fill="#3D2B1F" />
        <rect x="13" y="25" width="6" height="5" fill="#FFD700" />

        {/* === LEGS === */}
        <rect x="10" y="28" width="5" height="10" fill="#5B3C2A" />
        <rect x="17" y="28" width="5" height="10" fill="#5B3C2A" />
        {/* Boots */}
        <rect x="9" y="36" width="6" height="4" fill="#2A1A10" />
        <rect x="17" y="36" width="6" height="4" fill="#2A1A10" />

        {/* === ARMS === */}
        <rect x="5" y="16" width="5" height="12" fill="#C49A6C" /> {/* left arm skin */}
        <rect x="22" y="16" width="5" height="12" fill="#C49A6C" /> {/* right arm skin */}

        {/* === SWORD (right arm) === */}
        {/* Sword handle */}
        <rect x="25" y="14" width="2" height="8" fill="#3D2B1F" />
        {/* Sword guard */}
        <rect x="23" y="20" width="6" height="2" fill="#C0C0C0" />
        {/* Sword blade */}
        <rect x="25.5" y="0" width="2" height="22" fill="#D8D8D8" />
        <rect x="25.5" y="0" width="2" height="3" fill="#E8E8FF" />

        {/* === HEAD === */}
        <rect x="10" y="6" width="12" height="12" fill="#C49A6C" /> {/* face */}

        {/* === HELMET (horned Viking style) === */}
        <rect x="9" y="4" width="14" height="8" fill="#4A4A5A" />
        <rect x="10" y="5" width="12" height="6" fill="#5A5A6A" />
        {/* Horns */}
        <rect x="5" y="2" width="4" height="8" fill="#E8D5A3" />
        <rect x="23" y="2" width="4" height="8" fill="#E8D5A3" />
        {/* Horn tips */}
        <rect x="4" y="0" width="2" height="3" fill="#D4C090" />
        <rect x="26" y="0" width="2" height="3" fill="#D4C090" />

        {/* === HAIR (flowing dark) === */}
        <rect x="8" y="10" width="3" height="8" fill="#1A0A00" />
        <rect x="7" y="12" width="2" height="6" fill="#1A0A00" />

        {/* === FACE === */}
        {/* Eyes */}
        <rect x="11" y="9" width="3" height="2" fill="#1A0A00" />
        <rect x="18" y="9" width="3" height="2" fill="#1A0A00" />
        {/* Beard */}
        <rect x="11" y="13" width="10" height="4" fill="#1A0A00" />
        <rect x="12" y="14" width="8" height="3" fill="#2A1A00" />

        {/* === SHOULDER GUARDS === */}
        <rect x="7" y="15" width="5" height="4" fill="#4A4A5A" />
        <rect x="20" y="15" width="5" height="4" fill="#4A4A5A" />
      </svg>

      {/* Attack effect */}
      {state === 'attacking' && (
        <div className="conan-attack-effect">
          <svg viewBox="0 0 60 40" width="60" height="40">
            <polygon points="0,20 30,5 60,20 30,35" fill="rgba(255,200,50,0.7)" />
            <polygon points="10,20 30,10 50,20 30,30" fill="rgba(255,255,100,0.9)" />
          </svg>
        </div>
      )}

      {/* Level up glow */}
      {state === 'levelup' && <div className="conan-levelup-glow" />}
    </div>
  )
}

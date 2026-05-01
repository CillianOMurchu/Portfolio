import { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useOrbOrigin } from "./OrbOriginContext";
import "./NameAnimations.css";
import NameDisplay from "./NameDisplay";
import NameInfoBox from "./NameInfoBox";
import OrbTrace from "./OrbTrace";

const NAME = "CILLIAN Ó MURCHÚ";
const NAME_LETTERS = NAME.split("");
const O_INDEX = NAME.indexOf("Ó");
const BIO_TEXT =
  "Full-stack engineer specializing in modern web technologies and creative digital experiences.";
const HEXAGON_CLIP =
  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";
const TYPING_INTERVAL_MS = 30;
const HOVER_DELAY_MS = 800;

export function Name() {
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(false);
  const [orbStart, setOrbStart] = useState({ x: 50, y: 100 });
  const [displayedText, setDisplayedText] = useState("");
  const oCharRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showText) return;
    let index = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (index < BIO_TEXT.length) {
        setDisplayedText(BIO_TEXT.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, TYPING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [showText]);

  useEffect(() => {
    if (isHovered) {
      const timer = setTimeout(() => setShowText(true), HOVER_DELAY_MS);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isHovered]);

  const { setOrbOrigin, setOCharPosition } = useOrbOrigin();
  useLayoutEffect(() => {
    if (oCharRef.current) {
      const oRect = oCharRef.current.getBoundingClientRect();
      const center = {
        x: oRect.left + oRect.width / 2,
        y: oRect.top + oRect.height / 2,
      };
      setOrbOrigin(center);
      setOCharPosition(center);
    }
    if (isHovered && oCharRef.current && containerRef.current) {
      const oRect = oCharRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const oCenterX = oRect.left + oRect.width / 2;
      const oCenterY = oRect.top + oRect.height / 2;
      setOrbStart({
        x: ((oCenterX - containerRect.left) / containerRect.width) * 100,
        y: ((oCenterY - containerRect.top) / containerRect.height) * 100,
      });
    }
  }, [isHovered, setOrbOrigin, setOCharPosition]);

  return (
    <div className="relative">
      <div
        className="relative w-40 h-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        ref={containerRef}
      >
        <div className="absolute inset-0" />
        <div
          className="absolute inset-3 border border-accent-subtle"
          style={{ clipPath: HEXAGON_CLIP }}
        />
        <NameDisplay
          letters={NAME_LETTERS}
          oIndex={O_INDEX}
          oCharRef={oCharRef}
        />
        <OrbTrace isHovered={isHovered} orbStart={orbStart} />
      </div>
      {isHovered && (
        <NameInfoBox
          showText={showText}
          displayedText={displayedText}
          bioText={BIO_TEXT}
        />
      )}
    </div>
  );
}
